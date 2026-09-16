# Economics

The mechanism is a market. The market has to actually work for the parties involved — not just be defensible against attackers. This file walks the incentive traps head-on.

---

## 1 · Free-rider problem

**Setup.** Executor A does the expensive work (rebalance, deposit, etc.); Executor B calls `claim()` in the same block after A's tx lands.

**Reality.** In Solana's ordering, both txs are in the block; only one `claim()` succeeds (the one the leader schedules first). If B's read of state includes A's write, B may win the 25%. This is the classic MEV pattern.

**Design response.** Documented in `docs/mev.md`. STATEKEEP's MVP explicitly accepts first-valid-wins on the immediate 25%. The 75% is bound to the winning executor's pubkey; a free-rider who did not do the real work still has to hold state through the durability window, or lose the 75% and their bond.

**Practical bound.** If A's action created a durable improvement, B free-rides on the 25% but keeps the durable state. The protocol is not worse off; A is. The remedy is: A does not perform expensive setup in advance of an atomic-claim compatible ordering, or A does the setup as part of the `claim()` invocation (via CPI or bundled instructions).

---

## 2 · Claim sniping

**Setup.** A high-quality executor A prepares a recovery over N slots. A sniper B watches the mempool, submits an identical claim tx as soon as A's setup lands.

**Impact.** Same as free-rider on the 25%; less severe than commonly feared because the 75% cannot be sniped from the winning executor.

**Response.** Same as above. Production-grade improvement paths (private submission, sealed-bid) are catalogued in `docs/mev.md`.

---

## 3 · Bounty stealing

**Setup.** Once market conditions favor payout, an unrelated party rushes a `claim()` that would not have satisfied the predicate without prior work by others.

**Impact.** Same as sniping if the predicate is memoryless — a state-only predicate has no notion of "who did the work." STATEKEEP explicitly does not care.

**Response.** The primitive is *pay for state*, not *pay for work*. If a protocol wants to pay for work, they want a bounty board, not STATEKEEP. This is the honest boundary.

---

## 4 · Repeated failed claims (griefing)

**Setup.** A griefer spams `claim()` at markets whose state does not satisfy the predicate, hoping to burn honest executors' block space.

**Cost.** Solana tx fees + bond escrow for every attempt. Failed `claim()` reverts, so the bond is not seized, but the tx cost sticks.

**Response.** Griefing is not free. If bond escrow is required to *attempt*, griefing is metered by capital. The economics section of the protocol config recommends setting bond ≥ 5-10x median gas cost of an attempt.

---

## 5 · Executor withholding

**Setup.** An executor knows how to recover but waits until they can extract a higher reward via a competing market or by timing the market's expiry.

**Response.** Not a bug. This is a market. Under-priced markets simply do not attract action; overpriced ones attract more competition. The protocol can decide to raise the reward or shorten expiry.

**Boundary.** If a protocol's condition is safety-critical, they should not price it below the value at risk. This is the "if you underpay your firefighters, your building burns" problem — outside the primitive.

---

## 6 · Reward / bond calibration

The two knobs each market has:

- `reward`: how much a successful, durable claim earns.
- `bond`: how much an executor must lock during PENDING; forfeited on regression.

**Rules of thumb** (not enforced, but published as guidance):

- `bond ≥ reward × 0.5` — an executor who stands to earn 100 must not be indifferent to losing 100 in bond.
- `reward ≥ gas_cost × N` where `N` is the expected number of failed claim attempts before a successful one. For a well-defined predicate `N` is small; for a noisy one it can be large. This is why predicate quality *is* an economic parameter.
- `durability_slots` is the state's "how long must this survive to count" — shorter is easier to hit but pays for less durable outcomes; longer weeds out temporary fixes.

---

## 7 · Spam predicates

**Setup.** An attacker deploys a "predicate" program that always returns true.

**Response.** Predicate programs are chosen by the *protocol*, not by the executor. A protocol picking a bad predicate hurts only its own market. STATEKEEP surfaces the predicate program ID and lets anyone inspect it. The Phase C audit harness lets a protocol adversarially test a candidate predicate.

**What STATEKEEP does *not* do.** It does not curate a predicate registry. Curated registries recreate the arbiter problem. Predicate choice is a protocol responsibility.

---

## 8 · Protocol rug risk

**Setup.** A protocol funds a market, an executor commits, then the protocol tries to withdraw the reward or invalidate the claim.

**Response.** Reward vault authority becomes the program PDA at `fund_market`. The protocol has no withdrawal path except `expire()` on an unclaimed market past `expiry_slot`. See `docs/THREAT_MODEL.md` Actor 3.

---

## 9 · Executor collusion

**Setup.** Two executors coordinate: one deliberately claims and lets bond slash while the other benefits elsewhere.

**Response.** In an open market, other executors can compete. If the market is not truly public (e.g., private submission), collusion is possible — this is why we do not add private submission in the MVP. Documented in `docs/mev.md` as a production tradeoff.

---

## 10 · Protocol / executor cross-side collusion (self-dealing)

**Setup.** A protocol funds a market and asks a friendly executor to claim on state the friend already controls.

**Response.** Not addressed. Protocols spending their own money publicly can be inefficient. Other executors can compete on the same market and win the 25%; the 75% still requires durability. STATEKEEP is not a fiduciary layer for protocol treasuries.

---

## 11 · The executor ROI question ("why would an executor do this?")

For a specific market with `reward = R`, `bond = B`, `durability_slots = D`:

- Expected gas per attempt: `g` (Solana tx fee).
- Expected attempts until success: `n` (depends on competition).
- Expected regression probability: `p_regress` (depends on how contested the state is).
- Executor ROI ≈ `0.25 * R  +  0.75 * R * (1 - p_regress)  -  n * g  -  p_regress * B`.

Executor participates when the RHS is positive. A protocol tuning a market for participation should back-solve for `R` and `B` given a target `n` and `p_regress`.

---

## 12 · The protocol ROI question ("why pay this instead of one keeper?")

For a protocol currently paying keeper `K` per interval:

- Keeper failure probability: `f`.
- Loss when keeper fails: `L`.
- Effective cost per interval: `K + f * L`.

Under STATEKEEP:

- Reward paid only on success: `R * success_rate`.
- Expected loss: `(1 - success_rate) * L`.
- If `success_rate` is meaningfully higher than `(1 - f)` and `R < K + f * L`, STATEKEEP wins.

A short version: STATEKEEP wins when *keeper single-point-of-failure loss* exceeds the marginal per-execution premium of a competitive market.

---

## 13 · Adversarial cost lower bounds

- **Sniping the 25%**: cost = a priority-fee bid; upside = 25% of reward. Break-even bid: `0.25 * R - g_priority ≈ 0`. Snipers exist below this bid.
- **Regressing after claim**: cost = losing the bond; upside = ??? (only sensible if the executor's *other* position benefits from the regression). This is the composite-state attack — see `docs/A11-delta-guard.md`.
- **Griefing**: cost = `n * g + n * bond_escrow`; upside = disrupting a competitor. Break-even is high because bond escrow is capital-intensive.

---

## 14 · Not-in-scope for the mechanism

- Token-economic launch of a "STATEKEEP token." There isn't one; the primitive is denominated in whatever the protocol chose (SOL, USDC, its own asset). This is deliberate.
- Rebates, fee discounts, executor reputation. Reputation is off-chain and not part of the settlement guarantee.
- Protocol treasury management. Protocols decide how much to fund.

The mechanism ends at settlement. Everything downstream is protocol / market design.

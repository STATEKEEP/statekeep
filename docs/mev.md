# MEV & Race Analysis

STATEKEEP is a public settlement game. Some of it is MEV-adjacent by nature. This document is the honest inventory.

---

## MVP rule: first-valid-wins for the immediate 25%

The MVP does **not** use private submission, sealed bids, or off-chain matching. `claim()` is a public Solana instruction; whichever transaction lands first in a slot and satisfies the predicate wins. This is the same regime as every public liquidation on every chain.

**Justification.** Adding private submission adds:
- A trusted relayer (undermines "no trusted keeper").
- A single point of censorship.
- A new economic actor whose incentives must also be modeled.

For an MVP, all three costs exceed the benefit. Documented as a production improvement below.

---

## Race surfaces

### R1 — Claim race (many executors ready)

**Situation.** State degrades; multiple executors watch. Whoever submits a valid `claim()` first wins.

**Behavior.** First-valid-wins. If a leader schedules A's claim before B's, and A's predicate CPI returns true, A wins. B's claim in the same block errors (state = CLAIMED, not OPEN). B pays gas.

**Consequence.** Priority-fee bidding. This is expected and healthy — it directs capital toward the fastest, best-observing executors.

### R2 — Finalize race (permissionless)

**Situation.** After maturity, anyone can call `finalize()`. Any executor, watcher, or friend of the claimant may finalize.

**Behavior.** The identity of the finalizer does not affect payout — the claim record already fixes the payee. The finalizer bears the tx cost.

**Consequence.** Finalization is a common good — someone will eventually do it because there is no direct payment for it. To avoid liveness gaps, protocols can:
- Have the executor themselves finalize (they are motivated).
- Fund a small `finalize_fee` (out of scope for MVP).

Not doing either means finalization may lag. State reads for the market UI make the pending status visible.

### R3 — Sniping the setup

**Situation.** Executor A performs an on-chain rebalance in tx_a; executor B submits `claim()` in tx_b in the same block, reading A's state change.

**Behavior.** If Solana's leader orders tx_a before tx_b, B wins the 25%.

**Response.** A should submit setup + claim as a single tx (or as CPI within one instruction). If A cannot atomize (e.g., the setup crosses program boundaries), A bears the sniping risk on the 25% and still owns the 75% if they can win the claim ordering.

### R4 — Regression race

**Situation.** After claim, the executor holds a pending payout. A rival wants the state to fail before maturity.

**Behavior.** The rival can push state (via any market action) toward failure. If regression occurs, the executor loses the bond and 75%. The rival gains only whatever their own position gains from the regression.

**Response.** This is a *market* interaction, not a program bug. The design assumes an actively-priced protocol where regression is expensive to induce (whale-attack tier).

### R5 — Sandwich

**Situation.** Executor's `claim()` includes a state-changing action; a sandwich attacker submits before and after.

**Response.** For STATEKEEP itself, there is nothing to sandwich — the claim is either valid or not. If the executor's *own action* (a swap, e.g.) is sandwichable, that is a general MEV problem outside STATEKEEP. The executor should route through a Jito bundle or private-order flow at their discretion. STATEKEEP does not sandwich-protect the executor's setup.

### R6 — Failed-claim griefing

**Situation.** Attacker submits high-priority `claim()` txs known to fail, hoping to congest a leader's compute.

**Response.** Failed txs cost the sender. Solana's scheduler drops repeated-failure senders. This is a network-level defense, not STATEKEEP's; it inherits it.

### R7 — Private submission (production improvement)

**Behavior a production STATEKEEP might adopt:**
- Executors submit encrypted claims; a threshold-decrypted batch is revealed at slot boundaries.
- All valid claims in a batch are eligible; the winner is chosen by a rule (random, first-lex, weighted).
- Reduces first-valid-wins bidding.

**Cost:**
- Threshold-crypto machinery (out of scope for MVP).
- Latency added (matters when speed of recovery is safety-critical).

Documented; not implemented in Phase A.

### R8 — Sealed-bid rehearsal (production improvement)

**Behavior.** Executors submit commitments to their planned action + expected state; the program reveals winners after a window. Rehearsal-then-execute reduces sniping.

**Cost.** Two-phase protocol; latency; ordering complexity across the reveal boundary.

Also documented; not in Phase A.

---

## What we deliberately DON'T do (and honest reasons)

- **Reward reveal delay.** Would help against sniping but harms transparency and gas.
- **On-chain executor reputation.** Recreates the "trusted set" we deleted. Reputation is off-chain.
- **KYC / whitelist executors.** Same reason. STATEKEEP is permissionless; KYC belongs to the protocol, not the primitive.
- **Payment to finalizer.** Would create a griefing vector where random parties finalize failed states for a fee. If protocols want this, they can layer it externally.

---

## First-valid-wins: what's actually being lost

If executor A puts in real work and B snipes the 25%:
- A loses 25% × reward.
- A still competes for the 75% (if their `claim()` transaction lost the race, they never entered CLAIMED — B did).
- So realistically, A loses the entire reward if B's `claim()` wins the ordering, even though A "did the work."

**This is the price of a public game.** It is the same problem all public liquidation markets have.

Mitigations available to executors:
- Atomize setup + claim into one tx.
- Priority-fee bid competitively.
- Route submission through Jito bundles (Solana-native).
- Choose markets where the *setup cost* is low relative to reward — the sniper has to pay it too.

---

## The design's actual MEV posture

STATEKEEP *shifts* MEV, it does not eliminate it. The 25% is race-won. The 75% is durability-won. This is the mechanism:

- If you value fast execution: race for the 25%.
- If you value durability (state actually holds): compete for the 75%.

Different executors optimize for different pieces. This is intentional.

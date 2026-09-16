# ATTACKS — Prior-Art Attacks and STATEKEEP's Defenses

This is a catalog of the concrete attacks that have hit or been analyzed against the design ancestors of STATEKEEP. For each: the attack in one paragraph, and the specific STATEKEEP mechanism that closes it. This file is not marketing — it is the adversarial spec the code has to satisfy.

---

## 1. Chainlink Automation / Gelato — "the keeper called the function on nothing"

**The attack.** A designated keeper is paid per invocation. A malicious keeper (or a lazy one) can call `performUpkeep()` on a branch where no useful work happens — the tx succeeds, the payment fires. Documented in the Chainlink Automation post-mortem literature and reproduced repeatedly in audits: the accounting is on the call, not on the resulting delta.

**STATEKEEP defense.** Payment is conditioned on the predicate over resulting state, not on the fact of a call. `claim()` invokes the predicate via CPI **after** the executor's action; if the predicate returns false, the tx does not fail cosmetically — it succeeds and pays nothing. There is no keeper "activity" reward.

---

## 2. Keep3r / v2 — job registry drift and mercenary keepers

**The attack.** Keep3r jobs allow-list keepers and pay a KP3R credit per work unit. Job authors have been observed under-specifying the "work is needed" condition, so keepers race to do trivial work. In the reverse, well-specified jobs have been left unworked because the KP3R payout was below gas cost.

**STATEKEEP defense.** No allow-list. Anyone can execute. The market is priced by the protocol funding it, and the executor's *own* bond disciplines both sides: a low reward attracts nobody, an over-eager executor risks slash on regression. There is no protocol-issued token whose price drift breaks the incentive.

---

## 3. Morpho — oracle manipulation forcing ~$36M of "valid" liquidations (Aug 2026)

**The attack.** A market whose price oracle was gameable was made temporarily to read a manipulated price; positions became liquidatable at that price; liquidators (correctly, per the code) closed them; the price reverted; the loss stuck to depositors. The liquidation *succeeded on chain*, so payment fired.

**STATEKEEP defense.** Two mechanisms compound. First, the **durability window**: 75% of the reward is held past the incident and released only if the state *still* satisfies the predicate at the end. A price-manipulated instant-favorable state that reverts does not qualify. Second, **whole-state reconciliation** — protected balances (`protected_delta >= -X`) are checked in the predicate, so a single manipulated headline metric cannot mask a protected-side drain.

---

## 4. OEV (Oracle Extractable Value) — first-block liquidation snipers

**The attack.** A liquidation opportunity that appears at slot N is race-won by a sniper who submits in slot N with priority fee. Value accrues to the mempool position, not to the network of watchers. Analyzed in the API3 OEV literature and the Chainlink SVR docs.

**STATEKEEP defense.** MVP explicitly accepts first-valid-wins for the *claim* — this is documented in `docs/mev.md` — but shifts the economic weight to the **durability tail**. A sniper who front-runs into an invalid or brittle state does not collect the majority of the reward. Production improvement paths (private submission, sealed-bid rehearsal) are documented separately, not silently retrofitted.

---

## 5. Intent systems (ERC-7683, UniswapX) — solver collusion / MEV internalization

**The attack.** A closed set of solvers privileged by relationship or infrastructure can internalize MEV or exclude smaller solvers. Documented in the UniswapX solver dynamics papers.

**STATEKEEP defense.** STATEKEEP has no solver privilege layer. `claim()` is permissionless; the predicate is public code; the bond is the only barrier to entry. There is no relayer that a solver needs to be whitelisted with.

---

## 6. ERC-7683 (cross-chain intents) — filler grief / stuck funds

**The attack.** A filler commits to fulfilling an intent on the destination chain, then fails to complete; the origin funds are stuck pending timeout; the user waits.

**STATEKEEP defense.** STATEKEEP is single-chain and does not accept multi-chain intents. `expire()` is a first-class instruction with a hard slot deadline. If no valid claim lands by expiry, funds return to the protocol atomically. There is no filler with committed inventory.

---

## 7. EIP-7906 (transaction-level assertions) — "assertion passed at commit but not thereafter"

**The attack.** A transaction includes an assertion that reads state *inside the same transaction* and passes; but a later transaction breaks the same condition. The assertion layer has already released the payment.

**STATEKEEP defense.** Assertions are transaction-scoped by construction. STATEKEEP is *not* — the durability window explicitly checks that the state holds across `M` slots (many transactions), and reward release happens in `finalize()`, evaluated against the state at that moment.

---

## 8. Bounty boards (Immunefi, GitCoin) — arbiter capture / subjective disputes

**The attack.** A bounty poster refuses to pay a valid submission, or a submitter files a marginal claim; a human arbiter decides; either side can be captured, delayed, or corrupted.

**STATEKEEP defense.** No arbiter. The predicate is code. The evaluation is on-chain. The protocol funding the market cannot refuse a valid claim — the reward vault is a PDA the funder can no longer withdraw from once it is committed to an open market.

---

## 9. Claim sniping — race the last honest executor

**The attack.** Executor A is preparing a valid recovery over several slots (rebalance, deposit). Executor B watches the mempool, front-runs A's finalizing tx with an identical one, and collects the reward.

**STATEKEEP defense.** For the immediate 25%, first-valid-wins is accepted and documented. For the 75% tail, only the executor whose `claim()` succeeded holds the `ClaimRecord`; finalization *pays that account, not the finalizer*. `finalize()` is permissionless, but it does not choose the payee.

---

## 10. Fake claim — assert a state without producing it

**The attack.** Executor calls `claim()` without actually improving state, hoping to be paid on the strength of the assertion.

**STATEKEEP defense.** `claim()` invokes the predicate via CPI over the *current* account snapshot; if the predicate returns false, `claim()` errors and no state is written. There is no "claim now, verify later." The claim is the verification.

---

## 11. Account substitution — swap in a decoy account that satisfies the predicate

**The attack.** Executor supplies the predicate with a lookalike account (same shape, different pubkey) whose values happen to satisfy the condition, hoping the program does not notice.

**STATEKEEP defense.** `PredicateConfig` pins the exact account pubkeys the predicate must see. `claim()` enforces `remaining_accounts == config.pinned_accounts` byte-for-byte before dispatching to the predicate. Substitution fails the account check, not the predicate.

---

## 12. Stale-baseline attack — read yesterday's numbers

**The attack.** Executor tries to have the predicate compare against a stored baseline from before the current epoch, so a degraded state looks "improved."

**STATEKEEP defense.** The baseline is committed at `create_market()` and is immutable for the life of the market. It is not "the last observed state" — it is "the state at market creation." The predicate is fed `(baseline, current)`; stale-baseline is not a well-defined attack because there is no other baseline to substitute.

---

## 13. Double claim — collect twice on the same market

**The attack.** Executor's `claim()` succeeds; they call it again, hoping the program pays a second time.

**STATEKEEP defense.** The `Market` state machine transitions `OPEN → CLAIMED` atomically inside `claim()`; a market not in `OPEN` refuses `claim()`. Only one `ClaimRecord` PDA can exist per `(market, epoch)`.

---

## 14. Double payment — collect the immediate reward and the deferred reward separately

**The attack.** Executor claims (25% paid), then tries to re-trigger the immediate-payment path during finalize.

**STATEKEEP defense.** The reward vault tracks `immediate_paid: bool` and `deferred_paid: bool`. Both are `false` at creation; the first is flipped exactly in `claim()`, the second exactly in `finalize()` on the healthy branch. Neither can flip twice; each protects a different bucket.

---

## 15. Wrong executor gets paid — pay recipient parameter manipulation

**The attack.** Executor calls `finalize()` and passes their own token account as recipient, expecting to redirect a reward the original claimant earned.

**STATEKEEP defense.** `finalize()` reads the executor from the `ClaimRecord` PDA, which is fixed to the pubkey that signed `claim()`. The `recipient` argument does not exist; the payee is derived.

---

## 16. Insufficient bond — claim without funds to lose

**The attack.** Executor puts up a bond of zero, or a bond in a denomination the market does not accept.

**STATEKEEP defense.** `Market.bond_requirement` is set by the protocol; `claim()` requires `ExecutorBond.amount >= market.bond_requirement` and that the bond mint matches. The bond account is a PDA of `(market, executor)`; the executor cannot pre-fund with a fake bond.

---

## 17. Reward theft — drain the reward vault directly

**The attack.** Attacker attempts a direct transfer from the reward vault PDA.

**STATEKEEP defense.** The reward vault is a PDA owned by the STATEKEEP program; the only paths out are `finalize` (deferred), `claim` (immediate), and `expire` (funder refund on unclaimed markets). SPL token authority is the program-derived signer; no external signer can move funds.

---

## 18. Malformed predicate — panic to skip the check

**The attack.** A predicate program that panics on evaluate, hoping STATEKEEP treats a failed CPI as "no objection" and pays anyway.

**STATEKEEP defense.** `claim()` propagates the predicate CPI result. A CPI that returns error or panics is treated as `false` (predicate did not affirmatively return true). "Silence is not consent" is enforced at the CPI boundary.

---

## 19. Unauthorized finalize — force early payout

**The attack.** Anyone can call `finalize()`, so a friendly finalizer calls it 1 slot after claim, hoping to unlock the 75%.

**STATEKEEP defense.** `finalize()` reads `Market.maturity_slot`; if `clock.slot < maturity_slot`, it errors. Permissionless does not mean unrestricted — the *timing* is on-chain.

---

## 20. Unauthorized slash — malicious finalizer forces slash on a healthy state

**The attack.** A rival executor calls `finalize()` at maturity, hoping to trigger slash on a healthy state so their competitor loses their bond.

**STATEKEEP defense.** `finalize()` does not decide the outcome — it invokes the predicate CPI. The predicate reads current state and returns `true` or `false`. The finalizer's identity is irrelevant. If the state is healthy, `finalize()` pays the executor.

---

## 21. Market reuse — reopen a completed market to double-fund an attacker

**The attack.** A market that reached `PAID` or `SLASHED` is reused by the funder to re-run against a new executor cooperating with the funder.

**STATEKEEP defense.** Terminal states (`PAID`, `SLASHED`, `EXPIRED`, `FAILED`) are absorbing — no transition out. To fund again, the protocol must call `create_market()` with a new PDA seed.

---

## 22. Replay of a valid claim across markets

**The attack.** A `claim()` transaction that succeeded against market A is re-submitted against market B (a copy), hoping the on-chain account graph confuses the program.

**STATEKEEP defense.** `claim()` binds the `ClaimRecord` PDA to the market pubkey; the transaction's success is not portable to a different market seed. Solana's per-account state prevents cross-market confusion.

---

## 23. Delta attack (the composite reconciliation attack)

**The attack.** Executor makes the reserve ratio go from 79% to 83% by draining a *protected* balance from 500 to 300. Headline metric looks recovered; protected surface is worse.

**STATEKEEP defense.** Composite predicate C: `reserve >= 80% AND protected_delta >= -X AND debt_delta <= +Y`. The predicate is a conjunction; any leg failing fails the whole. Demonstrated in `docs/A11-delta-guard.md` and in `tests/delta_attack.ts`.

---

## 24. Griefing — spam failing claims to lock the market

**The attack.** Adversary submits a stream of `claim()` calls that will fail the predicate, hoping to exhaust the market or discourage honest executors.

**STATEKEEP defense.** Each failing `claim()` costs the caller Solana gas and does not change market state (it errors before the OPEN→CLAIMED transition). There is nothing to lock; the market stays OPEN until a *successful* claim. Additionally, the bond escrow required to *attempt* a claim is documented; a griefer must lock capital per attempt.

---

## 25. Protocol rug — funder withdraws the reward mid-market

**The attack.** After an executor is committed to a claim, the funder withdraws the reward vault.

**STATEKEEP defense.** Once `create_market()` and `fund_market()` complete, the reward vault authority is the STATEKEEP PDA. The funder has no withdrawal path except `expire()` after `expiry_slot` on an *unclaimed* market. A `CLAIMED` or `PENDING` market cannot be expired.

---

## 26. Executor collusion with funder — split the reward outside the system

**The attack.** Funder and executor pre-agree; funder creates an easy market; executor claims trivially; both split the reward off-chain.

**STATEKEEP defense.** This is not a *bug* — this is a rational actor deciding to burn their own money publicly to pay a friend. STATEKEEP does not prevent it, and does not claim to. The system's guarantee is *predicate-checked settlement*, not *funder virtue*. The market is public; other executors can compete on the same reward; a "collusion market" that is too easy will attract counter-competition. Documented honestly in `docs/economics.md`.

---

## 27. Predicate author malice — the predicate always returns true

**The attack.** A malicious predicate author publishes a predicate that reads a specific attacker-controlled flag and returns true whenever it is set.

**STATEKEEP defense.** The predicate program address is pinned into `PredicateConfig` at market creation. Protocols choose their predicate; STATEKEEP does not vouch for arbitrary predicate authors. This is documented in the WHY_NOT / limitations track. The mitigation is the `statekeep-audit` harness (Phase C) that lets a protocol adversarially test a predicate before pinning it.

---

## 28. RPC-operator attack — return manipulated account snapshots

**The attack.** A malicious RPC returns snapshot data suggesting the state is healthy when it is not.

**STATEKEEP defense.** All settlement decisions are executed *on-chain* by a Solana validator, not by RPC-observed data. A malicious RPC can lie to a UI, but not to the program. UI-side manipulation is documented as out of scope for the settlement guarantee.

---

## 29. Reporter capture (watchtower dishonesty)

**The attack.** A reporter falsely claims a state has failed, hoping to slash a healthy executor.

**STATEKEEP defense.** The reporter has no decisional power. `finalize()` is permissionless *invocation*, but the *outcome* is decided by the predicate CPI over live state. A reporter can only *trigger* the check; the check itself is honest by construction.

---

## 30. Long-term regression — state passes finalize, fails right after

**The attack.** Executor times their recovery so the state is healthy exactly at maturity slot, and reverts one slot after.

**STATEKEEP defense.** This is the honest limit of the guarantee. The durability window is the mechanism; a longer window is a *market parameter* the protocol chooses. STATEKEEP does not claim eternal state maintenance — it claims *durable across a window the protocol sized*. Documented in `docs/WHY_NOT.md`.

---

Any attack a reader can construct that is not in this list, and that we have not defended, is a bug. File it against the tests directory.

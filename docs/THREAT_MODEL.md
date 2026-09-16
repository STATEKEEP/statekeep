# THREAT MODEL

Threat model as an actor × capability × goal × attack × defense × remaining-risk matrix. Every row is testable; the last column is the honest limit of the mechanism.

---

## Actor 1 — Honest Executor

| Field | Content |
|---|---|
| Capability | Can observe on-chain state, submit txs, put up bond |
| Goal | Repair or preserve the market's state and get paid |
| Threat to system | None in the primary role |
| Attack surface they suffer | Claim sniping by adversaries |
| Defense | First-valid-wins for the 25%; the 75% is bound to the `ClaimRecord.executor` (their pubkey), not to any finalizer |
| Remaining risk | An adversarial executor might race them for the 25%. The design accepts this in the MVP (see `docs/mev.md`) |

---

## Actor 2 — Malicious Executor

| Field | Content |
|---|---|
| Capability | Same as honest — submit any tx, put up bond, run arbitrary compute off-chain |
| Goal | Get paid without producing the required state; or produce a transient state and collect full reward |
| Attack A | Submit `claim()` without changing state, hoping the program pays on the assertion |
| Defense A | Predicate CPI over live state; false ⟹ revert. I2. |
| Attack B | Bribe a friendly RPC to return manipulated snapshots |
| Defense B | Settlement is executed by validators, not by observed RPC snapshots. Snapshot-based lies do not survive execution |
| Attack C | Substitute a lookalike account with values that pass the predicate |
| Defense C | `PredicateConfig.pinned_accounts` hard-pins pubkeys; `claim()` byte-compares |
| Attack D | Sandwich or front-run own finalize to grab the 75% before regression is visible |
| Defense D | `finalize()` re-checks the predicate at the moment of the call — an attacker cannot "sandwich" the check because the check is inside the same tx |
| Attack E | Produce a state that is healthy at claim time and revert it before maturity |
| Defense E | Durability window; 75% released only if predicate holds at `finalize()` after maturity slot. Bond slashed on regression |
| Attack F | Fix headline metric while draining a protected balance |
| Defense F | Composite predicate C (`reserve` AND `protected_delta` AND `debt_delta`) — a conjunction; any leg fails, whole fails |
| Remaining risk | If the *protocol's* predicate is under-specified (only checks reserve), STATEKEEP will pay a delta-attack. STATEKEEP cannot fix an under-specified predicate; the Phase C `statekeep-audit` harness helps protocols avoid this |

---

## Actor 3 — Malicious Protocol (funder side)

| Field | Content |
|---|---|
| Capability | Can create markets, fund them, choose predicate, choose baseline |
| Goal | Collect a friendly executor's fake claim payment; or refuse to pay a legitimate claim |
| Attack A | Create an easy market with a colluding executor to launder funds |
| Defense A | Not addressed. This is the protocol spending its own money publicly. Documented in `docs/economics.md`. Other executors may compete on the same market and split the win |
| Attack B | Pull the reward vault mid-market |
| Defense B | Reward vault authority is the STATEKEEP program PDA once funded. The protocol has no withdrawal path except `expire()` on an *unclaimed* market past `expiry_slot` |
| Attack C | Set an expiry so short no executor can respond, so `expire()` refunds; race the executor's claim tx with an expire tx |
| Defense C | `expire()` requires `clock.slot >= expiry_slot` and market state = `OPEN`. If a `claim()` transaction lands first (same slot ordering is decided by the leader), the market is no longer `OPEN` and `expire()` errors. Documented in `docs/mev.md` |
| Remaining risk | Adversarial slot-timing griefing is possible on a heavily-contested block; the executor should not claim within 1-2 slots of expiry |

---

## Actor 4 — Malicious Predicate Author

| Field | Content |
|---|---|
| Capability | Publish a predicate program with arbitrary internals |
| Goal | Enable an accomplice to trigger a paid claim on false state |
| Attack | Predicate reads an attacker-controlled flag account and returns true when set |
| Defense | STATEKEEP does not vouch for predicates. Protocols pick their predicate. The Phase C `statekeep-audit` harness (predicate SDK moat) is the mitigation. STATEKEEP guarantees settlement-per-predicate, not predicate-correctness. This is documented explicitly in `docs/WHY_NOT.md` and the limitations page |
| Remaining risk | A protocol that adopts a malicious predicate can be robbed. This is a *protocol* failure. STATEKEEP surfaces the predicate program ID and version publicly so a protocol's users can audit it |

---

## Actor 5 — Claim Sniper

| Field | Content |
|---|---|
| Capability | Fast infrastructure, priority-fee escalation, potentially private submission channels |
| Goal | See an honest executor's pending recovery, front-run it, collect the 25% |
| Attack | Watch mempool for the executor's setup txs; submit a claim in the block that lands the last state change; win the race |
| Defense | For the 25%, first-valid-wins is accepted. For the 75%, only the executor whose `claim()` succeeded is paid at `finalize()` — sniping the `finalize()` transaction (which is permissionless) does not redirect payment |
| Remaining risk | Sniping the 25% is possible and documented. Production improvements (private submission, sealed-bid rehearsal) are catalogued in `docs/mev.md` and not silently retrofitted |

---

## Actor 6 — Griefer

| Field | Content |
|---|---|
| Capability | Submit txs, burn own gas, burn own bond |
| Goal | Make the system unusable or discourage honest executors |
| Attack A | Spam failing `claim()` txs |
| Defense A | Each `claim()` that fails costs the caller Solana fees and does not lock the market — the `OPEN → CLAIMED` transition only happens on success |
| Attack B | Claim, then let bond be slashed intentionally, to lock the market until finalize / slash / expire |
| Defense B | The market is locked, but only for `durability_slots + finalization_window` slots. After that, anyone can `finalize()` and if state is broken, `slash()`. Eventually the market moves through `SLASHED` (terminal) and the protocol can re-create. Cost to griefer: the bond |
| Remaining risk | A well-funded griefer can pay the bond repeatedly to keep the market perpetually claimed by an accomplice. Cost scales linearly with bond size — the protocol sets bond high enough to make this expensive |

---

## Actor 7 — RPC Operator

| Field | Content |
|---|---|
| Capability | Serve arbitrary responses to `getAccountInfo`, `sendTransaction`, `getSignatureStatuses` |
| Goal | Confuse UIs, force incorrect user decisions |
| Attack A | Return manipulated snapshots to a market-monitor UI, causing users to attempt bad claims |
| Defense A | The claim itself is a tx executed by a validator, not the RPC. The RPC lie causes the user to waste gas but does not affect settlement |
| Attack B | Refuse to forward a `finalize()` tx during the durability window |
| Defense B | Any RPC or user can call `finalize()`. Censoring one RPC does not censor all RPCs; the tx will land eventually |
| Remaining risk | A universally-hostile validator set could censor a specific market's `finalize()` past a critical slot. This is a Solana-wide liveness assumption; STATEKEEP inherits it |

---

## Actor 8 — UI Attacker

| Field | Content |
|---|---|
| Capability | Serve a malicious frontend impersonating STATEKEEP |
| Goal | Trick users into signing txs against a wrong program ID |
| Attack | Phishing frontend that shows a fake market and asks the user to `claim()` on an attacker-controlled program |
| Defense | Not addressed at the program layer — this is a frontend/wallet-simulation problem. Wallet tx simulation and the canonical program ID (published in README once deployed) are the mitigations |
| Remaining risk | Same as every dApp: signing a hostile tx is possible if the user does not verify. Explicit and honest. `docs/WHY_NOT.md` calls this out |

---

## Cross-cutting: what we do NOT defend against

- A user willingly signing an arbitrary transaction against a phishing program.
- A protocol that funds a market with a broken predicate.
- Solana-wide censorship or liveness failure.
- Off-chain reality (e.g., "the depositor really has $10M") — STATEKEEP only verifies **on-chain** state.
- A malicious slot leader briefly reordering pending txs (accepted; MVP is first-valid-wins).

These are catalogued in `docs/WHY_NOT.md` under "Honest limits."

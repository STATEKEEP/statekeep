# State Machine

Every market moves through exactly the states below. Any account whose current state is not in this diagram is corrupt and the program must refuse to touch it.

```
                    ┌────────────────┐
                    │     OPEN       │◄──── created by protocol
                    └───────┬────────┘
                            │  claim()  (executor, predicate=true, bond locked)
                            ▼
                    ┌────────────────┐
                    │    CLAIMED     │  25% paid immediately, deferred locked
                    └───────┬────────┘
                            │  (automatic on same tx)
                            ▼
                    ┌────────────────┐
                    │    PENDING     │  waiting for maturity_slot
                    └───┬────────┬───┘
                        │        │
        finalize() +    │        │  finalize() +
        predicate TRUE  │        │  predicate FALSE
                        ▼        ▼
                ┌──────────┐  ┌──────────┐
                │ MATURED  │  │  FAILED  │
                └────┬─────┘  └────┬─────┘
                     │             │
                     │             │  slash() (permissionless)
                     ▼             ▼
                ┌──────────┐  ┌──────────┐
                │   PAID   │  │ SLASHED  │
                └──────────┘  └──────────┘

                    ┌────────────────┐
                    │     OPEN       │
                    └───────┬────────┘
                            │  expire() (slot >= expiry_slot, no claim)
                            ▼
                    ┌────────────────┐
                    │    EXPIRED     │  reward refunded to funder
                    └────────────────┘
```

## The eight states

| State | Meaning | Money position | Absorbing? |
|---|---|---|---|
| `OPEN` | Market funded, no active claim, before expiry | Reward vault holds full reward | No |
| `CLAIMED` | An executor has just successfully claimed; predicate returned true; bond locked; immediate 25% dispatched | 75% of reward locked in escrow | No — transitions to PENDING atomically in same tx |
| `PENDING` | Waiting for maturity slot; predicate must still hold when checked | 75% reward + bond locked | No |
| `MATURED` | Finalize called after maturity; predicate re-checked and returned true | 75% about to be released | No — transitions to PAID in same tx |
| `PAID` | Deferred reward paid to executor; bond released | 0 | **Yes** |
| `FAILED` | Finalize called after maturity; predicate returned false — durability failed | Reward and bond still escrowed | No — awaits slash() |
| `SLASHED` | Slash executed; deferred reward returned to funder; bond confiscated per market policy | 0 | **Yes** |
| `EXPIRED` | Expiry passed without a valid claim; funder refunded | 0 | **Yes** |

## Legal transitions and who triggers them

| From | To | Instruction | Who signs | Preconditions |
|---|---|---|---|---|
| — | `OPEN` | `create_market` | Protocol authority | Baseline supplied, predicate program pinned, expiry > current slot |
| `OPEN` | `OPEN` | `fund_market` | Anyone (payer) | Market not yet claimed; adds to reward vault |
| `OPEN` | `CLAIMED → PENDING` | `claim` | Executor | Predicate CPI = true; bond ≥ requirement; slot < expiry; account set matches pinned config |
| `PENDING` | `MATURED → PAID` | `finalize` | Anyone | slot ≥ maturity_slot; predicate CPI = true at finalize time |
| `PENDING` | `FAILED` | `finalize` | Anyone | slot ≥ maturity_slot; predicate CPI = false at finalize time |
| `FAILED` | `SLASHED` | `slash` | Anyone | Market in FAILED state |
| `OPEN` | `EXPIRED` | `expire` | Anyone | slot ≥ expiry_slot; market never claimed |

## Illegal transitions (must be refused by the program)

Any of the following, if permitted, is a bug. Each is enforced by an explicit `require!` in the corresponding instruction handler.

- `OPEN → PAID` — bypasses claim and durability. **I2, I3 both violated.**
- `OPEN → MATURED` — bypasses claim. Same violation.
- `CLAIMED → PAID` — bypasses durability window. **I3.**
- `PENDING → PAID` without a `finalize` (no re-check). **I3.**
- `PENDING → PAID` if `slot < maturity_slot`. **I3.**
- `MATURED → PAID` while `predicate = false`. **I2.**
- `FAILED → PAID`, `FAILED → MATURED`, `SLASHED → *`, `PAID → *`, `EXPIRED → *` — all terminal-state transitions. **I8.**
- `OPEN → CLAIMED` if the pinned account set does not match. **I6.**
- `OPEN → CLAIMED` if the executor's bond is below requirement. **I7.**
- Any `claim` writing a second `ClaimRecord` for the same market. **I1.**
- Any `finalize` paying to an address other than the one stored in `ClaimRecord`. **I5.**
- `EXPIRED` returning funds to anyone other than the original funder. Ownership constraint.

## Why the split `CLAIMED → PENDING` is atomic

`CLAIMED` is not observably distinct from `PENDING` from outside the instruction. It exists conceptually to name the moment the immediate 25% is dispatched and the durability clock begins. Both writes happen in the single `claim()` instruction; observers only ever see the PDA as `PENDING`.

## Reconciliation with the eight invariants

- `OPEN → CLAIMED` transition is guarded by predicate CPI + account-set check + bond check. Enforces **I2, I5, I6, I7**.
- `CLAIMED/PENDING` state gates further `claim` calls. Enforces **I1**.
- `PENDING → PAID` requires `slot >= maturity_slot` and predicate CPI = true. Enforces **I3, I4**.
- Terminal states are absorbing. Enforces **I8**.

# WHY NOT [that other thing]

Precise, non-hand-wavy comparisons. Every row of every table is a *specific mechanism-level difference*, not a marketing take. If a reviewer challenges any row, we should be able to point at a line of code that enforces the difference.

---

## STATEKEEP vs Chainlink Automation

| Dimension | Chainlink Automation | STATEKEEP |
|---|---|---|
| Who can execute | Whitelisted keeper network | Anyone |
| Settlement basis | `performUpkeep()` returned without revert | On-chain predicate over resulting state returns true |
| Payment for a useless call | Paid | Not paid |
| State durability enforcement | None | 75% of reward held through M-slot durability window |
| Bond / liability | None (keeper has no skin) | Bond required at claim; slashed on regression |
| Trust surface | The keeper set, Chainlink DON | The predicate program address (chosen by the protocol) |
| Failure mode when keeper is down | State goes untended, no automatic recourse | Anyone else can attempt |
| Off-chain infra required | Chainlink DON | None (pure on-chain) |

**Line-of-code difference.** STATEKEEP's `claim()` executes the predicate CPI and gates the transfer on the returned bool. Chainlink Automation's registry executes `performUpkeep()` and pays if the tx did not revert.

---

## STATEKEEP vs Gelato

| Dimension | Gelato | STATEKEEP |
|---|---|---|
| Trigger source | Off-chain resolver contract or webhook | On-chain state directly |
| Who observes | Gelato executors (delegated) | Anyone, permissionlessly |
| Payment shape | Fee-per-execution, subscription, or credit | Reward-per-successful-outcome |
| Handling of transient success | Not modeled | Modeled — 75% deferred |
| Composability | Gelato SDK & their infra | Native Solana program + CPI predicates |

---

## STATEKEEP vs Keep3r Network

| Dimension | Keep3r | STATEKEEP |
|---|---|---|
| Executor gate | Bonded keepers (KP3R staked) | Anyone with the market's required bond in the market's mint |
| Payment currency | KP3R credit (token) | Whatever the protocol funded the market in |
| Job definition | Contract's `workable()` returning true | Predicate CPI returning true over pinned account set |
| Handling of predicate ambiguity | None; job author writes freeform Solidity | Predicate program is a distinct program with a fixed ABI: `evaluate(accounts, config) -> bool` |
| Durability | Not modeled | First-class M-slot window |

---

## STATEKEEP vs Morpho / Aave liquidation

| Dimension | Liquidation | STATEKEEP |
|---|---|---|
| Scope | Under-collateralized loans | Any machine-checkable on-chain condition |
| Reward | Fixed bonus per liquidation | Protocol-set per market |
| Post-liquidation health check | No | Yes — durability window |
| Anti-manipulation | Depends on the oracle | Whole-state reconciliation + durability |
| Post-oracle-manipulation resistance | Weak (see Aug 2026 Morpho incident) | Payment reverts unless state is *still* healthy at maturity |

**The Morpho August 2026 incident is the point.** A liquidation paid because the state at that instant was liquidatable. STATEKEEP would not have paid the deferred portion because the state reverted; and the bond would be slashed.

---

## STATEKEEP vs Intent Systems (UniswapX, ERC-7683, CowSwap)

| Dimension | Intent Systems | STATEKEEP |
|---|---|---|
| Economic object | A user preference | An on-chain condition |
| What solvers commit to | Producing a matching transaction | Producing and preserving a state |
| Failure mode when nothing fills | User's preference goes unmet, no state cost | Protocol's condition remains broken, but STATEKEEP does not pay |
| Cross-chain | Yes (7683) | No — single-chain by construction |
| Solver privilege | Filler/solver set (varies) | None |
| Post-fill durability | Not applicable — the fill *is* the transaction | Applicable — the state has to *last* |

STATEKEEP is not on the intent-system axis at all. Intents are transaction-shape auctions. STATEKEEP is a state-outcome auction across time.

---

## STATEKEEP vs Bounty Boards (Immunefi, Gitcoin bounties)

| Dimension | Bounty Boards | STATEKEEP |
|---|---|---|
| Judge | Human | On-chain program |
| Subjectivity | High | Zero |
| Latency to payment | Days to weeks | Slots |
| Adversarial capture of judge | Real (documented in bounty history) | Impossible — no judge |
| Type of work rewarded | Arbitrary | Machine-checkable state |
| Bond / slash on failure | Not applicable | Yes |

---

## STATEKEEP vs EIP-7906 / Transaction-Level Assertions (Phylax etc.)

| Dimension | Tx Assertions | STATEKEEP |
|---|---|---|
| Time window | Single transaction | Many transactions across `durability_slots` |
| Payment for holding a state | Not applicable | Core mechanism |
| Reversion detection | Reverts the offending tx | Detects state regression across the window and slashes |
| Composability with market forces | None (in-tx only) | Full — external actions can affect the state during the window, and settlement responds |

Transaction assertions and STATEKEEP are **complements**, not substitutes. Assertions ensure a specific tx does not break an invariant; STATEKEEP ensures a *state* remains true over a window regardless of which txs touch it.

---

## STATEKEEP vs Insurance

| Dimension | Insurance | STATEKEEP |
|---|---|---|
| Trigger | Covered loss occurred | State degraded or under pressure |
| Payment goes to | The insured | Whoever fixed / preserved the state |
| Economic incentive | Post-loss indemnification | Pre/post-loss maintenance |
| Underwriting | Actuarial | Not applicable — protocol pays per-successful-outcome |
| Adverse selection | Real | Not applicable |

---

## STATEKEEP vs Verified-Work / Solver Marketplaces (Bonsol, Marlin, Aligned)

| Dimension | Verified Work | STATEKEEP |
|---|---|---|
| What is verified | Off-chain computation via ZK or fraud proof | On-chain state directly |
| Verifier cost | ZK-proof verification cost | Standard CPI + account reads |
| Trust in the verifier | Yes (proof system integrity) | The chain itself |
| Off-chain infra required | Yes (prover networks) | None |
| Applicable to arbitrary off-chain claims | Yes | No — that's a limit, honestly |

---

## Honest limits (things STATEKEEP does NOT do)

Not to be marketed as strengths. Included so nobody thinks we are hiding them.

- STATEKEEP does not prove **off-chain** work. If a protocol needs "someone ran a computation," use a verified-work marketplace.
- STATEKEEP does not verify **historical** state. It compares committed baseline vs current — nothing else. There is no "read yesterday's chain."
- STATEKEEP does not guarantee **predicate correctness**. A broken predicate can be paid on. Mitigation: adversarial audit harness (Phase C).
- STATEKEEP does not prevent a **protocol** from creating a market that only its own accomplice can hit. Public markets attract public competition, but a well-hidden or short-lived market can be self-served.
- STATEKEEP does not solve **cross-chain state**. That is a `docs/multichain.md` (Phase C) spec-only discussion.
- STATEKEEP does not **eliminate MEV**. It shifts economic weight from first-block to durability, but the first 25% is race-won. Documented in `docs/mev.md`.
- STATEKEEP does not **create demand**. If no protocol wants the primitive, STATEKEEP does not manufacture a use case.

---

## The 15-second answer to "isn't this just X?"

- **Chainlink?** Chainlink pays for calls; we pay for states.
- **Keep3r?** No allow-list, and we settle on outcomes.
- **Morpho liquidation?** That's one market shape; we're the primitive.
- **Intent system?** Intents are transaction shapes; we are state outcomes across time.
- **Bounty?** No human judge — a predicate.
- **Assertion layer?** They check inside one tx; we check across a window.
- **Insurance?** We prevent loss; we don't indemnify it.
- **Solver marketplace?** They verify off-chain compute; we settle on on-chain state.

If none of those distinctions hits, the question is not "isn't this X" but "why does the primitive need to exist" — and that is answered in `THESIS.md`.

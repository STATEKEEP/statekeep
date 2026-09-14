<div align="center">

# STATEKEEP

### Pay for proven, durable state. Not calls.

Automation pays for the call. STATEKEEP pays only when the resulting onchain state is actually true — and stays true.

The whole product is an argument for the difference between *paying for activity* and *paying for reality*.

[Live demo ↗]() · [Explorer ↗]() · [Architecture ↓](#architecture) · [Run locally ↓](#run-it-locally)

Built for Solana. MIT licensed.

</div>

---

## Table of contents

- [▶ See it in one command](#-see-it-in-one-command)
- [The problem STATEKEEP solves](#the-problem-statekeep-solves)
- [How STATEKEEP works](#how-statekeep-works)
- [Architecture](#architecture)
- [The invariant](#the-invariant)
- [Safety, enforced on-chain](#safety-enforced-on-chain)
- [Engineering decisions & the hard problems](#engineering-decisions--the-hard-problems)
- [What's real vs pending — the honesty table](#whats-real-vs-pending--the-honesty-table)
- [Tests](#tests)
- [Run it locally](#run-it-locally)
- [Configuration](#configuration)
- [Deploy](#deploy)
- [Project layout](#project-layout)
- [Tech stack](#tech-stack)
- [Roadmap](#roadmap)
- [License](#license)

---

## ▶ See it in one command

> Status: pending — the program is not deployed yet. This section will show real `solana` CLI output against a live deployment when the build lands. No fabricated output.

```
# (coming with the first devnet deployment)
```

## The problem STATEKEEP solves

| Problem | Impact |
|---|---|
| Keeper networks pay for the call, not the result | A keeper can call `performUpkeep()` on a useless path and still get paid — the protocol pays for activity, and activity can be theater |
| One designated keeper is a single point of failure | If the keeper is down, slow, or compromised, the state nobody was watching rots — Aug 2026: a manipulated oracle forced ~$36M of liquidations on a single Morpho market |
| A state that is true for one block is treated as fixed | Transient fixes get paid as if they were durable repairs — temporary state looks identical to real repair at claim time |
| Fixing one metric by breaking another is undetectable | An executor can push the headline number into range while silently draining a protected balance |
| Post-incident detection is not prevention | Forensics can name the invariant that was violated; nothing enforces it before the money moves |

The 2026 record is the receipt: KelpDAO ($292M, Apr 2026), Drift ($285M, Apr 2026), Stream Finance ($285M contagion, Nov 2025), Resolv ($25M, Mar 2026), Morpho PT-reUSD ($36M liquidations, Aug 2026). The audit literature is explicit: *"correct protocol behavior depends on timely external execution"* and keeper centralization *"creates single-point-of-failure dependencies."*

## How STATEKEEP works

### 1 · A protocol funds a condition, not a job

A protocol publishes a standing economic condition and attaches a reward. No `performUpkeep()`, no designated keeper, no prescribed transaction:

```
PROTOCOL CONDITION        reserve_ratio >= 80%
MAINTENANCE REWARD        1 SOL
DURABILITY WINDOW         M slots
```

Anyone may compete to make the condition true. The execution path is disposable. The predicate is the interface.

### 2 · Executors compete to produce the state

Any executor may change the protocol's state through any route. At claim time the executor submits a claim transaction; the STATEKEEP program CPIs the protocol's own predicate program against the **current state** of the accounts passed to it, and the predicate returns `bool`.

```
claim()
  └─> CPI: predicate_program.evaluate(accounts, config) -> bool
        ├─ FALSE -> rejected, no payment
        └─ TRUE  -> 25% paid now, 75% locked pending durability
```

The executor is deliberately irrelevant. No payment merely because a target instruction executed.

### 3 · Durability, not transience

The plain claim-time design proves a state was true for one moment — not that it lasted. So STATEKEEP splits the reward and locks a bond:

```
CLAIM (state true)
  │  25% paid immediately
  ▼
PENDING (M-slot maturity window, bond locked)
  │
  ▼
FINAL CHECK (anyone may call finalize)
  ├─ state held  -> 75% released
  └─ state broke -> deferred reward forfeited, bond slashed per protocol rule
```

**No executor receives the full reward merely because the state was true at claim time.** The economic promise is: *we pay for durable state, not a momentary state.*

### 4 · The adversarial harness is part of the product

The protocol never verifies "did the executor call the approved function?" It verifies "is the economic state inside the promised predicate?" So the test surface is the predicate itself. The build ships a harness that generates adversarial transitions — fake results, partial completion, rounding exploits, integer boundaries, account substitution, temporary state, unauthorized side effects — and proves the predicate cannot be gamed.

## Architecture

```
        ┌─────────────────────────────────────────────────┐
        │                   PROTOCOL                       │
        │  defines predicate + funds maintenance reward    │
        └───────────────┬─────────────────────────────────┘
                        │ deploy + fund
                        ▼
        ┌─────────────────────────────────────────────────┐
        │                 STATEKEEP (Anchor)               │
        │  create_market · fund_market · claim · finalize  │
        │  slash · expire                                  │
        └───────────────┬─────────────────────────────────┘
                        │ CPI evaluate()
                        ▼
        ┌─────────────────────────────────────────────────┐
        │            PROTOCOL PREDICATE PROGRAM            │
        │  predicate(accounts, config) -> bool             │
        └─────────────────────────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────────────────┐
        │   executor state change (any path) + claim tx    │
        └─────────────────────────────────────────────────┘
```

### Transaction flow

1. Protocol deploys a predicate program defining the condition over a declared account surface.
2. Protocol calls `create_market` — baseline stored, reward funded, bond rule set, predicate hash pinned, market immutable after activation.
3. Executor performs any state-changing transaction(s) on the protocol.
4. Executor calls `claim` — STATEKEEP reads the current accounts, CPIs the predicate, evaluates.
5. FALSE → rejected. TRUE → 25% paid, 75% + bond enter `PENDING`.
6. After M slots, anyone calls `finalize` — STATEKEEP re-evaluates the predicate against current state.
7. State held → remainder released. State broke → remainder forfeited, bond slashed.

## The invariant

```
For every market round:
  payment occurs at most once
  payment > 0  ⟹  predicate(current_state) == TRUE
  deferred reward is unreachable until finalize
  durability failure ⟹ deferred reward == 0 (plus slash)
  a completed market cannot reopen
```

The baseline is explicit and committed at market creation. STATEKEEP never reads historical Solana state — it compares a stored baseline against the current state at claim and at finalize. No historical-state fiction.

## Safety, enforced on-chain

| Claim | How it's enforced |
|---|---|
| Cannot pay for a false state | Predicate evaluated by the protocol's own program at claim; FALSE → no payment |
| Cannot pay 100% for a transient state | 75% locked in escrow behind the M-slot durability window |
| Cannot be paid twice | Claim consumes the open bounty; second claimant gets `BOUNTY CLOSED` |
| Cannot fix one metric by breaking another | Composite predicates bind protected balances (delta guards) |
| Predicate cannot be swapped silently | Predicate hash pinned immutable at market activation |
| Watchtower cannot decide the truth | Anyone may call finalize; the program evaluates state itself |

## Engineering decisions & the hard problems

- **Claim-time, never historical.** Solana programs cannot read past state. The honest design is claim-time: stored baseline + current accounts → predicate. The durability window turns "was it ever true" into "did it stay true," which is the property that actually matters.
- **The predicate is a program, not a string.** STATEKEEP never promises to evaluate arbitrary logic. It promises: *any predicate implemented as a Solana program over the accounts the protocol declares.* The protocol owns the predicate; STATEKEEP is the settlement mechanism.
- **Durability cannot rely on "someone checks later."** That would be a keeper system with a delayed watchtower. Durability is a first-class state machine — OPEN → CLAIMED → PENDING → MATURED/FAILED — with the executor's bond at stake, so the executor's incentive is to produce state that *lasts*.
- **One trusted keeper is cheaper — until it isn't.** The protocol does not know the optimal repair path. One keeper controls the execution strategy; an open market makes the condition public and the strategy competitive. The protocol buys the outcome, not an exclusive operational dependency.
- **The delta-baseline problem is solved by committing the baseline.** At round creation STATEKEEP stores the minimal economic baseline the predicate requires. BEFORE = stored baseline; AFTER = current state. No pretending to read history.

## What's real vs pending — the honesty table

| Capability | Status |
|---|---|
| State machine design (OPEN → CLAIMED → PENDING → MATURED/FAILED) | Spec'd — pending implementation |
| Predicate-as-program CPI interface | Spec'd — pending implementation |
| Durability window with bond/slash | Spec'd — pending implementation |
| Baseline commitment | Spec'd — pending implementation |
| Adversarial predicate harness | Spec'd — pending implementation |
| Solana Anchor program | **Pending** — not built yet |
| TypeScript CLI + frontend | **Pending** — not built yet |
| Devnet deployment + real transactions | **Pending** — nothing deployed yet |
| Adversarial tests (100+) | **Pending** — not written yet |
| Real transaction receipts | **Pending** — no tx hashes exist yet |

Nothing above is claimed as built. The build is in progress; this table will be updated line by line as each capability becomes real and verifiable.

## Tests

> Status: pending — the suite does not exist yet. Test output will be pasted here when the first adversarial tests land.

## Run it locally

> Status: pending — local-validator commands will be documented here once the Anchor workspace exists.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| (to be defined with the build) | — | — |

## Deploy

| Network | Program | Status |
|---|---|---|
| (to be filled on first deployment) | — | Pending |

## Project layout

```
STATEKEEP/
├── programs/
│   ├── statekeep/          # core program: markets, claims, durability
│   └── predicates/         # example predicate programs
├── app/                    # frontend
├── tests/                  # adversarial + property tests
├── docs/
│   ├── state-machine.md
│   ├── INVARIANTS.md
│   ├── THREAT_MODEL.md
│   └── WHY_NOT.md
└── README.md
```

## Tech stack

- Solana (Anchor, Rust) — core program
- TypeScript — CLI, executor tooling, frontend
- (full stack list lands with the build)

## Roadmap

- [ ] Anchor workspace + state machine implementation
- [ ] Predicate interface + example predicates
- [ ] Baseline commitment + durability window
- [ ] Adversarial + property test suite
- [ ] Local validator end-to-end (create → fund → claim → pending → mature)
- [ ] Frontend (markets, executors, live state)
- [ ] Public devnet deployment + real transaction receipts
- [ ] README updated line-by-line from the honesty table as items become real

## License

MIT

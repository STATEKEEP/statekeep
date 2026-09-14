<div align="center">

# STATEKEEP

### Protocols can become self-healing without trusting the healer.

A protocol declares what "healthy" means and how it may be repaired. When it degrades, anyone can attempt a recovery — and the protocol pays only when the resulting on-chain state is actually valid and stays valid.

The whole design is an argument for one distinction: settle on the **result**, not on the action.

Built for Solana. MIT licensed.

</div>

---

## Table of contents

- [▶ See it in one command](#-see-it-in-one-command)
- [The problem](#the-problem)
- [How STATEKEEP works](#how-statekeep-works)
- [The recovery contract](#the-recovery-contract)
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

> Status: pending — the program is not deployed yet. This section will show real CLI output against a live deployment when the build lands. No fabricated output.

```
# (coming with the first deployment)
```

## The problem

Protocols have safety conditions — a lending market whose reserves must cover withdrawals, a vault whose accounting must balance. Today those conditions are defended by a **designated keeper**: one operator's bot that is supposed to notice a problem and act. If that bot is down, slow, or wrong, the state rots, and the protocol pays for **activity** — a function call — rather than for the **result**.

| Problem | Impact |
|---|---|
| Automation pays for the call, not the outcome | A keeper can call the upkeep function on a useless path and still be paid |
| One designated keeper is a single point of failure | When the keeper is down, nobody is watching the condition that matters |
| A state that is true for one block is treated as fixed | A one-block fix is paid for as if it were a durable repair |
| Fixing one metric by breaking another is undetectable | An operator can push the headline number into range while silently draining a protected balance |
| Recovery is designed *after* the failure | The protocol has no pre-installed, bounded path to get healthy again |

The 2026 record is the receipt: KelpDAO ($292M, Apr 2026), Drift ($285M, Apr 2026), Stream Finance ($285M contagion, Nov 2025), Resolv ($25M, Mar 2026), and a Morpho market whose manipulated oracle forced ~$36M of liquidations (Aug 2026). The audit literature says it plainly: *"correct protocol behavior depends on timely external execution"* and keeper centralization *"creates single-point-of-failure dependencies."*

## How STATEKEEP works

### 1 · The protocol defines what "healthy" is

A protocol registers a **recovery contract**: the health condition, the transitions allowed to repair it, the state that must never be harmed, the reward, and how long a repair must hold.

```
HEALTH CONDITION      reserve_ratio >= 80%
ALLOWED RECOVERY      withdraw insurance · rebalance pool · repay debt
PROTECTED STATE       user principal unchanged · debt <= baseline
RECOVERY REWARD       as registered
DURABILITY WINDOW     M slots
```

There is no arbitrary mutation. The protocol pre-authorizes the shape of a valid recovery, so nobody is ever handed open admin authority over live state.

### 2 · Degraded state opens a bounded, one-use recovery authority

When the condition breaks, the protocol enters recovery mode. A **recovery capability** is created — scoped to this incident, this state, these allowed transitions, this deadline — and it is consumed by the recovery that uses it.

```
claim()
  └─> the recovery is evaluated against the CURRENT state
        ├─ invalid  -> rejected, no payment
        └─ valid    -> the recovery is applied, the capability is consumed
```

### 3 · Candidate recoveries can be rehearsed before they touch reality

A recovery may be explored against a sealed copy of the exact current state — candidate transitions tried, invariants checked, the best valid one selected — and only the proven transition is applied to live state by the program that owns it.

```
LIVE STATE
   │ seal
   ▼
REHEARSAL  ── candidate A / B / C ──> invariant checks
   │
   ▼
one proven transition
   │
   ▼
LIVE PROGRAM applies the delta   (the program keeps ownership throughout)
```

### 4 · Whole-state reconciliation, not one metric

The protocol does not check a single headline number. It reconciles the entire protected surface:

```
BEFORE                    AFTER
reserve      $600k        $820k
user funds   $1.2M        $1.2M     (unchanged)
debt         $900k        $850k
fees         $30k         $31k
```

A recovery that moves the headline metric by sacrificing protected state is rejected.

### 5 · Payment settles on durable state, not on the attempt

Reward is split. Part is paid when a valid recovery lands; the remainder is held behind a durability window, and released only if the state still holds when the window closes. If it regresses, the remainder is forfeited and the executor's bond is slashed per the protocol's rule.

```
VALID RECOVERY
   │  partial reward now
   ▼
PENDING (M-slot window, bond locked)
   │
   ▼
final check
   ├─ still healthy -> remainder released
   └─ regressed     -> remainder forfeited, bond slashed
```

**No recovery is paid in full merely because the state was true at claim time.**

### 6 · A successful recovery can become a reusable capsule

A recovery that is proven valid and durable can be registered as a **recovery capsule** — a machine-recognized strategy for future incidents of the same shape. The protocol's ability to recover compounds instead of being relearned.

## The recovery contract

The recovery contract is the object. Not a job, not a bounty, not a keeper subscription:

```
THIS PROTOCOL becomes unhealthy when X
THIS is the allowed way to recover
THIS may never be damaged
THIS is the reward
THIS is how long recovery must survive
```

The separation is the whole design: **the protocol defines safety, the executor discovers execution, the chain decides settlement.**

## Architecture

```
        ┌─────────────────────────────────────────────────┐
        │                   PROTOCOL                       │
        │  registers: health condition · allowed repairs    │
        │  · protected state · reward · durability window   │
        └───────────────┬─────────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────────────────────┐
        │              STATEKEEP (Anchor program)          │
        │  recovery contract · bounded one-use capability  │
        │  reconciliation · durability settlement          │
        └───────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
  REHEARSAL (sealed state)      LIVE PROGRAM (owner)
  candidate transitions         applies the proven delta
  invariant checks              keeps ownership throughout
```

### Recovery flow

1. Protocol registers the recovery contract and funds the reward.
2. The condition breaks → recovery mode.
3. A bounded, one-use recovery capability exists for this incident.
4. Candidate recoveries are rehearsed against the sealed current state (or attempted directly against live state).
5. The valid transition is applied by the program that owns the state.
6. Reconciliation checks the full protected surface.
7. Durability window runs; then the remainder is released or the bond slashed.
8. A proven recovery may be registered as a reusable capsule.

## The invariant

```
For every recovery:
  payment occurs at most once
  payment > 0  ⟹  the resulting state is valid
  protected state is never sacrificed (reconciliation)
  the deferred reward is unreachable until the durability window closes
  a durability failure ⟹ the deferred reward is forfeited (plus bond slash)
  a consumed capability cannot be reused
```

The baseline is explicit and committed at registration. STATEKEEP never claims to read historical chain state — it compares the committed baseline against the current state, and — where a rehearsal is used — against a sealed root the protocol committed.

## Safety, enforced on-chain

| Property | How it's enforced |
|---|---|
| No payment for an invalid state | The transition is evaluated against current state; invalid → no payment |
| No full payment for a transient fix | The remainder is locked behind the durability window |
| No double payment | The one-use recovery capability is consumed by the recovery that uses it |
| No fixing one metric by breaking another | Whole-state reconciliation of the protected surface |
| No arbitrary mutation | The protocol pre-authorizes the shape of a valid recovery |
| No single trusted executor | Anyone may attempt a recovery; the chain evaluates the result |

## Engineering decisions & the hard problems

- **Settle on the result, not the call.** The economic object is the resulting state. The executor is deliberately irrelevant.
- **Historical state is not something a program can read.** The honest design evaluates current state against a committed baseline. Nothing pretends otherwise.
- **Recovery authority must be bounded and one-use.** A protocol never hands out open admin power; it creates a scoped capability consumed by a single incident.
- **Durability cannot be a "someone checks later" promise.** It is a first-class phase with the executor's money at stake, so the incentive is to produce state that *lasts*.
- **The live program keeps ownership.** Where a candidate state is rehearsed off-chain, the protocol's own program remains the sole authority that applies the resulting delta — no ownership transfer, no new runtime.
- **Reconciliation is not a single metric.** Checking "reserve ≥ 80%" is easy and insufficient; the protected surface is reconciled in full.

## What's real vs pending — the honesty table

| Capability | Status |
|---|---|
| Recovery contract design | Spec'd — pending implementation |
| Bounded one-use recovery capability | Spec'd — pending implementation |
| Whole-state reconciliation | Spec'd — pending implementation |
| Durability window with bond/slash | Spec'd — pending implementation |
| Sealed-state rehearsal | Spec'd — pending implementation |
| Recovery capsules | Spec'd — pending implementation |
| Anchor program | **Pending** — not built yet |
| CLI + frontend | **Pending** — not built yet |
| Deployment + real transactions | **Pending** — nothing deployed yet |
| Adversarial test suite | **Pending** — not written yet |
| Transaction receipts | **Pending** — no hashes exist yet |

Nothing above is claimed as built. The project is in progress; this table is updated line by line as each capability becomes real and verifiable.

## Tests

> Status: pending — the suite does not exist yet. Output will be pasted here when the first adversarial tests land.

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
statekeep/
├── programs/
│   ├── statekeep/          # core program: recovery contracts, capabilities, settlement
│   └── recovery/           # example protocol integration
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
- TypeScript — CLI, tooling, frontend
- (full stack list lands with the build)

## Roadmap

- [ ] Anchor workspace + recovery-contract state machine
- [ ] Bounded one-use recovery capability
- [ ] Whole-state reconciliation
- [ ] Durability window with bond / slash
- [ ] Sealed-state rehearsal
- [ ] Adversarial + property test suite
- [ ] Local end-to-end (register → degrade → recover → durable → paid)
- [ ] Frontend (markets, live state, recovery)
- [ ] Public deployment + real transaction receipts
- [ ] This table updated line-by-line as items become real

## License

MIT

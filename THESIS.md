# THESIS

## The one-paragraph technical definition

STATEKEEP is a permissionless market for maintaining **machine-checkable on-chain state**. A protocol funds a **condition** — a program-evaluable predicate over a bounded set of accounts, plus a **baseline** committed at market creation. Executors compete to take actions that either **restore** the condition (when it has degraded) or **preserve** it (when it is under pressure). Payment is not determined by the fact of the call, nor by the identity of the caller, nor by any centralized approver: it is decided by the **resulting on-chain state**, evaluated by the STATEKEEP program itself via CPI to a pinned predicate. A **durability window** enforces that the state was not temporarily true; a **whole-state reconciliation** enforces that no protected balance was sacrificed to make the headline metric look correct; a **bond** makes the executor liable for regression. The primitive is: **pay for proven, durable state.**

In fifteen seconds: *Protocols pay whoever proves their critical condition is actually healthy — verified on-chain, paid only if it lasts.*

---

## What STATEKEEP is NOT

STATEKEEP is deliberately not the following things. Every one of them fails a specific invariant that STATEKEEP enforces.

### It is not a keeper network (Chainlink Automation, Gelato, Keep3r)

A keeper network pays a **designated operator** for **calling a function** on a schedule or trigger. Payment is settled on the *invocation*: the call executed with an accepted signature, therefore the keeper gets paid. Whether the call actually produced the intended state is not part of settlement. STATEKEEP settles on the **result**: the executor's action can complete on-chain successfully and STATEKEEP will still pay nothing if the resulting state does not satisfy the predicate. There is no keeper role. There is no scheduled invocation. There is no allow-listed operator.

### It is not an intent system (CowSwap, ERC-7683, UniswapX)

An intent system takes a user-signed **preference** ("I want ≥ X of token Y for Z of token W by deadline D") and hires a solver to *fulfill* it. The intent describes a **transaction shape**; the solver produces a matching transaction. STATEKEEP does not accept intents — it accepts **conditions on shared state**. There is no user preference. There is no fill. There is nothing being routed. The protocol is not asking "please move this asset for me"; it is asking "please make and keep this condition true, and I will pay you if the chain agrees you did."

### It is not a bounty board (Immunefi, GitCoin bounties)

A bounty board is a marketplace of **subjective tasks** with a **human arbiter** who decides whether the submitted work is good enough for payment. STATEKEEP has no human arbiter and no subjective evaluation. The predicate is machine-checkable code, pinned at market creation, executed by the chain. If two executors race and both make the state pass, the first one gets paid. If neither does, nobody gets paid. Nobody is judging quality.

### It is not a liquidation protocol (Morpho, Aave liquidations)

A liquidation protocol lets anyone close an unhealthy position in exchange for a bonus. It is a **special case** of one specific state (an under-collateralized loan) with one specific action (seize collateral, repay debt). STATEKEEP is the general primitive: a liquidation is *one* market STATEKEEP could host, but STATEKEEP does not know or care about lending — it only knows about predicates, baselines, durability, and reconciliation. A liquidation protocol also pays on *the fact of the close*, not on the durability of health afterwards; STATEKEEP defers reward until the healthy state holds through a window.

### It is not a transaction-assertion layer (Phylax, Fault Proofs, PBS-style assertions)

Assertion layers let a protocol attach *conditions* that a transaction must satisfy for it to land — the check happens **inside the same transaction** as the state change. STATEKEEP checks state **after** the executor's action, against a committed baseline and a pinned predicate, and pays across a durability window that spans **many transactions and many slots**. STATEKEEP is not a transaction assertion; it is an *outcome-conditional payment* across time.

### It is not insurance

Insurance pays out when a covered event happens. STATEKEEP does not indemnify losses — it pays to keep the loss from occurring or to reverse it while it is still reversible. There is no premium, no claims adjuster, no coverage schedule, no expected-loss underwriting. The economic object is the state itself, not the loss.

### It is not a solver marketplace or verified-work market

Solver marketplaces and verified-work markets take arbitrary off-chain computation and use a verifier (a fraud proof, a ZK proof, an optimistic challenge) to check the answer. STATEKEEP does not verify computation — it verifies **on-chain state**, which is already canonical. There is no off-chain work being attested to. There is no verifier separate from the chain. The chain *is* the verifier.

---

## What STATEKEEP IS, at the primitive level

- **Market**: `(predicate, baseline, protected accounts, reward, bond, durability, expiry)`.
- **Claim**: an executor asserts that after their action, the predicate holds against the current on-chain state.
- **Settlement**: 25% paid immediately if the predicate holds; the remaining 75% held in escrow through the durability window; released if and only if the predicate *still* holds at the end.
- **Slash**: if the predicate fails during the window, or if reconciliation shows a protected balance was violated, the deferred reward is forfeited and the executor's bond is slashed.
- **Anyone can finalize**: the outcome is decided by evaluating on-chain state, not by any reporter's word.

The whole primitive is a settlement rule. Everything else follows from it.

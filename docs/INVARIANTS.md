# INVARIANTS

These invariants are the correctness spec. Every one of them is enforced by explicit code in the STATEKEEP program and covered by at least one adversarial test in `tests/`. If any test can violate one of I1..I8, the program is broken and cannot ship.

---

## I1 · Cannot pay twice for the same market epoch

**Statement.** For any `Market`, the immediate reward is paid at most once and the deferred reward is paid at most once.

**Enforcement.**
- `Market.state` transitions `OPEN → CLAIMED` inside `claim()`; the handler returns `Err(MarketNotOpen)` if the state is not `OPEN`.
- `RewardVault.immediate_paid: bool` is asserted `false` on entry to `claim()` and set to `true` before the state write.
- `RewardVault.deferred_paid: bool` is asserted `false` on entry to `finalize()` and set to `true` before payout.
- Only one `ClaimRecord` PDA can exist per market: seeds = `(b"claim", market.key())`.

**Tests.** `tests/double_claim.ts`, `tests/double_finalize.ts`, `tests/replay_claim.ts`.

---

## I2 · Cannot pay if predicate is false

**Statement.** No lamport leaves the reward vault to an executor unless the pinned predicate CPI returned `true` in the same instruction.

**Enforcement.**
- `claim()` calls `predicate::evaluate` via CPI and matches on the returned `bool` (or on the CPI result being `Ok(1)` in the raw ABI). Any error, panic, or `false` return causes `claim()` to abort before the reward transfer.
- `finalize()` re-calls the predicate CPI. `false` sends the market to `FAILED`, which has no payout path.
- The predicate program ID is pinned in `PredicateConfig` at market creation and cannot be swapped.

**Tests.** `tests/fake_claim.ts`, `tests/predicate_swap.ts`, `tests/predicate_panic.ts`, `tests/predicate_returns_false.ts`.

---

## I3 · Cannot finalize before maturity

**Statement.** For any market in `PENDING`, `finalize()` may not execute successfully while `clock.slot < market.maturity_slot`.

**Enforcement.**
- `finalize()` begins with `require!(clock.slot >= market.maturity_slot, StatekeepError::TooEarly)`.
- `Market.maturity_slot` is set inside `claim()` as `clock.slot + market.durability_slots` and is not writable afterwards.

**Tests.** `tests/early_finalize.ts`, `tests/finalize_at_maturity_slot.ts` (boundary).

---

## I4 · Deferred reward unreachable early

**Statement.** The 75% deferred reward cannot be withdrawn from the reward vault by any signer before `finalize()` runs on or after `maturity_slot` with predicate = true.

**Enforcement.**
- Reward vault authority is the STATEKEEP program PDA (`seeds = (b"vault", market.key())`).
- No instruction other than `finalize()` (matured branch) transfers deferred funds out.
- The immediate 25% is dispatched inside `claim()` in a separate `token::transfer`; the deferred 75% remains.

**Tests.** `tests/vault_withdraw_attempt.ts`, `tests/finalize_before_maturity.ts`.

---

## I5 · Invalid executor cannot steal a valid claim

**Statement.** Only the pubkey that signed the successful `claim()` can receive payout at `finalize()`.

**Enforcement.**
- `ClaimRecord.executor: Pubkey` is set to `ctx.accounts.executor.key()` inside `claim()`.
- `finalize()` reads `claim_record.executor` and constrains the executor token account: `constraint = executor_token_account.owner == claim_record.executor`.
- No user-supplied "recipient" argument exists on `finalize()`.

**Tests.** `tests/wrong_executor_finalize.ts`, `tests/recipient_substitution.ts`.

---

## I6 · Predicate account set cannot be swapped

**Statement.** The set of accounts fed to the predicate at `claim` and `finalize` must be byte-identical to the set pinned at `create_market`.

**Enforcement.**
- `PredicateConfig.pinned_accounts: Vec<Pubkey>` is written at `create_market` and read-only thereafter.
- `claim()` and `finalize()` verify `remaining_accounts` length and each pubkey against `pinned_accounts` before dispatching CPI: `for (a, p) in remaining_accounts.iter().zip(pinned_accounts.iter()) { require_keys_eq!(a.key(), *p) }`.

**Tests.** `tests/account_substitution.ts`, `tests/missing_account.ts`, `tests/extra_account.ts`, `tests/reordered_accounts.ts`.

---

## I7 · Bond locked while pending

**Statement.** From `claim()` success until `finalize()` (matured or failed branch) or `slash()`, the executor's bond amount is not transferable by the executor.

**Enforcement.**
- `ExecutorBond` is a PDA (`seeds = (b"bond", market.key(), executor.key())`) owned by the STATEKEEP program.
- The bond token account authority is the program PDA; the executor is not a signer on it.
- `ExecutorBond.locked_until_state: MarketState` prevents a bond `withdraw` instruction (if we add one later) from running while the market is `CLAIMED`, `PENDING`, or `FAILED`.

**Tests.** `tests/bond_early_withdraw.ts`, `tests/bond_locked_across_finalize.ts`, `tests/bond_returned_on_paid.ts`, `tests/bond_slashed_on_slash.ts`.

---

## I8 · Completed market cannot reopen

**Statement.** A market in `PAID`, `SLASHED`, or `EXPIRED` is terminal — no instruction can transition it back to `OPEN`, `CLAIMED`, or `PENDING`.

**Enforcement.**
- Every state-mutating instruction begins with a `require!` matching on the allowed source states.
- The state field is written last in each handler; any early return preserves the prior state.

**Tests.** `tests/reopen_after_paid.ts`, `tests/reopen_after_slashed.ts`, `tests/reopen_after_expired.ts`, `tests/fund_after_terminal.ts`.

---

## The property form

For any well-formed transaction trace `T = t_1, t_2, ..., t_n` on the STATEKEEP program:

1. ∀ market M, ∀ i,j : `paid_immediate(M, t_i) ∧ paid_immediate(M, t_j) ⟹ i == j`.
2. ∀ market M, ∀ i,j : `paid_deferred(M, t_i) ∧ paid_deferred(M, t_j) ⟹ i == j`.
3. ∀ market M, ∀ t : `paid_immediate(M, t) ⟹ predicate(M, t) == true`.
4. ∀ market M, ∀ t : `paid_deferred(M, t) ⟹ predicate(M, t) == true ∧ slot(t) ≥ maturity(M)`.
5. ∀ market M, ∀ t : `paid(M, t) ⟹ recipient(t) == claim_record(M).executor`.
6. ∀ market M, ∀ t in CPI(predicate) : `accounts(t) == pinned_accounts(M)`.
7. ∀ market M in {PAID, SLASHED, EXPIRED}, ∀ future t : `state(M, t) ∈ {PAID, SLASHED, EXPIRED}`.

Every property above is a test in `tests/property/` when phase C property fuzzing is added; Phase A ships them as concrete adversarial tests.

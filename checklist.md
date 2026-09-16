# STATEKEEP — Execution Checklist (local only)

**One-line pitch:** Protocols pay whoever proves their critical condition is actually healthy — verified on-chain, paid only if it lasts.

**Non-negotiable definition:** STATEKEEP is a permissionless market for maintaining machine-checkable onchain state. Protocols fund a condition. Executors compete to make or restore it. Payment is determined by the resulting state, not by the call. A durability window prevents temporary-state manipulation.

**Do not expand scope during the build.** No new mechanisms, no side features, no "while we're here." If an idea isn't in this checklist, it waits.

---

## PHASE A — MECHANISM (pre-hackathon, local)

### A1 · Spec & docs (Day 1)
- [ ] `THESIS.md` — one-paragraph technical definition + what STATEKEEP is NOT (keeper network / intent system / bounty board / liquidation protocol / transaction-assertion layer / insurance / solver marketplace / verified-work market)
- [ ] `ATTACKS.md` — every prior-art attack (Chainlink/Gelato/Keep3r/Morpho/OEV/intents/bounties/ERC-7683/EIP-7906) with the defense
- [ ] `docs/state-machine.md` — states OPEN / CLAIMED / PENDING / MATURED / PAID / FAILED / SLASHED / EXPIRED; every legal + illegal transition; who triggers each
- [ ] `docs/INVARIANTS.md` — I1..I8 (cannot pay twice; cannot pay if predicate false; cannot finalize before maturity; deferred reward unreachable early; invalid executor cannot steal claim; predicate account cannot be swapped; bond locked while pending; completed market cannot reopen)
- [ ] `docs/THREAT_MODEL.md` — actors (honest executor, malicious executor, malicious protocol, malicious predicate author, claim sniper, griefer, RPC operator, UI attacker) × capability/goal/attack/defense/remaining-risk
- [ ] `docs/WHY_NOT.md` — comparison table vs Chainlink/Gelato/Keep3r/Morpho/intents/bounties (precise, not "they're bad")
- [ ] Gate: explain STATEKEEP in 15s without saying "state predicate" — "Protocols pay whoever proves their critical condition is actually healthy."

### A2 · State machine review
- [ ] Gate: find a state where money is paid without every condition satisfied → if one exists, do not continue

### A3 · Anchor skeleton
- [ ] `anchor init` workspace
- [ ] Program init, bounty account, predicate config, reward vault, executor bond account
- [ ] `create_market()` / `fund_market()` / `claim()` / `finalize()` / `slash()` / `expire()`
- [ ] Goal working on localnet: create → fund → claim → pay

### A4 · Predicate architecture
- [ ] Predicate interface (CPI): `evaluate(accounts, config) -> bool`
- [ ] Reject malformed account sets; predicate version/hash pinned; immutable after activation
- [ ] Three example predicates: A `reserve >= 80%`; B `reserve >= 80% AND protected_balance_delta >= -10`; C `health >= threshold AND debt <= threshold`

### A5 · Baseline commitment
- [ ] Store baseline at market creation (minimal values the predicate needs; hash large structures)
- [ ] Tests: stale-baseline attack, account substitution, missing-account attack

### A6 · First end-to-end (localnet)
- [ ] CLI (protocol side) + CLI (executor side), events, readable errors
- [ ] Deterministic local demo: market → funded → executor changes state → claim → predicate passes → pending
- [ ] Record screen; can a stranger follow it without narration?

### A7 · First brutal attack day
- [ ] 50+ adversarial tests: fake claim, wrong predicate, wrong accounts, stale baseline, double claim, double payment, wrong executor, insufficient bond, reward theft, malformed predicate, unauthorized finalize, unauthorized slash, market reuse, replay

### A8 · Durability state machine
- [ ] CLAIM → 25% now → PENDING → M-slot window → finalize → 75% or slash
- [ ] Maturity slots configurable; pending account; locked remainder; bond; timeout rules
- [ ] Gate: no executor gets 100% merely because the state was temporarily true

### A9 · Regression challenge
- [ ] Adversarial regression tests: state passes claim then breaks before finalize; protected balance decreases; executor manipulates another account
- [ ] Regression detection, bond slash, reward forfeiture, permissionless finalize, false-report resistance

### A10 · Watchtower decision
- [ ] `finalize()` callable by anyone; anyone can trigger failure detection; reporter cannot decide the result — program evaluates state itself

### A11 · Delta guard demo
- [ ] Composite predicate: `reserve >= 80% AND protected >= baseline - X AND debt <= baseline + Y`
- [ ] Attack: reserve 79→83 but protected 500→300 → FALSE, no pay
- [ ] Honest: reserve 79→83, protected preserved → TRUE

### A12 · Economics review
- [ ] `docs/economics.md`: free rider, claim sniping, bounty stealing, repeated failed claims, griefing, executor withholding, reward/bond calibration, spam predicates, protocol rug risk, executor collusion

### A13 · MEV / race analysis
- [ ] `docs/mev.md`: copied execution, first-valid race, sandwiching, tx visibility, failed-claim griefing, private submission
- [ ] MVP keeps first-valid-wins; document production improvements separately

### A14 · Phase A freeze
- [ ] 100+ tests green on localnet; reset script; deterministic demo; invariant assertions; clean errors; README architecture current
- [ ] Gate: can intentionally demonstrate FAKE STATE → NO MONEY, TEMPORARY STATE → NO FULL MONEY, ECONOMIC CHEAT → NO MONEY, VALID STATE → MONEY

---

## PHASE B — PRODUCT (pre-hackathon, local)

### B1 · Frontend foundation
- [ ] Home: "STATEKEEP — Pay for reality. Not for calls."
- [ ] Pages: Markets / Create Market / Executors / Activity / Docs
- [ ] Professional UI (no crypto-dashboard ugliness)

### B2 · Market creation screen
- [ ] Fields: condition, baseline, protected accounts, reward, bond, durability, expiry
- [ ] Shows: "What exactly will the chain verify?" before deploy

### B3 · Live market page
- [ ] Status / current state / target state / reward / bond / durability / claimant / time remaining
- [ ] State proof: BEFORE 79.2% → CURRENT 83.1% → PREDICATE ✓ (real chain reads only)

### B4 · Executor experience
- [ ] Opportunities list (market, potential reward, bond, current condition, target) + EXECUTE → EXECUTED → CLAIMED → PENDING

### B5 · Attack mode (UI)
- [ ] Buttons: Fake result / Break protected balance / Temporary state / Wrong account / Predicate bypass
- [ ] Judge sees the system defeat the attacker — not a happy-path walkthrough

### B6 · Main demo scenario
- [ ] One cinematic scenario: reserve falls 82.1% → 79.4%; market opens; Executor A (invalid) ❌, Executor B (temporary) ❌ fails durability, Executor C (valid + durable) ✓ paid

---

## PHASE C — REALISM & VERIFICATION (event window)

### C1 · Solana production pass
- [ ] Devnet deployment; PDAs, signer constraints, account ownership, CPI authority, overflow/underflow, decimals, token-account correctness, compute optimization, tx simulation

### C2 · Public testnet launch
- [ ] Program IDs frozen; frontend → devnet; explorer links; real transactions; public demo market; executor/protocol/attack wallets
- [ ] Give system to someone else; don't explain; record confusion; fix top five

### C3 · Cross-chain story (spec only — NO fake multichain)
- [ ] `docs/multichain.md`: same primitive, different chain markets (Solana fast / Base consumer / Ethereum high-value). No bridge, no cross-chain truth, no live-interop claims unless actually built

### C4 · Real transaction receipts
- [ ] Every README claim links a real Solana Explorer tx/program/account

### C5 · Attack replay package
- [ ] `/demo/attacks/` reproducible: fake_claim, temporary_state, delta_attack, wrong_account, double_claim — `pnpm demo:attack`

### C6 · Honest limitations page
- [ ] STATEKEEP does NOT: prove arbitrary offchain work, read historical state, guarantee arbitrary predicate correctness, prevent a malicious predicate author, solve cross-chain verification, eliminate MEV, auto-create demand

### C7 · Real economic model
- [ ] `docs/economics-model.md`: reward, bond, gas, success/failure probability, attack cost, executor ROI, protocol savings — answer "why would an executor do this?" and "why pay this instead of one keeper?"

### C8 · Predicate SDK + harness (moat)
- [ ] `trait StatePredicate { fn evaluate(accounts, config) -> Result<bool> }` + examples (third parties can write predicates)
- [ ] `statekeep-audit` harness: given predicate + baseline + accounts, generate manipulations / side effects / boundaries / rounding / substitution / transients; report gameability

### C9 · Customer interviews
- [ ] Talk to ≥3 protocol builders: "What state do you pay someone to maintain? What happens when nobody does? How much does that failure cost? Would you fund an open market to keep it true?"
- [ ] Record negative responses honestly — do not manufacture positive feedback

### C10 · Final security pass
- [ ] `AUDIT-FINDINGS.md` self-audit (act as external auditor): privilege escalation, PDA spoofing, CPI authority confusion, account substitution, token-account mismatch, arithmetic, replay, reentrancy assumptions, reward duplication, failed finalization, malicious predicate/owner → fix everything fixable

### C11 · Fuzz + property tests
- [ ] Property tests: ∀ execution payment ≤ reward; ∀ invalid state payment = 0; ∀ completed round payment ≤ once; ∀ pending round 100% locked; ∀ durability failure deferred ≤ 0; ∀ unauthorized caller no state mutation
- [ ] 500+ generated adversarial cases

---

## PHASE D — SUBMISSION (event window, final days)

### D1 · Presentation
- [ ] 10 slides max: Pay-for-proven-results → the problem → existing model (CALL→SUCCESS→PAY) → STATEKEEP (STATE→PROVE→PAY) → attack demo → durability → why now → business → architecture → live system

### D2 · Judge-attack prep
- [ ] One-sentence ≤15s answers: "Isn't this Chainlink/Keep3r/Morpho/bounty/intent?" "Why would anyone pay?" "What if state is temporary?" "How do you know the baseline?" "Why blockchain?" "Why Solana?" "Why a company?" "Why you?"

### D3 · Demo videos (user records personally)
- [ ] 30s hook video; 90s technical; 3min full; backup demo; all real transactions, clean env, no cached state
- [ ] Website-only demo (never terminal/GitHub in the recording)

### D4 · README final pass
- [ ] Honesty table updated line-by-line: every Pending → real with receipt, or stays Pending
- [ ] Real tx links verified on explorer; no fabricated hashes; no mock/simul/sample/hardcoded anywhere (grep sweep)
- [ ] WHY_NOT.md survives prior-art attack; limitations page present; architecture diagram; threat model; test stats

### D5 · Final gate (all must be true)
- [ ] Stranger understands the hook in <10s; understands the demo without crypto knowledge
- [ ] Fake claims visibly fail; temporary-state attack visibly fails; delta manipulation visibly fails; valid state visibly paid
- [ ] 100% payout impossible before maturity; predicate independently programmable; baseline explicit; no historical-state fiction
- [ ] No oracle, no bridge, no trusted keeper, no centralized verifier deciding truth
- [ ] 100+ adversarial tests; property tests exist; devnet deployment public; all important claims have tx receipts
- [ ] ≥3 real potential customers contacted (negative responses included honestly)
- [ ] Executor + protocol economics modeled; demo works clean; backup demo exists; 30s + 3min videos exist
- [ ] Predicate SDK + adversarial harness exist; no fake metrics/users/transactions; no unsupported "first ever" claims

---

## FINAL RULE

**Do not add features because the project feels small.** STATEKEEP's power is one mechanism — pay for proven, durable state — extraordinarily well executed, with adversarial proof it actually works. Every hour goes to that mechanism or to proving it. Nothing else.

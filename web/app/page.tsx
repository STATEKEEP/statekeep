import Link from "next/link";
import { ArrowUpRight, Check, X } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section } from "@/components/section";
import { StateBadge } from "@/components/state-badge";
import { StateMachineDiagram } from "@/components/state-machine-diagram";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
          <div className="absolute inset-0 bloom pointer-events-none" />
          <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32 relative">
            <div className="eyebrow mb-6 fade-up">
              <span className="text-amber-400">●</span> self-healing protocols · solana · anchor
            </div>
            <h1 className="fade-up text-5xl md:text-7xl font-semibold tracking-tight text-ink-050 leading-[1.02] max-w-4xl">
              Pay for{" "}
              <span className="shimmer-text">reality</span>.
              <br />
              Not for calls.
            </h1>
            <p className="fade-up mt-8 max-w-2xl text-lg text-ink-300 leading-relaxed">
              Today&apos;s keepers get paid for pressing the button. STATEKEEP
              settles on the <em className="text-ink-100 not-italic">resulting on-chain state</em>,
              held across a durability window, reconciled against the whole
              protected surface. A protocol declares what &ldquo;healthy&rdquo;
              means and how it may be repaired — anyone can attempt a recovery,
              and the chain decides settlement.
            </p>

            <div className="fade-up mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/how-it-works"
                className="group inline-flex items-center gap-2 rounded-[var(--radius-3)] bg-amber-400 px-5 py-3 text-sm font-medium text-ink-950 transition-colors hover:bg-amber-500"
              >
                How it works
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="https://github.com/STATEKEEP/statekeep"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius-3)] border border-border-strong bg-ink-900 px-5 py-3 text-sm text-ink-100 transition-colors hover:border-amber-500/50 hover:bg-ink-850"
              >
                <span className="mono text-xs tracking-widest text-ink-400">SRC</span>
                <span>github.com/STATEKEEP/statekeep</span>
              </a>
            </div>

            {/* Spec artifact — the shadcn-blocks pattern: hero followed immediately by a code/spec surface. */}
            <div className="fade-up mt-16 rounded-[var(--radius-4)] border border-border bg-ink-900/70 backdrop-blur">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
                <div className="mono text-[11px] tracking-widest text-ink-400">
                  RECOVERY CONTRACT · registered by a protocol
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-ink-700" />
                  <span className="h-2 w-2 rounded-full bg-ink-700" />
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                </div>
              </div>
              <pre className="mono text-[13px] leading-[1.7] text-ink-200 px-6 py-5 overflow-x-auto">
{`HEALTH CONDITION      reserve_ratio >= 80%
ALLOWED RECOVERY      withdraw insurance · rebalance pool · repay debt
PROTECTED STATE       user principal unchanged · debt <= baseline
RECOVERY REWARD       as registered
DURABILITY WINDOW     M slots`}
              </pre>
              <div className="border-t border-border/60 px-6 py-3 text-xs text-ink-400 leading-relaxed">
                <span className="text-ink-100">Nothing arbitrary.</span> The protocol
                pre-authorizes the shape of a valid recovery — nobody is ever handed
                open admin authority over live state.
              </div>
            </div>
          </div>
        </section>

        {/* CALL vs REALITY comparison */}
        <Section
          eyebrow="the distinction the whole design turns on"
          title="Two ways to pay a keeper. Only one settles on truth."
        >
          <div className="grid md:grid-cols-2 gap-4">
            {/* CALL side */}
            <div className="rounded-[var(--radius-4)] border border-border bg-ink-900 p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-[var(--radius-2)] border border-state-failed/40 px-2 py-0.5 mono text-[10px] tracking-widest text-state-failed">
                  TODAY
                </div>
                <div className="mono text-xs text-ink-400">pay for the call</div>
              </div>
              <div className="mono text-sm text-ink-300 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-ink-500">1</span>
                  <span>CALL</span>
                  <span className="text-ink-600">·</span>
                  <span className="text-ink-500">bot invokes upkeep()</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-ink-500">2</span>
                  <span>SUCCESS</span>
                  <span className="text-ink-600">·</span>
                  <span className="text-ink-500">function returned</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-ink-500">3</span>
                  <span>PAY</span>
                  <span className="text-ink-600">·</span>
                  <span className="text-ink-500">reward disbursed</span>
                </div>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-ink-300">
                {[
                  "Reward flows for activity, not outcomes",
                  "Fixing one metric while breaking another is undetectable",
                  "A one-block fix is paid as if it were durable",
                  "One designated keeper: single point of failure",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-state-failed" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* STATE side */}
            <div className="rounded-[var(--radius-4)] border border-amber-600/40 bg-gradient-to-b from-ink-900 to-ink-950 p-6 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
              <div className="mb-6 flex items-center gap-3 relative">
                <div className="rounded-[var(--radius-2)] border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 mono text-[10px] tracking-widest text-amber-400">
                  STATEKEEP
                </div>
                <div className="mono text-xs text-ink-300">pay for the result</div>
              </div>
              <div className="mono text-sm text-ink-100 space-y-3 relative">
                <div className="flex items-center gap-3">
                  <span className="text-ink-500">1</span>
                  <span>STATE</span>
                  <span className="text-ink-600">·</span>
                  <span className="text-ink-400">condition breaks, capability opens</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-ink-500">2</span>
                  <span>PROVE</span>
                  <span className="text-ink-600">·</span>
                  <span className="text-ink-400">valid transition applied, bond locked</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-ink-500">3</span>
                  <span>PAY</span>
                  <span className="text-ink-600">·</span>
                  <span className="text-ink-400">only after the state <em className="not-italic text-ink-100">stays</em> valid</span>
                </div>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-ink-200 relative">
                {[
                  "Reward gated by evaluated on-chain state",
                  "Whole-state reconciliation catches metric-swap attacks",
                  "Durability window with bond & slash for regressions",
                  "Anyone may attempt; the chain evaluates the result",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* STATE MACHINE */}
        <Section
          eyebrow="every market moves through exactly these states"
          title={
            <>
              The state machine <span className="text-ink-400">is</span> the product.
            </>
          }
        >
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
            <StateMachineDiagram />
            <div className="rounded-[var(--radius-4)] border border-border bg-ink-900 p-5 text-sm text-ink-300 leading-relaxed space-y-3">
              <div className="eyebrow">absorbing states</div>
              <div className="flex flex-wrap items-center gap-2">
                <StateBadge name="PAID" />
                <StateBadge name="SLASHED" />
                <StateBadge name="EXPIRED" />
              </div>
              <p className="pt-2 text-ink-400">
                Any account whose current state is not in the diagram is corrupt
                and the program refuses to touch it. Illegal transitions are
                enforced by explicit <span className="mono text-ink-200">require!</span>{" "}
                statements in the handler.
              </p>
              <div className="pt-3 border-t border-border/60 mono text-[11px] text-ink-500">
                see docs/state-machine.md
              </div>
            </div>
          </div>
        </Section>

        {/* DURABILITY */}
        <Section
          eyebrow="the durability window"
          title="A recovery is not paid in full merely because the state was true at claim time."
        >
          <div className="rounded-[var(--radius-4)] border border-border bg-ink-900 overflow-hidden">
            <div className="grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
              {[
                {
                  step: "claim()",
                  who: "executor",
                  label: "predicate = true · bond locked",
                  reward: "25% paid immediately",
                  badge: "CLAIMED" as const,
                },
                {
                  step: "pending",
                  who: "waiting for maturity",
                  label: "state must continue to hold",
                  reward: "75% escrowed",
                  badge: "PENDING" as const,
                },
                {
                  step: "finalize()",
                  who: "anyone",
                  label: "predicate re-checked at slot ≥ maturity",
                  reward: "75% released or forfeited",
                  badge: "MATURED" as const,
                },
                {
                  step: "final",
                  who: "chain settlement",
                  label: "durable → paid  ·  regressed → slash()",
                  reward: "bond returned or confiscated",
                  badge: "PAID" as const,
                },
              ].map((c, i) => (
                <div key={i} className="p-6">
                  <div className="mono text-[10px] tracking-widest text-ink-500 mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mono text-sm text-amber-400 mb-1">{c.step}</div>
                  <div className="text-xs text-ink-500 mb-4">{c.who}</div>
                  <div className="text-sm text-ink-200 mb-4">{c.label}</div>
                  <div className="text-xs text-ink-400 border-t border-border/60 pt-3">
                    {c.reward}
                  </div>
                  <div className="mt-3">
                    <StateBadge name={c.badge} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-[var(--radius-4)] border border-border bg-ink-850 p-5 text-sm text-ink-300 leading-relaxed">
            <span className="text-amber-400 mono text-xs tracking-widest">I3 · </span>
            The deferred reward is unreachable until the durability window
            closes. A durability failure ⇒ the deferred reward is forfeited plus
            the bond is slashed. This is a first-class phase with the
            executor&apos;s money at stake, so the incentive is to produce state
            that <em className="text-ink-100 not-italic">lasts</em>.
          </div>
        </Section>

        {/* EXECUTOR MARKET */}
        <Section
          eyebrow="the executor market"
          title="No single trusted operator. The economic object is the resulting state."
        >
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Protocol",
                mono: "defines safety",
                body: "Registers the recovery contract: health condition, allowed repairs, protected state, reward, durability window. Funds the reward vault.",
              },
              {
                title: "Executor",
                mono: "discovers execution",
                body: "Anyone may attempt a recovery. Bond required. Rehearse against a sealed copy of state, apply the proven delta through the live program.",
              },
              {
                title: "Chain",
                mono: "decides settlement",
                body: "Evaluates the transition against current state, reconciles the protected surface, holds through the durability window, pays or slashes.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="group rounded-[var(--radius-4)] border border-border bg-ink-900 p-6 transition-colors hover:border-amber-600/40 hover:bg-ink-850"
              >
                <div className="mono text-[10px] tracking-widest text-ink-500 mb-1">
                  {c.mono}
                </div>
                <div className="text-xl font-semibold text-ink-050 mb-3">
                  {c.title}
                </div>
                <div className="text-sm text-ink-300 leading-relaxed">{c.body}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* HONEST STATUS */}
        <Section
          eyebrow="what's real vs pending"
          title="The honesty table."
        >
          <div className="rounded-[var(--radius-4)] border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ink-900">
                <tr className="text-left mono text-[11px] tracking-widest text-ink-400">
                  <th className="px-5 py-3 font-normal">capability</th>
                  <th className="px-5 py-3 font-normal">status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Recovery contract design", "Spec'd — pending implementation"],
                  ["Bounded one-use recovery capability", "Spec'd — pending implementation"],
                  ["Whole-state reconciliation", "Spec'd — pending implementation"],
                  ["Durability window with bond/slash", "Spec'd — pending implementation"],
                  ["Sealed-state rehearsal", "Spec'd — pending implementation"],
                  ["Recovery capsules", "Spec'd — pending implementation"],
                  ["Anchor program", "Pending — not built yet"],
                  ["CLI + frontend (this site)", "In progress"],
                  ["Deployment + real transactions", "Pending — nothing deployed"],
                  ["Adversarial test suite", "Pending — not written"],
                  ["Transaction receipts", "Pending — no hashes exist"],
                ].map(([cap, status], i) => {
                  const pending = status.startsWith("Pending");
                  const progress = status.startsWith("In");
                  return (
                    <tr key={i} className="bg-ink-950/60 hover:bg-ink-900/60 transition-colors">
                      <td className="px-5 py-3 text-ink-200">{cap}</td>
                      <td className="px-5 py-3">
                        <span
                          className={
                            pending
                              ? "mono text-xs text-state-failed"
                              : progress
                                ? "mono text-xs text-amber-400"
                                : "mono text-xs text-ink-300"
                          }
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-ink-400 max-w-2xl leading-relaxed">
            Nothing above is claimed as built. This table is updated line by
            line as each capability becomes real and verifiable — the same
            table that lives in{" "}
            <a
              className="underline decoration-ink-600 hover:decoration-amber-400 hover:text-amber-400 transition-colors"
              href="https://github.com/STATEKEEP/statekeep/blob/main/README.md"
              target="_blank"
              rel="noreferrer"
            >
              README.md
            </a>
            .
          </p>
        </Section>

        {/* FAQ */}
        <Section eyebrow="questions worth answering honestly" title="FAQ">
          <div className="divide-y divide-border border border-border rounded-[var(--radius-4)] overflow-hidden">
            {[
              {
                q: "Is anything deployed?",
                a: "No. There is no live program, no mainnet address, no transaction receipts. The docs, the state machine, and the invariants exist and are pinned in the repo; the Anchor implementation is next.",
              },
              {
                q: "Why not just use Chainlink Automation / Gelato / Keeper networks?",
                a: "They settle on the call, not the state. A keeper can invoke the upkeep function on a useless path and still be paid; a one-block fix is paid for as if it were durable; whole-state reconciliation is not part of the payment gate. STATEKEEP's whole point is to move the settlement object from the call to the resulting state.",
              },
              {
                q: "Doesn't the executor bond just centralize things by capital?",
                a: "The bond is a slash surface, not a moat. Anyone may attempt a recovery; anyone may finalize; anyone may slash a failed one. The bond exists so the durability window has teeth — regression costs the executor, not the protocol.",
              },
              {
                q: "How do you compare current state against a baseline without reading history?",
                a: "You don't read history. The baseline is committed at registration; the program compares committed baseline to current state, and — where a rehearsal is used — against a sealed root the protocol committed. STATEKEEP never claims to read historical chain state.",
              },
              {
                q: "What is a 'recovery capsule'?",
                a: "A recovery that has been proven valid and durable can be registered as a machine-recognized strategy for future incidents of the same shape. The protocol's ability to recover compounds instead of being relearned.",
              },
            ].map((f) => (
              <details key={f.q} className="group bg-ink-900/60 open:bg-ink-900">
                <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between text-ink-100 hover:text-amber-400 transition-colors">
                  <span className="pr-4">{f.q}</span>
                  <span className="mono text-ink-500 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-ink-300 leading-relaxed max-w-3xl">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

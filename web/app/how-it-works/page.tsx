import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section } from "@/components/section";
import { StateBadge } from "@/components/state-badge";
import { StateMachineDiagram } from "@/components/state-machine-diagram";

export const metadata = {
  title: "How it works — STATEKEEP",
  description:
    "The recovery contract, the 25/75 durability split, the delta guard, and whole-state reconciliation.",
};

export default function HowItWorks() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 relative">
            <div className="eyebrow mb-4">how it works</div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-050 max-w-3xl">
              The recovery contract is the object. Not a job, not a bounty, not
              a keeper subscription.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ink-300">
              A protocol declares what &ldquo;healthy&rdquo; means and how it
              may be repaired. STATEKEEP evaluates the resulting state, holds
              through a durability window, and pays only what actually lasts.
            </p>
          </div>
        </section>

        <Section eyebrow="1 · the recovery contract" title="Five lines a protocol writes once.">
          <div className="rounded-[var(--radius-4)] border border-border bg-ink-900">
            <pre className="mono text-[13px] leading-[1.9] text-ink-200 px-6 py-6 overflow-x-auto">
{`THIS PROTOCOL becomes unhealthy when   reserve_ratio < 80%
THIS is the allowed way to recover      withdraw insurance · rebalance pool · repay debt
THIS may never be damaged               user_principal unchanged · debt <= baseline
THIS is the reward                      as registered
THIS is how long recovery must survive  M slots`}
            </pre>
          </div>
          <p className="mt-6 max-w-2xl text-sm text-ink-300">
            The separation is the whole design:{" "}
            <em className="text-ink-050 not-italic">
              the protocol defines safety, the executor discovers execution,
              the chain decides settlement.
            </em>
          </p>
        </Section>

        <Section
          eyebrow="2 · the 25 / 75 durability split"
          title="Pay the attempt in part. Pay the outcome after it lasts."
        >
          <div className="rounded-[var(--radius-4)] border border-border bg-ink-900 p-6">
            <div className="mono text-xs text-ink-400 mb-6">
              reward split · timeline reads left to right
            </div>

            {/* Split bar */}
            <div className="relative h-14 rounded-[var(--radius-2)] overflow-hidden border border-border-strong flex">
              <div className="w-1/4 bg-amber-400/80 flex items-center justify-center">
                <span className="mono text-xs text-ink-950">25% · immediate</span>
              </div>
              <div className="w-3/4 bg-ink-800 border-l border-border-strong flex items-center justify-center relative">
                <span className="mono text-xs text-ink-200">
                  75% · escrowed through durability window
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-8 grid grid-cols-4 gap-4 text-xs">
              <div>
                <div className="mono text-amber-400">t = 0</div>
                <div className="text-ink-400 mt-1">
                  claim() lands · predicate returned true · bond locked · 25%
                  paid
                </div>
                <div className="mt-3">
                  <StateBadge name="CLAIMED" />
                </div>
              </div>
              <div>
                <div className="mono text-ink-300">t &lt; M</div>
                <div className="text-ink-400 mt-1">
                  waiting for maturity slot · state must continue to hold ·
                  75% escrowed
                </div>
                <div className="mt-3">
                  <StateBadge name="PENDING" />
                </div>
              </div>
              <div>
                <div className="mono text-success">t = M · ✓</div>
                <div className="text-ink-400 mt-1">
                  finalize() · predicate re-checked · returned true · 75%
                  released
                </div>
                <div className="mt-3">
                  <StateBadge name="PAID" />
                </div>
              </div>
              <div>
                <div className="mono text-state-failed">t = M · ✗</div>
                <div className="text-ink-400 mt-1">
                  finalize() · predicate false · 75% forfeited · slash() burns
                  bond
                </div>
                <div className="mt-3">
                  <StateBadge name="SLASHED" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-[var(--radius-4)] border border-border bg-ink-900 p-5">
              <div className="eyebrow mb-2">why not 100% up front</div>
              <p className="text-sm text-ink-300 leading-relaxed">
                Because a state that is true for one block is not a durable
                repair. Prior-art keeper systems settle on the block containing
                the call. STATEKEEP holds a majority of the reward past the
                incident, so a fix that regresses does not get paid for the
                regression.
              </p>
            </div>
            <div className="rounded-[var(--radius-4)] border border-border bg-ink-900 p-5">
              <div className="eyebrow mb-2">why not 0% up front</div>
              <p className="text-sm text-ink-300 leading-relaxed">
                Because executors have gas costs and capital costs at{" "}
                <span className="mono text-ink-100">claim()</span>. A modest
                immediate payment pays for the attempt; the majority pays for
                the outcome.
              </p>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="3 · the delta guard"
          title="Whole-state reconciliation, not one metric."
        >
          <p className="max-w-2xl text-ink-300 mb-8">
            Fixing one metric by damaging another is the class of failure that
            hit Morpho for ~$36M in Aug 2026. STATEKEEP&apos;s predicate must
            reconcile the entire protected surface — headline and protected
            balances — before payment is ever dispatched.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before → After valid */}
            <div className="rounded-[var(--radius-4)] border border-success/40 bg-ink-900 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="mono text-[10px] tracking-widest text-success">
                  VALID RECOVERY
                </span>
                <span className="text-ink-500 mono text-[10px]">→ PAID</span>
              </div>
              <div className="mono text-sm">
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-border/60 text-ink-500 text-[11px]">
                  <span>surface</span>
                  <span>before</span>
                  <span>after</span>
                </div>
                {[
                  ["reserve", "$600k", "$820k", "up"],
                  ["user funds", "$1.2M", "$1.2M", "flat"],
                  ["debt", "$900k", "$850k", "down"],
                  ["fees", "$30k", "$31k", "flat"],
                ].map(([k, b, a, dir]) => (
                  <div
                    key={k}
                    className="grid grid-cols-3 gap-2 py-2 border-b border-border/40 last:border-b-0"
                  >
                    <span className="text-ink-400">{k}</span>
                    <span className="text-ink-300">{b}</span>
                    <span
                      className={
                        dir === "up"
                          ? "text-success"
                          : dir === "down"
                            ? "text-success"
                            : "text-ink-100"
                      }
                    >
                      {a}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-ink-400">
                Reserve up, principal unchanged, debt reduced. Every protected
                bound satisfied. Reward flows.
              </p>
            </div>

            {/* Before → After metric-swap attack */}
            <div className="rounded-[var(--radius-4)] border border-state-failed/40 bg-ink-900 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="mono text-[10px] tracking-widest text-state-failed">
                  METRIC-SWAP ATTACK
                </span>
                <span className="text-ink-500 mono text-[10px]">→ REJECTED</span>
              </div>
              <div className="mono text-sm">
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-border/60 text-ink-500 text-[11px]">
                  <span>surface</span>
                  <span>before</span>
                  <span>after</span>
                </div>
                {[
                  ["reserve", "$600k", "$820k", "up"],
                  ["user funds", "$1.2M", "$0.9M", "attack"],
                  ["debt", "$900k", "$900k", "flat"],
                  ["fees", "$30k", "$30k", "flat"],
                ].map(([k, b, a, dir]) => (
                  <div
                    key={k}
                    className="grid grid-cols-3 gap-2 py-2 border-b border-border/40 last:border-b-0"
                  >
                    <span className="text-ink-400">{k}</span>
                    <span className="text-ink-300">{b}</span>
                    <span
                      className={
                        dir === "attack"
                          ? "text-state-failed"
                          : dir === "up"
                            ? "text-success"
                            : "text-ink-100"
                      }
                    >
                      {a}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-ink-400">
                Reserve went up — but the reserve went up{" "}
                <em className="text-state-failed not-italic">by draining user principal</em>.
                Protected bound violated. Predicate returns false. No payment.
              </p>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="4 · the sealed rehearsal"
          title="Candidate recoveries can be tried against a copy of the exact current state, before they touch reality."
        >
          <div className="rounded-[var(--radius-4)] border border-border bg-ink-900 p-6">
            <pre className="mono text-[13px] leading-[1.9] text-ink-200 overflow-x-auto">
{`LIVE STATE
   │ seal
   ▼
REHEARSAL  ── candidate A / B / C ──> invariant checks
   │
   ▼
one proven transition
   │
   ▼
LIVE PROGRAM applies the delta   (the program keeps ownership throughout)`}
            </pre>
          </div>
          <p className="mt-6 max-w-2xl text-sm text-ink-300">
            The protocol&apos;s own program remains the sole authority that
            applies the resulting delta — no ownership transfer, no new
            runtime. The rehearsal is a private computation; the settlement is
            public.
          </p>
        </Section>

        <Section
          eyebrow="5 · the full state machine"
          title="Every legal transition. Every terminal state."
        >
          <StateMachineDiagram />
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-[var(--radius-4)] border border-border bg-ink-900 p-5">
              <div className="eyebrow mb-2">non-terminal</div>
              <div className="flex flex-wrap gap-2">
                <StateBadge name="OPEN" />
                <StateBadge name="CLAIMED" />
                <StateBadge name="PENDING" />
                <StateBadge name="MATURED" />
                <StateBadge name="FAILED" />
              </div>
            </div>
            <div className="rounded-[var(--radius-4)] border border-border bg-ink-900 p-5">
              <div className="eyebrow mb-2">absorbing (terminal)</div>
              <div className="flex flex-wrap gap-2">
                <StateBadge name="PAID" />
                <StateBadge name="SLASHED" />
                <StateBadge name="EXPIRED" />
              </div>
            </div>
            <div className="rounded-[var(--radius-4)] border border-border bg-ink-900 p-5">
              <div className="eyebrow mb-2">permissionless triggers</div>
              <ul className="text-ink-300 text-xs space-y-1 mono">
                <li>fund_market() · anyone</li>
                <li>finalize() · anyone</li>
                <li>slash() · anyone</li>
                <li>expire() · anyone</li>
              </ul>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section, Lines, Line } from "@/components/section";
import { StateBadge } from "@/components/state-badge";
import { StateMachineDiagram } from "@/components/state-machine-diagram";
import { HeroArtifact } from "@/components/hero-artifact";
import { HeroBackdrop } from "@/components/hero-backdrop";

export const metadata = {
  title: "How it works — STATEKEEP",
  description:
    "The recovery contract, the 25/75 durability split, the delta guard, whole-state reconciliation, sealed rehearsal, and the full state machine.",
};

export default function HowItWorks() {
  return (
    <>
      {/* HERO */}
      <section className="hero-ink">
        <HeroBackdrop />
        <Nav onInk />
        <div className="shell" style={{ paddingBlock: "clamp(96px, 12vw, 160px)" }}>
          <div className="max-w-3xl">
            <div className="micro micro-on-ink mb-6">
              <span className="micro-dot" />
              how it works
            </div>
            <h1
              className="display display-xl text-[#f4ecd4]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Lines>
                <Line>The recovery contract</Line>
                <Line italic accent>is the object.</Line>
              </Lines>
            </h1>
            <p className="mt-8 max-w-xl text-[16.5px] leading-[1.65] text-[#d8cfaf]">
              Not a job. Not a bounty. Not a keeper subscription. A protocol
              declares what &ldquo;healthy&rdquo; means and how it may be
              repaired. STATEKEEP evaluates the resulting state, holds through
              a durability window, and pays only what actually lasts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo" className="btn btn-amber">
                Try the predicate live
              </Link>
              <a
                href="https://github.com/STATEKEEP/statekeep/blob/main/README.md"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost-ink"
              >
                README ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 1. the recovery contract */}
      <Section
        index="01 ·"
        eyebrow="the recovery contract"
        title={
          <Lines>
            <Line>Five lines</Line>
            <Line italic>a protocol writes once.</Line>
          </Lines>
        }
        note={
          <>
            The separation is the whole design —{" "}
            <em className="not-italic text-[color:var(--ink)]">
              the protocol defines safety, the executor discovers execution,
              the chain decides settlement.
            </em>
          </>
        }
      >
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
          <HeroArtifact onInk={false} />
          <div className="space-y-4">
            <Aside eyebrow="what changes" body="You register safety, not activity. The protocol never hands ownership of live state to a keeper — the recovery capability is bounded, one-use, and consumed by the recovery that uses it." />
            <Aside eyebrow="what stays the same" body="Your program keeps ownership throughout. STATEKEEP evaluates transitions and dispatches payment; it never becomes the authority over your accounts." />
          </div>
        </div>
      </Section>

      {/* 2. the 25/75 split */}
      <Section
        fill="porcelain"
        index="02 ·"
        eyebrow="the 25 / 75 durability split"
        title={
          <Lines>
            <Line>Pay the attempt in part.</Line>
            <Line italic accent>Pay the outcome after it lasts.</Line>
          </Lines>
        }
      >
        <div className="card card-flush" style={{ background: "#fff" }}>
          <div className="p-6 md:p-8">
            <div className="micro mb-6">
              <span className="micro-dot" />
              reward split · timeline reads left to right
            </div>

            <div
              className="relative h-16 rounded-[var(--r-3)] overflow-hidden flex hairline"
              style={{ borderColor: "var(--hairline-2)" }}
            >
              <div
                className="w-1/4 flex items-center justify-center hairline"
                style={{
                  background: "color-mix(in oklab, var(--amber) 30%, #fff)",
                  borderColor: "transparent",
                }}
              >
                <span className="mono text-[12.5px] tracking-[0.05em] text-[color:var(--ink)]">
                  25% · immediate
                </span>
              </div>
              <div
                className="w-3/4 flex items-center justify-center hairline"
                style={{ background: "var(--porcelain)", borderColor: "transparent", borderLeft: "1px solid var(--hairline-2)" }}
              >
                <span className="mono text-[12.5px] tracking-[0.05em] text-[color:var(--slate-2)]">
                  75% · escrowed through durability window
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-[12.5px]">
              <TimelinePoint t="t = 0" tone="amber" note="claim() lands · predicate returned true · bond locked · 25% paid" badge="CLAIMED" />
              <TimelinePoint t="t < M" tone="slate" note="waiting for maturity · state must continue to hold · 75% escrowed" badge="PENDING" />
              <TimelinePoint t="t = M · ✓" tone="sage" note="finalize() · predicate re-checked · returned true · 75% released" badge="PAID" />
              <TimelinePoint t="t = M · ✗" tone="brick" note="finalize() · predicate false · 75% forfeited · slash() burns bond" badge="SLASHED" />
            </div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <Aside eyebrow="why not 100% up front" body="A state that is true for one block is not a durable repair. Prior-art keeper systems settle on the block containing the call. STATEKEEP holds a majority of the reward past the incident, so a fix that regresses does not get paid for the regression." />
          <Aside eyebrow="why not 0% up front" body="Executors have gas and capital costs at claim(). A modest immediate payment pays for the attempt; the majority pays for the outcome." />
        </div>
      </Section>

      {/* 3. delta guard */}
      <Section
        index="03 ·"
        eyebrow="the delta guard"
        title={
          <Lines>
            <Line>Whole-state reconciliation.</Line>
            <Line italic accent>Not one metric.</Line>
          </Lines>
        }
        note="Fixing one metric by damaging another is the class of failure that hit Morpho for ~$36M in Aug 2026. STATEKEEP's predicate reconciles the entire protected surface — headline and protected balances — before payment is ever dispatched."
      >
        <div className="grid md:grid-cols-2 gap-5">
          <DeltaCard
            good
            title="valid recovery"
            verdict="PAID"
            rows={[
              ["reserve",     "$600k", "$820k", "up"],
              ["user funds",  "$1.2M", "$1.2M", "flat"],
              ["debt",        "$900k", "$850k", "down"],
              ["fees",        "$30k",  "$31k",  "flat"],
            ]}
            note="Reserve up, principal unchanged, debt reduced. Every protected bound satisfied. Reward flows."
          />
          <DeltaCard
            good={false}
            title="metric-swap attack"
            verdict="REJECTED"
            rows={[
              ["reserve",     "$600k", "$820k", "up"],
              ["user funds",  "$1.2M", "$0.9M", "attack"],
              ["debt",        "$900k", "$900k", "flat"],
              ["fees",        "$30k",  "$30k",  "flat"],
            ]}
            note="Reserve went up — but the reserve went up by draining user principal. Protected bound violated. Predicate returns false. No payment."
          />
        </div>
      </Section>

      {/* 4. sealed rehearsal */}
      <Section
        fill="porcelain"
        index="04 ·"
        eyebrow="the sealed rehearsal"
        title={
          <Lines>
            <Line>Try candidates against a copy.</Line>
            <Line italic>Then touch reality — once.</Line>
          </Lines>
        }
      >
        <div className="grid md:grid-cols-[1fr_1fr] gap-6 items-start">
          <div className="card card-flush" style={{ background: "#fff" }}>
            <pre className="mono text-[13px] leading-[1.9] p-6 overflow-x-auto text-[color:var(--ink)]">
{`  LIVE STATE
     │ seal
     ▼
  REHEARSAL  ── candidate A / B / C ──▶ invariant checks
     │
     ▼
  one proven transition
     │
     ▼
  LIVE PROGRAM applies the delta
     (the program keeps ownership throughout)`}
            </pre>
          </div>
          <p className="text-[15px] leading-[1.7] text-[color:var(--slate-2)] max-w-md">
            The protocol&apos;s own program remains the sole authority that
            applies the resulting delta — no ownership transfer, no new
            runtime. The rehearsal is a private computation; the settlement is
            public.
          </p>
        </div>
      </Section>

      {/* 5. full state machine */}
      <Section
        index="05 ·"
        eyebrow="the full state machine"
        title={
          <Lines>
            <Line>Every legal transition.</Line>
            <Line italic accent>Every terminal state.</Line>
          </Lines>
        }
      >
        <div id="state-machine">
          <StateMachineDiagram />
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4 text-[13.5px]">
          <div className="card" style={{ background: "#fff" }}>
            <div className="micro mb-3"><span className="micro-dot" /> non-terminal</div>
            <div className="flex flex-wrap gap-2">
              <StateBadge name="OPEN" />
              <StateBadge name="CLAIMED" />
              <StateBadge name="PENDING" />
              <StateBadge name="MATURED" />
              <StateBadge name="FAILED" />
            </div>
          </div>
          <div className="card" style={{ background: "#fff" }}>
            <div className="micro mb-3"><span className="micro-dot" /> absorbing · terminal</div>
            <div className="flex flex-wrap gap-2">
              <StateBadge name="PAID" />
              <StateBadge name="SLASHED" />
              <StateBadge name="EXPIRED" />
            </div>
          </div>
          <div className="card" style={{ background: "#fff" }}>
            <div className="micro mb-3"><span className="micro-dot" /> permissionless triggers</div>
            <ul className="mono text-[12.5px] leading-[1.9] text-[color:var(--slate-2)]">
              <li>fund_market() · anyone</li>
              <li>finalize() · anyone</li>
              <li>slash() · anyone</li>
              <li>expire() · anyone</li>
            </ul>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}

function Aside({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <div className="card" style={{ background: "#fff" }}>
      <div className="micro mb-3">
        <span className="micro-dot" />
        {eyebrow}
      </div>
      <p className="text-[14.5px] leading-[1.65] text-[color:var(--slate-2)]">{body}</p>
    </div>
  );
}

function TimelinePoint({
  t,
  tone,
  note,
  badge,
}: {
  t: string;
  tone: "amber" | "slate" | "sage" | "brick";
  note: string;
  badge: React.ComponentProps<typeof StateBadge>["name"];
}) {
  const color =
    tone === "amber" ? "var(--amber-2)" :
    tone === "sage"  ? "var(--sage)" :
    tone === "brick" ? "var(--brick)" :
                       "var(--slate-2)";
  return (
    <div>
      <div className="mono text-[12px]" style={{ color }}>{t}</div>
      <div className="text-[color:var(--slate-2)] mt-1.5 leading-[1.6]">{note}</div>
      <div className="mt-3"><StateBadge name={badge} /></div>
    </div>
  );
}

function DeltaCard({
  good,
  title,
  verdict,
  rows,
  note,
}: {
  good: boolean;
  title: string;
  verdict: string;
  rows: [string, string, string, string][];
  note: string;
}) {
  const accent = good ? "var(--sage)" : "var(--brick)";
  return (
    <div
      className="card"
      style={{
        background: "#fff",
        borderColor: good ? "color-mix(in oklab, var(--sage) 35%, var(--hairline))" : "color-mix(in oklab, var(--brick) 35%, var(--hairline))",
      }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span
          className="mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: accent }}
        >
          {title}
        </span>
        <span className="text-[color:var(--slate)] mono text-[10px]">→ {verdict}</span>
      </div>
      <div className="mono text-[13px]">
        <div
          className="grid grid-cols-3 gap-2 pb-2 mono text-[10.5px] tracking-[0.14em] uppercase text-[color:var(--slate)]"
          style={{ borderBottom: "1px solid var(--hairline)" }}
        >
          <span>surface</span>
          <span>before</span>
          <span>after</span>
        </div>
        {rows.map(([k, b, a, dir]) => (
          <div
            key={k}
            className="grid grid-cols-3 gap-2 py-2 hairline-t"
            style={{ borderColor: "var(--hairline)" }}
          >
            <span className="text-[color:var(--slate)]">{k}</span>
            <span className="text-[color:var(--slate-2)]">{b}</span>
            <span
              style={{
                color:
                  dir === "attack" ? "var(--brick)" :
                  dir === "up"     ? "var(--sage)" :
                  dir === "down"   ? "var(--sage)" :
                                     "var(--ink)",
              }}
            >
              {a}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[13px] leading-[1.65] text-[color:var(--slate-2)]">{note}</p>
    </div>
  );
}

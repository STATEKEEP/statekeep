import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section, Lines, Line } from "@/components/section";
import { StateBadge } from "@/components/state-badge";
import { StateMachineDiagram } from "@/components/state-machine-diagram";
import { HeroArtifact } from "@/components/hero-artifact";
import { ProofBand } from "@/components/proof-band";
import { PredicateDemo } from "@/components/predicate-demo";

export default function Home() {
  return (
    <>
      {/* HERO — the inverted ink band, daybreak's signature move */}
      <section className="hero-ink">
        <Nav onInk />
        <div className="shell relative" style={{ paddingBlock: "clamp(120px, 14vw, 200px)" }}>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 lg:gap-24 items-start">
            <div>
              <div className="micro micro-on-ink mb-8 rise-in">
                <span
                  className="micro-dot soft-pulse"
                  style={{ boxShadow: "0 0 0 4px rgba(217,122,29,0.18)" }}
                />
                self-healing protocols · solana · anchor
              </div>

              <h1
                className="display display-xl rise-in-2 text-[#f4ecd4]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Lines>
                  <Line>Pay for the</Line>
                  <Line italic accent>
                    resulting state.
                  </Line>
                  <Line>Not for the call.</Line>
                </Lines>
              </h1>

              <p className="mt-10 max-w-xl text-[17px] leading-[1.65] text-[#d8cfaf] rise-in-3">
                A protocol declares what &ldquo;healthy&rdquo; means and how it may
                be repaired. Anyone can attempt a recovery. The chain decides
                settlement — held across a durability window, reconciled against
                the whole protected surface.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3 rise-in-4">
                <Link href="/how-it-works" className="btn btn-amber">
                  How it works
                  <ArrowUpRight />
                </Link>
                <Link href="/demo" className="btn btn-ghost-ink">
                  Try the predicate live
                  <ArrowRight />
                </Link>
              </div>

              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
                <TerminalChip name="OPEN" />
                <TerminalChip name="CLAIMED" />
                <TerminalChip name="PENDING" />
                <TerminalChip name="PAID" />
                <TerminalChip name="SLASHED" />
                <TerminalChip name="EXPIRED" />
              </div>
            </div>

            <div className="rise-in-3">
              <HeroArtifact onInk />
              <p className="mt-4 mono text-[10.5px] tracking-[0.22em] uppercase text-[#a89f83]">
                ↑ five lines a protocol writes once
              </p>
            </div>
          </div>
        </div>
      </section>

      <ProofBand />

      {/* CALL VS STATE — the distinction */}
      <Section
        index="01 ·"
        eyebrow="the distinction the design turns on"
        title={
          <Lines>
            <Line>Two ways to pay a keeper.</Line>
            <Line italic accent>Only one settles on truth.</Line>
          </Lines>
        }
      >
        <div className="grid md:grid-cols-2 gap-5">
          <ColumnCall />
          <ColumnState />
        </div>
      </Section>

      {/* STATE MACHINE — art-directed feature */}
      <Section
        fill="porcelain"
        index="02 ·"
        eyebrow="every market moves through exactly these states"
        title={
          <Lines>
            <Line>The state machine</Line>
            <Line italic>is the product.</Line>
          </Lines>
        }
        note={
          <>
            Eight states. Seven legal transitions. Three of them absorbing.
            Any account whose current state is not on this diagram is corrupt,
            and the program refuses to touch it. Enforced by explicit
            <code className="mono text-[color:var(--ink)] mx-1.5">require!</code>
            statements in the handler.
          </>
        }
      >
        <div id="state-machine">
          <StateMachineDiagram />
        </div>
      </Section>

      {/* LIVE PREDICATE — the signature interactive artifact */}
      <Section
        index="03 ·"
        eyebrow="the interactive artifact"
        title={
          <Lines>
            <Line>Drag the state.</Line>
            <Line italic accent>Watch the predicate.</Line>
          </Lines>
        }
        note="No live chain, no fake tx hashes — just the real predicate math running in your browser. Move the sliders; the composite AND flips on the same axes it flips on-chain."
      >
        <PredicateDemo />
      </Section>

      {/* DURABILITY WINDOW — the 25/75 timeline */}
      <Section
        fill="ink"
        index="04 ·"
        eyebrow="the durability window"
        title={
          <Lines>
            <Line>A recovery isn&apos;t paid in full</Line>
            <Line italic accent>because the state was true once.</Line>
          </Lines>
        }
        note={
          <span className="text-[#c9c1a5]">
            The reward splits. 25% pays for the attempt. 75% is escrowed
            through the durability window, released only if the predicate
            still holds when the window closes. Regression forfeits the
            deferred reward and slashes the bond.
          </span>
        }
      >
        <DurabilityTimeline />
      </Section>

      {/* THREE PARTIES */}
      <Section
        index="05 ·"
        eyebrow="the executor market"
        title={
          <Lines>
            <Line>No single trusted operator.</Line>
            <Line italic accent>Three roles. One object.</Line>
          </Lines>
        }
      >
        <div className="grid md:grid-cols-3 gap-4">
          <RoleCard
            eyebrow="the protocol"
            title="defines safety"
            body="Registers the recovery contract — the five lines above. Funds the reward vault. Never handed open admin authority."
          />
          <RoleCard
            eyebrow="any executor"
            title="discovers execution"
            body="Anyone may attempt a recovery — bond required. Rehearse against a sealed copy of state; apply the proven delta through the live program."
          />
          <RoleCard
            eyebrow="the chain"
            title="decides settlement"
            body="Evaluates the transition against current state, reconciles the protected surface, holds through the durability window, pays or slashes."
          />
        </div>
      </Section>

      {/* HONESTY TABLE */}
      <Section
        fill="porcelain"
        index="06 ·"
        eyebrow="what's real vs pending"
        title={
          <Lines>
            <Line>The honesty table.</Line>
          </Lines>
        }
        note="Nothing above is claimed as built. Every row is updated line by line as a capability becomes real and verifiable. This is the same table pinned in README.md."
      >
        <HonestyTable />
      </Section>

      {/* FAQ */}
      <Section
        index="07 ·"
        eyebrow="questions worth answering honestly"
        title={
          <Lines>
            <Line>Ask like an auditor.</Line>
          </Lines>
        }
      >
        <FAQ />
      </Section>

      {/* CTA ink band */}
      <section className="hero-ink" style={{ paddingBlock: "clamp(72px, 8vw, 104px)" }}>
        <div className="shell flex flex-wrap items-end justify-between gap-10">
          <div>
            <div className="micro micro-on-ink mb-4">
              <span className="micro-dot" />
              read the spec first
            </div>
            <h2
              className="display display-lg text-[#f4ecd4]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Lines>
                <Line>The mechanism is the argument.</Line>
                <Line italic accent>Everything else is receipts.</Line>
              </Lines>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/how-it-works" className="btn btn-amber">
              How it works
              <ArrowUpRight />
            </Link>
            <a
              href="https://github.com/STATEKEEP/statekeep"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost-ink"
            >
              github ↗
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ---------- Local sub-components ---------- */

function TerminalChip({ name }: { name: React.ComponentProps<typeof StateBadge>["name"] }) {
  return (
    <div className="inline-flex items-center gap-2">
      <StateBadge name={name} />
    </div>
  );
}

function ColumnCall() {
  return (
    <div className="card" style={{ background: "#fff" }}>
      <div className="flex items-center gap-3 mb-6">
        <span
          className="mono text-[10px] tracking-[0.2em] uppercase border rounded-[6px] px-2 py-0.5"
          style={{
            color: "var(--brick)",
            borderColor: "color-mix(in oklab, var(--brick) 40%, transparent)",
          }}
        >
          today
        </span>
        <span className="mono text-[11px] tracking-[0.14em] uppercase text-[color:var(--slate)]">
          pay for the call
        </span>
      </div>
      <ol className="mono text-[13px] leading-[1.9] mb-6 text-[color:var(--slate-2)]">
        <li>1 · CALL · bot invokes upkeep()</li>
        <li>2 · SUCCESS · function returned</li>
        <li>3 · PAY · reward disbursed</li>
      </ol>
      <ul className="space-y-2.5 text-[14px] text-[color:var(--slate-2)]">
        {[
          "Reward flows for activity, not outcomes",
          "Fixing one metric while breaking another goes unnoticed",
          "A one-block fix is paid as if it were durable",
          "One designated keeper — a single point of failure",
        ].map((t) => (
          <li key={t} className="flex gap-2.5">
            <span
              aria-hidden
              className="mt-2 h-1 w-3 shrink-0"
              style={{ background: "var(--brick)" }}
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ColumnState() {
  return (
    <div
      className="card relative overflow-hidden"
      style={{
        borderColor: "color-mix(in oklab, var(--amber) 40%, var(--hairline))",
        background:
          "linear-gradient(180deg, #fff 0%, color-mix(in oklab, var(--amber) 4%, #fff) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full"
        style={{ background: "color-mix(in oklab, var(--amber) 22%, transparent)", filter: "blur(48px)" }}
      />
      <div className="relative flex items-center gap-3 mb-6">
        <span
          className="mono text-[10px] tracking-[0.2em] uppercase border rounded-[6px] px-2 py-0.5"
          style={{
            color: "var(--amber-2)",
            background: "color-mix(in oklab, var(--amber) 10%, transparent)",
            borderColor: "color-mix(in oklab, var(--amber) 45%, transparent)",
          }}
        >
          statekeep
        </span>
        <span className="mono text-[11px] tracking-[0.14em] uppercase text-[color:var(--slate)]">
          pay for the result
        </span>
      </div>
      <ol className="relative mono text-[13px] leading-[1.9] mb-6 text-[color:var(--ink)]">
        <li>1 · STATE · condition breaks, capability opens</li>
        <li>2 · PROVE · valid transition applied, bond locked</li>
        <li>3 · PAY · only after the state <em className="not-italic text-[color:var(--amber-2)]">stays</em> valid</li>
      </ol>
      <ul className="relative space-y-2.5 text-[14px] text-[color:var(--slate-2)]">
        {[
          "Reward gated by evaluated on-chain state",
          "Whole-state reconciliation catches metric-swap attacks",
          "Durability window with bond & slash for regressions",
          "Anyone may attempt; the chain evaluates the result",
        ].map((t) => (
          <li key={t} className="flex gap-2.5">
            <span
              aria-hidden
              className="mt-2 h-1 w-3 shrink-0"
              style={{ background: "var(--amber)" }}
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DurabilityTimeline() {
  const rows = [
    { step: "claim()",   who: "executor",          note: "predicate = true · bond locked",       pay: "25% paid immediately",       badge: "CLAIMED" as const },
    { step: "pending",   who: "waiting for maturity", note: "state must continue to hold",         pay: "75% escrowed",                badge: "PENDING" as const },
    { step: "finalize()",who: "anyone",            note: "predicate re-checked at slot ≥ maturity", pay: "75% released — or forfeited", badge: "MATURED" as const },
    { step: "settled",   who: "chain settlement",  note: "durable → paid · regressed → slash()",  pay: "bond returned or confiscated", badge: "PAID" as const },
  ];
  return (
    <div>
      <div
        className="rounded-[var(--r-4)] overflow-hidden"
        style={{ background: "#0e0c08", border: "1px solid #2a2418" }}
      >
        <div className="grid md:grid-cols-4">
          {rows.map((r, i) => (
            <div
              key={i}
              className={
                "p-6 md:p-7 " +
                (i > 0 ? "border-t md:border-t-0 md:border-l" : "")
              }
              style={{ borderColor: "#2a2418" }}
            >
              <div className="mono text-[10px] tracking-[0.22em] uppercase text-[#a89f83] mb-4">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mono text-[14px] text-[color:var(--amber-glow)]">{r.step}</div>
              <div className="mono text-[11px] tracking-[0.14em] uppercase text-[#7a7362] mt-1 mb-5">
                {r.who}
              </div>
              <div className="text-[14px] text-[#e6dfc8] leading-relaxed">{r.note}</div>
              <div
                className="mt-4 pt-4 text-[12px] text-[#c9c1a5]"
                style={{ borderTop: "1px solid #241f14" }}
              >
                {r.pay}
              </div>
              <div className="mt-4">
                <StateBadge name={r.badge} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-5 rounded-[var(--r-3)] p-5 text-[14px] leading-relaxed"
        style={{
          background: "#100e08",
          border: "1px solid #2a2418",
          color: "#c9c1a5",
        }}
      >
        <span
          className="mono text-[10px] tracking-[0.22em] uppercase mr-2"
          style={{ color: "var(--amber-glow)" }}
        >
          invariant I3
        </span>
        The deferred reward is unreachable until the durability window closes.
        A durability failure ⇒ the deferred reward is forfeited plus the bond
        is slashed. This is a first-class phase with the executor&apos;s money
        at stake, so the incentive is to produce state that{" "}
        <em className="not-italic" style={{ color: "#f0e8cf" }}>lasts</em>.
      </div>
    </div>
  );
}

function RoleCard({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="card group hover:border-[color:var(--hairline-2)]" style={{ background: "#fff" }}>
      <div className="micro mb-3">
        <span className="micro-dot" />
        {eyebrow}
      </div>
      <div
        className="font-display text-[26px] font-semibold tracking-[-0.02em] leading-[1.1] mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </div>
      <p className="text-[14.5px] leading-[1.65] text-[color:var(--slate-2)]">{body}</p>
    </div>
  );
}

function HonestyTable() {
  const rows: [string, string][] = [
    ["Recovery contract design",             "Spec'd — pending implementation"],
    ["Bounded one-use recovery capability",  "Spec'd — pending implementation"],
    ["Whole-state reconciliation",           "Spec'd — pending implementation"],
    ["Durability window with bond/slash",    "Spec'd — pending implementation"],
    ["Sealed-state rehearsal",               "Spec'd — pending implementation"],
    ["Recovery capsules",                    "Spec'd — pending implementation"],
    ["Anchor program",                       "Pending — not built yet"],
    ["CLI + frontend",                       "In progress"],
    ["Deployment + real transactions",       "Pending — nothing deployed"],
    ["Adversarial test suite",               "Pending — not written"],
    ["Transaction receipts",                 "Pending — no hashes exist"],
  ];
  return (
    <div className="rounded-[var(--r-4)] overflow-hidden hairline" style={{ background: "#fff" }}>
      <div className="hairline-b" style={{ background: "var(--porcelain)" }}>
        <div className="grid grid-cols-[1fr_auto] px-5 py-3 mono text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--slate)]">
          <span>capability</span>
          <span>status</span>
        </div>
      </div>
      {rows.map(([cap, status], i) => {
        const pending = status.startsWith("Pending");
        const progress = status.startsWith("In");
        return (
          <div
            key={i}
            className="grid grid-cols-[1fr_auto] items-center px-5 py-3.5 hairline-t text-[14px]"
          >
            <span className="text-[color:var(--ink)]">{cap}</span>
            <span
              className="mono text-[11.5px] tracking-[0.06em]"
              style={{
                color: pending ? "var(--brick)" : progress ? "var(--amber-2)" : "var(--slate-2)",
              }}
            >
              {status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FAQ() {
  const items: [string, React.ReactNode][] = [
    [
      "Is anything deployed?",
      <>No. There is no live program, no mainnet address, no transaction receipts. The docs, the state machine, and the invariants exist and are pinned in the repo; the Anchor implementation is next.</>,
    ],
    [
      "Why not just use Chainlink Automation / Gelato / Keeper networks?",
      <>They settle on the call, not the state. A keeper can invoke an upkeep function on a useless path and still be paid; a one-block fix is paid for as if it were durable; whole-state reconciliation is not part of the payment gate. STATEKEEP&apos;s whole point is to move the settlement object from the call to the resulting state.</>,
    ],
    [
      "Doesn't the executor bond just centralise things by capital?",
      <>The bond is a slash surface, not a moat. Anyone may attempt a recovery; anyone may finalize; anyone may slash a failed one. The bond exists so the durability window has teeth — regression costs the executor, not the protocol.</>,
    ],
    [
      "How do you compare current state against a baseline without reading history?",
      <>You don&apos;t read history. The baseline is committed at registration; the program compares committed baseline to current state, and — where a rehearsal is used — against a sealed root the protocol committed. STATEKEEP never claims to read historical chain state.</>,
    ],
    [
      "What is a &lsquo;recovery capsule&rsquo;?",
      <>A recovery that has been proven valid and durable can be registered as a machine-recognised strategy for future incidents of the same shape. The protocol&apos;s ability to recover compounds instead of being relearned.</>,
    ],
  ];
  return (
    <div>
      {items.map(([q, a]) => (
        <details className="faq" key={q}>
          <summary>{q}</summary>
          <div className="faq-body">{a}</div>
        </details>
      ))}
    </div>
  );
}

/* ---------- inline icons (avoid lucide runtime disagreement) ---------- */

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

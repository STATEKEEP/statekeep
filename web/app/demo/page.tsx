import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section, Lines, Line } from "@/components/section";
import { PredicateDemo } from "@/components/predicate-demo";

export const metadata = {
  title: "Try the predicate — STATEKEEP",
  description:
    "Drag the sliders. Watch a composite AND predicate flip between PAY and REJECT on the same axes it flips on-chain. No live chain, no fabricated hashes — just the real predicate math.",
};

export default function DemoPage() {
  return (
    <>
      <section className="hero-ink">
        <Nav onInk />
        <div className="shell" style={{ paddingBlock: "clamp(96px, 12vw, 160px)" }}>
          <div className="max-w-3xl">
            <div className="micro micro-on-ink mb-6">
              <span className="micro-dot" />
              interactive · runs locally
            </div>
            <h1
              className="display display-xl text-[#f4ecd4]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Lines>
                <Line>The predicate</Line>
                <Line italic accent>is the argument.</Line>
              </Lines>
            </h1>
            <p className="mt-8 max-w-xl text-[16.5px] leading-[1.65] text-[#d8cfaf]">
              Move the sliders below. Watch a composite AND — the exact shape
              specified in{" "}
              <code className="mono text-[#f4ecd4]">docs/INVARIANTS.md</code>{" "}
              — flip between PAY and REJECT on the same axes it flips on-chain.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/how-it-works" className="btn btn-amber">
                How it works
              </Link>
              <Link href="/" className="btn btn-ghost-ink">
                ← back
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <PredicateDemo />

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <Aside
            eyebrow="what this is"
            body="A local simulator of the same predicate the on-chain program would evaluate. The composite is: reserve ratio meets the threshold AND the protected principal is not sacrificed AND the debt bound is respected. All three must hold; that is the definition of a valid recovery."
          />
          <Aside
            eyebrow="what this is not"
            body="Not a live chain read. Not a real market. There is no deployed program yet — this demo makes the mechanism inspectable now, so the argument doesn't wait on shipment. When the program lands, this same predicate is what evaluates."
          />
        </div>
      </Section>

      <Section fill="porcelain" eyebrow="the metric-swap attack" title={
        <Lines>
          <Line>Try to break it.</Line>
          <Line italic accent>Push reserve up by draining principal.</Line>
        </Lines>
      } note="Set reserve ratio to 83%. Drop user principal to $1.05M. The headline metric now passes. The whole-state predicate still returns REJECT. That is the whole point.">
        <div className="rounded-[var(--r-4)] hairline p-6 md:p-8" style={{ background: "#fff" }}>
          <pre className="mono text-[13px] leading-[1.9] overflow-x-auto text-[color:var(--ink)]">
{`# what a naive keeper would do
if reserve_ratio >= 80% { pay() }        # ⇒ paid every time, even after theft

# what STATEKEEP evaluates
if reserve_ratio  >= 80%
∧ user_principal >= baseline            # protected surface
∧ debt           <= baseline            # protected surface
{ pay() } else { reject() }              # ⇒ metric-swap fails the predicate`}
          </pre>
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

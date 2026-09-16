import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section, Lines, Line } from "@/components/section";

export const metadata = {
  title: "Docs — STATEKEEP",
  description: "The spec is the product. Thesis, attacks, invariants, threat model, why-not, state machine, economics, MEV — pinned in the repo.",
};

type Doc = { slug: string; title: string; desc: string; file: string; group: string };

const DOCS: Doc[] = [
  { group: "argument",  slug: "thesis",         title: "THESIS.md",              desc: "The one-argument case: settle on the result, not the action.",         file: "THESIS.md" },
  { group: "argument",  slug: "readme",         title: "README.md",              desc: "The full picture — problem, mechanism, honesty table.",                 file: "README.md" },
  { group: "argument",  slug: "attacks",        title: "ATTACKS.md",             desc: "Every prior-art attack, and the mechanism that closes each.",           file: "ATTACKS.md" },

  { group: "mechanism", slug: "invariants",     title: "docs/INVARIANTS.md",     desc: "The eight invariants the program has to satisfy.",                       file: "docs/INVARIANTS.md" },
  { group: "mechanism", slug: "state-machine",  title: "docs/state-machine.md",  desc: "8 states · 7 legal transitions · 3 absorbing.",                          file: "docs/state-machine.md" },
  { group: "mechanism", slug: "threat-model",   title: "docs/THREAT_MODEL.md",   desc: "Actors, capabilities, assumptions, remaining risk.",                     file: "docs/THREAT_MODEL.md" },

  { group: "reasoning", slug: "why-not",        title: "docs/WHY_NOT.md",        desc: "Why existing keeper/bounty/intent stacks do not solve this.",            file: "docs/WHY_NOT.md" },
  { group: "reasoning", slug: "economics",      title: "docs/economics.md",      desc: "Reward pricing, bond sizing, the 25/75 split, executor collusion.",     file: "docs/economics.md" },
  { group: "reasoning", slug: "mev",            title: "docs/mev.md",            desc: "MEV posture: first-valid-wins claim, durability tail, sandwiching.",     file: "docs/mev.md" },
];

const GROUPS: { key: string; title: string; note: string }[] = [
  { key: "argument",  title: "the argument",  note: "read these three first — they define the object" },
  { key: "mechanism", title: "the mechanism", note: "the on-chain surface, formally" },
  { key: "reasoning", title: "the reasoning", note: "why the mechanism is shaped this way, not another" },
];

function tryReadRepoRoot(): string | null {
  const candidates = [
    path.resolve(process.cwd(), ".."),
    process.cwd(),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, "README.md"))) return c;
  }
  return null;
}
function docExists(root: string | null, file: string): boolean {
  if (!root) return false;
  try { return fs.existsSync(path.join(root, file)); } catch { return false; }
}

export default function DocsIndex() {
  const root = tryReadRepoRoot();
  return (
    <>
      <section className="hero-ink">
        <Nav onInk />
        <div className="shell" style={{ paddingBlock: "clamp(96px, 12vw, 160px)" }}>
          <div className="max-w-3xl">
            <div className="micro micro-on-ink mb-6">
              <span className="micro-dot" />
              documentation
            </div>
            <h1
              className="display display-xl text-[#f4ecd4]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Lines>
                <Line>The spec</Line>
                <Line italic accent>is the product.</Line>
              </Lines>
            </h1>
            <p className="mt-8 max-w-xl text-[16.5px] leading-[1.65] text-[#d8cfaf]">
              Every file below is pinned in the repository. Nothing here is
              summarised — click through to the source of truth. If a file
              shows PUBLISHING SHORTLY, it exists in the plan but not on disk
              yet.
            </p>
          </div>
        </div>
      </section>

      {GROUPS.map((g, gi) => (
        <Section
          key={g.key}
          fill={gi % 2 === 0 ? "paper" : "porcelain"}
          index={`0${gi + 1} ·`}
          eyebrow={g.title}
          title={<Lines><Line>{g.note}</Line></Lines>}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCS.filter((d) => d.group === g.key).map((d) => {
              const present = docExists(root, d.file);
              return (
                <div
                  key={d.slug}
                  className="card group"
                  style={{
                    background: "#fff",
                    borderColor: present ? "var(--hairline)" : "color-mix(in oklab, var(--brick) 15%, var(--hairline))",
                  }}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="mono text-[13px] text-[color:var(--ink)]">{d.title}</span>
                    <span
                      className="mono text-[9.5px] tracking-[0.22em] uppercase"
                      style={{ color: present ? "var(--sage)" : "var(--brick)" }}
                    >
                      {present ? "pinned" : "shortly"}
                    </span>
                  </div>
                  <p className="text-[13.5px] leading-[1.6] text-[color:var(--slate-2)] mb-5">
                    {d.desc}
                  </p>
                  {present ? (
                    <div className="flex items-center gap-4 text-[12px]">
                      <a
                        href={`https://github.com/STATEKEEP/statekeep/blob/main/${d.file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-link"
                      >
                        view on github →
                      </a>
                      <a
                        href={`https://raw.githubusercontent.com/STATEKEEP/statekeep/main/${d.file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mono text-[10.5px] tracking-[0.18em] uppercase text-[color:var(--slate)] hover:text-[color:var(--ink)]"
                      >
                        raw
                      </a>
                    </div>
                  ) : (
                    <div className="mono text-[11px] text-[color:var(--slate)]">
                      not yet on disk — will appear when committed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      ))}

      <Section>
        <div className="rounded-[var(--r-4)] hairline p-6 md:p-8" style={{ background: "#fff" }}>
          <div className="micro mb-3"><span className="micro-dot" /> read next</div>
          <div className="flex flex-wrap gap-6 text-[15px]">
            <Link href="/how-it-works" className="text-link">→ How it works</Link>
            <Link href="/demo" className="text-link">→ Try the predicate</Link>
            <Link href="/" className="text-[color:var(--slate-2)] hover:text-[color:var(--ink)]">→ Home</Link>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}

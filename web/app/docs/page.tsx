import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section } from "@/components/section";

export const metadata = {
  title: "Docs — STATEKEEP",
  description: "The spec: thesis, attacks, invariants, threat model, why-not, state machine, economics, MEV.",
};

// Repo root relative to web/. Docs live in the parent repo (or backend agent's tree).
// We read at build time. If a doc is missing, we render an honest placeholder — never fabricate.

type Doc = {
  slug: string;
  title: string;
  desc: string;
  file: string;
};

const DOCS: Doc[] = [
  { slug: "thesis", title: "THESIS.md", desc: "The one-argument case: settle on the result, not the action.", file: "THESIS.md" },
  { slug: "readme", title: "README.md", desc: "The full picture — problem, mechanism, honesty table.", file: "README.md" },
  { slug: "attacks", title: "ATTACKS.md", desc: "The concrete attacks against design ancestors, and the mechanism that closes each.", file: "ATTACKS.md" },
  { slug: "invariants", title: "docs/INVARIANTS.md", desc: "The eight invariants the code has to satisfy.", file: "docs/INVARIANTS.md" },
  { slug: "threat-model", title: "docs/THREAT_MODEL.md", desc: "Actors, capabilities, assumptions.", file: "docs/THREAT_MODEL.md" },
  { slug: "why-not", title: "docs/WHY_NOT.md", desc: "Why this problem is not solved by existing keeper/bounty/intent stacks.", file: "docs/WHY_NOT.md" },
  { slug: "state-machine", title: "docs/state-machine.md", desc: "8 states, 7 legal transitions, 3 terminal.", file: "docs/state-machine.md" },
  { slug: "economics", title: "docs/economics.md", desc: "Reward pricing, bond sizing, the 25/75 split.", file: "docs/economics.md" },
  { slug: "mev", title: "docs/mev.md", desc: "MEV posture: first-valid-wins claim, durability tail.", file: "docs/mev.md" },
];

function tryReadRepoRoot(): string | null {
  // Two candidate roots: the worktree parent, and the sibling monorepo.
  // web/ sits inside the repo root during dev; the docs live at repo root.
  const candidates = [
    path.resolve(process.cwd(), ".."),        // when run from web/
    process.cwd(),                            // when run from repo root
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, "README.md"))) return c;
  }
  return null;
}

function docExists(root: string | null, file: string): boolean {
  if (!root) return false;
  try {
    return fs.existsSync(path.join(root, file));
  } catch {
    return false;
  }
}

export default function DocsIndex() {
  const root = tryReadRepoRoot();
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24 relative">
            <div className="eyebrow mb-4">documentation</div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-050 max-w-3xl">
              The spec is the product.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ink-300">
              Every file below is pinned in the repository. Content is not
              summarised or paraphrased here — click through to GitHub for the
              source of truth.
            </p>
          </div>
        </section>

        <Section eyebrow="index" title="Files">
          <div className="grid md:grid-cols-2 gap-4">
            {DOCS.map((d) => {
              const present = docExists(root, d.file);
              return (
                <div
                  key={d.slug}
                  className={
                    "rounded-[var(--radius-4)] border p-5 transition-colors " +
                    (present
                      ? "border-border bg-ink-900 hover:border-amber-600/40"
                      : "border-border/60 bg-ink-950 hover:border-border")
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="mono text-sm text-ink-100">{d.title}</span>
                    <span
                      className={
                        "mono text-[10px] tracking-widest " +
                        (present ? "text-success" : "text-state-failed")
                      }
                    >
                      {present ? "PINNED" : "PUBLISHING SHORTLY"}
                    </span>
                  </div>
                  <p className="text-sm text-ink-400 mb-4">{d.desc}</p>
                  {present ? (
                    <div className="flex items-center gap-4 text-xs">
                      <a
                        href={`https://github.com/STATEKEEP/statekeep/blob/main/${d.file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-500 mono tracking-widest"
                      >
                        VIEW ON GITHUB →
                      </a>
                      <a
                        href={`https://raw.githubusercontent.com/STATEKEEP/statekeep/main/${d.file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ink-500 hover:text-ink-200 mono tracking-widest"
                      >
                        RAW
                      </a>
                    </div>
                  ) : (
                    <div className="mono text-[11px] text-ink-500">
                      not yet on disk in this build — will appear when the backend agent commits it
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-[var(--radius-4)] border border-border bg-ink-900 p-6">
            <div className="eyebrow mb-2">read next</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/how-it-works" className="text-amber-400 hover:text-amber-500">
                → How it works
              </Link>
              <Link href="/" className="text-ink-300 hover:text-ink-050">
                → Home
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

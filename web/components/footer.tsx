import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="hairline-t"
      style={{ paddingBlock: "clamp(48px, 6vw, 76px) 32px", background: "var(--paper)" }}
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div
              className="display display-md"
              style={{ fontFamily: "var(--font-display)" }}
            >
              STATEKEEP
            </div>
            <p className="mt-3 max-w-sm text-[14px] text-[color:var(--slate-2)] leading-relaxed">
              Protocols become self-healing without trusting the healer. Pay
              for the resulting state, not for the call that produced it.
            </p>
            <div className="mt-5 inline-flex items-center gap-2.5 micro">
              <span
                className="h-2 w-2 rounded-full soft-pulse"
                style={{ background: "var(--amber)" }}
                aria-hidden
              />
              <span>pre-deployment · nothing live yet</span>
            </div>
          </div>

          <FooterCol
            title="Read"
            links={[
              { label: "Thesis", href: "https://github.com/STATEKEEP/statekeep/blob/main/THESIS.md", ext: true },
              { label: "Attacks", href: "https://github.com/STATEKEEP/statekeep/blob/main/ATTACKS.md", ext: true },
              { label: "Invariants", href: "https://github.com/STATEKEEP/statekeep/blob/main/docs/INVARIANTS.md", ext: true },
              { label: "Threat model", href: "https://github.com/STATEKEEP/statekeep/blob/main/docs/THREAT_MODEL.md", ext: true },
            ]}
          />

          <FooterCol
            title="Explore"
            links={[
              { label: "How it works", href: "/how-it-works" },
              { label: "Try the predicate", href: "/demo" },
              { label: "Docs index", href: "/docs" },
              { label: "State machine", href: "/how-it-works#state-machine" },
            ]}
          />

          <FooterCol
            title="Ship"
            links={[
              { label: "GitHub", href: "https://github.com/STATEKEEP/statekeep", ext: true },
              { label: "README", href: "https://github.com/STATEKEEP/statekeep/blob/main/README.md", ext: true },
              { label: "License · MIT", href: "https://github.com/STATEKEEP/statekeep/blob/main/LICENSE", ext: true },
            ]}
          />
        </div>

        <div
          className="mt-16 pt-6 hairline-t flex flex-wrap items-center justify-between gap-4 mono text-[11px]"
          style={{ color: "var(--slate)" }}
        >
          <span>© {new Date().getFullYear()} STATEKEEP · MIT · built for Solana</span>
          <span className="tracking-[0.18em] uppercase">
            settle on the result — not on the call
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; ext?: boolean }[];
}) {
  return (
    <div>
      <div className="micro" style={{ color: "var(--ink)" }}>{title}</div>
      <ul className="mt-4 space-y-2.5 text-[14px]">
        {links.map((l) => (
          <li key={l.label}>
            {l.ext ? (
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--slate-2)] hover:text-[color:var(--amber-2)] transition-colors"
              >
                {l.label} <span className="text-[color:var(--slate)]">↗</span>
              </a>
            ) : (
              <Link
                href={l.href}
                className="text-[color:var(--slate-2)] hover:text-[color:var(--amber-2)] transition-colors"
              >
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

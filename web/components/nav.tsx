import Link from "next/link";

export function Nav({ onInk = false }: { onInk?: boolean }) {
  const linkClass = onInk
    ? "text-[#d8cfaf] hover:text-white transition-colors"
    : "text-[color:var(--slate-2)] hover:text-[color:var(--ink)] transition-colors";
  return (
    <header className="absolute top-0 inset-x-0 z-40">
      <div className="shell flex h-20 items-center justify-between">
        <Link href="/" className="inline-flex items-baseline gap-2.5">
          <span
            className={
              "font-display font-bold tracking-[-0.04em] text-[22px] " +
              (onInk ? "text-white" : "text-[color:var(--ink)]")
            }
            style={{ fontFamily: "var(--font-display)" }}
          >
            STATEKEEP
          </span>
          <span
            className={
              "mono text-[10px] tracking-[0.22em] uppercase " +
              (onInk ? "text-[#c9c1a5]" : "text-[color:var(--slate)]")
            }
          >
            v0
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium">
          <Link href="/how-it-works" className={linkClass}>How it works</Link>
          <Link href="/demo" className={linkClass}>Try the predicate</Link>
          <Link href="/docs" className={linkClass}>Docs</Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/STATEKEEP/statekeep"
            target="_blank"
            rel="noreferrer"
            className={
              "hidden sm:inline-flex items-center gap-2 rounded-full border px-3.5 h-9 text-[12px] font-medium transition-colors " +
              (onInk
                ? "border-white/25 text-white hover:bg-white/8"
                : "border-[color:var(--hairline-2)] text-[color:var(--ink)] hover:bg-[color:var(--porcelain)]")
            }
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--amber)" }}
              aria-hidden
            />
            <span className="mono text-[10px] tracking-[0.18em] uppercase">
              src
            </span>
            <span>github</span>
          </a>
        </div>
      </div>
    </header>
  );
}

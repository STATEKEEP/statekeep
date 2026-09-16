import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="mono text-sm tracking-widest text-ink-050 hover:text-amber-400 transition-colors"
        >
          STATEKEEP
          <span className="ml-2 text-ink-500">/</span>
          <span className="ml-2 text-ink-400">pay for reality</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/how-it-works"
            className="text-ink-300 hover:text-ink-050 transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/docs"
            className="text-ink-300 hover:text-ink-050 transition-colors"
          >
            Docs
          </Link>
          <a
            href="https://github.com/STATEKEEP/statekeep"
            target="_blank"
            rel="noreferrer"
            className="mono text-xs tracking-wider text-ink-400 hover:text-amber-400 transition-colors"
          >
            GITHUB &rarr;
          </a>
        </nav>
      </div>
    </header>
  );
}

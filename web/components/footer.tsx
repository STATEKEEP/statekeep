export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
        <div className="mono text-ink-400">
          STATEKEEP <span className="text-ink-600">·</span> MIT{" "}
          <span className="text-ink-600">·</span> built for Solana
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/STATEKEEP/statekeep"
            target="_blank"
            rel="noreferrer"
            className="text-ink-300 hover:text-amber-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/STATEKEEP/statekeep/blob/main/THESIS.md"
            target="_blank"
            rel="noreferrer"
            className="text-ink-300 hover:text-amber-400 transition-colors"
          >
            Thesis
          </a>
          <a
            href="https://github.com/STATEKEEP/statekeep/blob/main/README.md"
            target="_blank"
            rel="noreferrer"
            className="text-ink-300 hover:text-amber-400 transition-colors"
          >
            README
          </a>
        </div>
      </div>
    </footer>
  );
}

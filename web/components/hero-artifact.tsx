/**
 * The recovery-contract spec artifact — the thing a protocol actually
 * registers. Rendered as a real registered document, with hairline rows.
 * Reference lines match README.md verbatim.
 */

import { cn } from "@/lib/cn";

const ROWS: [string, React.ReactNode][] = [
  ["health condition",     <span key="h" className="text-[color:var(--amber-glow)]">reserve_ratio &gt;= 80%</span>],
  ["allowed recovery",     <>withdraw insurance <Sep /> rebalance pool <Sep /> repay debt</>],
  ["protected state",      <>user principal unchanged <Sep /> debt &lt;= baseline</>],
  ["recovery reward",      <span className="text-[color:var(--amber-glow)]">as registered by the protocol</span>],
  ["durability window",    <>M slots · settlement re-evaluates the predicate</>],
];

function Sep() {
  return <span className="text-[color:#5a5140] px-2">·</span>;
}

export function HeroArtifact({ onInk = true }: { onInk?: boolean }) {
  return (
    <div className={cn("spec-artifact", onInk && "on-ink")}>
      <div className="spec-header">
        <div
          className="mono text-[10.5px] tracking-[0.22em] uppercase"
          style={{ color: onInk ? "#a89f83" : "var(--slate)" }}
        >
          <span
            className="inline-block mr-2 h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--amber)" }}
          />
          recovery contract · v1 · registered by a protocol
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: onInk ? "#2a2418" : "var(--hairline-2)" }}
          />
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: onInk ? "#2a2418" : "var(--hairline-2)" }}
          />
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--amber)" }}
          />
        </div>
      </div>

      {ROWS.map(([label, value]) => (
        <div key={label} className="spec-row">
          <div className="spec-row-label">{label}</div>
          <div className="spec-row-value">{value}</div>
        </div>
      ))}

      <div
        className="px-[18px] py-3 hairline-t text-[12px] leading-relaxed"
        style={{
          borderColor: onInk ? "#2a2418" : "var(--hairline)",
          color: onInk ? "#c9c1a5" : "var(--slate-2)",
          background: onInk ? "#100e08" : "var(--paper)",
        }}
      >
        <span
          className="mono text-[10px] tracking-[0.2em] uppercase mr-2"
          style={{ color: onInk ? "#a89f83" : "var(--slate)" }}
        >
          note
        </span>
        Nothing arbitrary. The protocol pre-authorises the{" "}
        <em
          className="not-italic"
          style={{ color: onInk ? "#f0e8cf" : "var(--ink)" }}
        >
          shape
        </em>{" "}
        of a valid recovery. Nobody is ever handed open admin authority over
        live state.
      </div>
    </div>
  );
}

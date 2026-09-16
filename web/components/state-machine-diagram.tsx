/**
 * Rendered from docs/state-machine.md.
 * Every node and edge here corresponds to a real state / transition in the program spec.
 * Do not add nodes that aren't in the spec.
 */
import { StateBadge, type StateName } from "./state-badge";

type Node = { s: StateName; x: number; y: number; note?: string };
type Edge = { from: StateName; to: StateName; label: string; curve?: number };

const NODES: Node[] = [
  { s: "OPEN", x: 400, y: 40, note: "market funded" },
  { s: "CLAIMED", x: 400, y: 140, note: "25% paid · bond locked" },
  { s: "PENDING", x: 400, y: 240, note: "durability window" },
  { s: "MATURED", x: 240, y: 340, note: "predicate = true" },
  { s: "FAILED", x: 560, y: 340, note: "predicate = false" },
  { s: "PAID", x: 240, y: 440, note: "terminal" },
  { s: "SLASHED", x: 560, y: 440, note: "terminal" },
  { s: "EXPIRED", x: 60, y: 140, note: "terminal · refund" },
];

const EDGES: Edge[] = [
  { from: "OPEN", to: "CLAIMED", label: "claim()" },
  { from: "CLAIMED", to: "PENDING", label: "atomic" },
  { from: "PENDING", to: "MATURED", label: "finalize() ✓" },
  { from: "PENDING", to: "FAILED", label: "finalize() ✗" },
  { from: "MATURED", to: "PAID", label: "atomic" },
  { from: "FAILED", to: "SLASHED", label: "slash()" },
  { from: "OPEN", to: "EXPIRED", label: "expire()" },
];

const NODE_W = 128;
const NODE_H = 42;

function pos(s: StateName) {
  const n = NODES.find((n) => n.s === s)!;
  return { cx: n.x + NODE_W / 2, cy: n.y + NODE_H / 2 };
}

export function StateMachineDiagram() {
  return (
    <div className="relative rounded-[var(--radius-4)] border border-border bg-ink-900 p-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="eyebrow">state machine</div>
          <div className="mono text-[10px] text-ink-500">
            8 states · 7 legal transitions · 3 terminal
          </div>
        </div>
        <svg
          viewBox="0 0 720 510"
          className="w-full h-auto"
          role="img"
          aria-label="STATEKEEP state machine: OPEN transitions to CLAIMED via claim(), then atomically to PENDING; PENDING transitions to MATURED (predicate true) then PAID, or to FAILED (predicate false) then SLASHED; OPEN transitions to EXPIRED via expire()."
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--ink-500)" />
            </marker>
            <marker
              id="arrow-amber"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--amber-500)" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map((e, i) => {
            const a = pos(e.from);
            const b = pos(e.to);
            const isAtomic = e.label === "atomic";
            const stroke = isAtomic ? "var(--amber-500)" : "var(--ink-600)";
            const marker = isAtomic ? "url(#arrow-amber)" : "url(#arrow)";

            // Straight vertical/diagonal path
            const dx = b.cx - a.cx;
            const dy = b.cy - a.cy;
            const len = Math.sqrt(dx * dx + dy * dy);
            // Trim start/end from node border
            const trim = 24;
            const ux = dx / len;
            const uy = dy / len;
            const x1 = a.cx + ux * trim;
            const y1 = a.cy + uy * trim;
            const x2 = b.cx - ux * trim;
            const y2 = b.cy - uy * trim;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={stroke}
                  strokeWidth={1.2}
                  strokeDasharray={isAtomic ? "3 3" : undefined}
                  markerEnd={marker}
                />
                <text
                  x={midX + (Math.abs(dx) > 40 ? 0 : 8)}
                  y={midY - 4}
                  fill="var(--ink-300)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                >
                  {e.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((n) => (
            <g key={n.s} transform={`translate(${n.x}, ${n.y})`}>
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={6}
                ry={6}
                fill="var(--ink-850)"
                stroke={
                  n.s === "PAID" || n.s === "SLASHED" || n.s === "EXPIRED"
                    ? "var(--ink-600)"
                    : n.s === "FAILED"
                      ? "var(--state-failed)"
                      : n.s === "MATURED" || n.s === "CLAIMED" || n.s === "PENDING"
                        ? "var(--amber-600)"
                        : "var(--ink-700)"
                }
                strokeWidth={1}
              />
              <text
                x={NODE_W / 2}
                y={17}
                textAnchor="middle"
                fill={
                  n.s === "PAID"
                    ? "var(--state-paid)"
                    : n.s === "FAILED"
                      ? "var(--state-failed)"
                      : n.s === "SLASHED"
                        ? "var(--state-slashed)"
                        : n.s === "MATURED"
                          ? "var(--state-matured)"
                          : n.s === "CLAIMED" || n.s === "PENDING"
                            ? "var(--amber-400)"
                            : "var(--ink-200)"
                }
                fontSize="11"
                fontFamily="var(--font-mono)"
                letterSpacing="0.14em"
              >
                {n.s}
              </text>
              {n.note && (
                <text
                  x={NODE_W / 2}
                  y={33}
                  textAnchor="middle"
                  fill="var(--ink-500)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  {n.note}
                </text>
              )}
            </g>
          ))}
        </svg>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-ink-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-ink-600" />
            <span>observable transition</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-6 h-px"
              style={{
                background:
                  "repeating-linear-gradient(to right, var(--amber-500) 0 3px, transparent 3px 6px)",
              }}
            />
            <span>atomic (same tx)</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <StateBadge name="PAID" />
            <StateBadge name="SLASHED" />
            <StateBadge name="EXPIRED" />
            <span>terminal · absorbing</span>
          </div>
        </div>
      </div>
    </div>
  );
}

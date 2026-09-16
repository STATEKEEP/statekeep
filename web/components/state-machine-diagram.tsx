/**
 * The state machine as an art-directed feature.
 *
 * Every node and edge corresponds to a real state / transition in
 * docs/state-machine.md. Do not add nodes that aren't in the spec.
 *
 * Design notes:
 *   - Terminal states (PAID / SLASHED / EXPIRED) are filled and prominent —
 *     they are the resting places of money.
 *   - Non-terminal states are outlined — they are transitional.
 *   - Atomic edges are dashed & animated ("edge-flow") — they happen inside
 *     the same tx and carry semantic weight.
 *   - Observable edges are solid. Both flow amber.
 *   - The whole diagram is rendered in a `card` on porcelain, sized large.
 */
import { StateBadge, type StateName } from "./state-badge";

type Node = {
  s: StateName;
  x: number;
  y: number;
  note?: string;
  terminal?: boolean;
  branch?: "good" | "bad" | "neutral";
};
type Edge = {
  from: StateName;
  to: StateName;
  label: string;
  kind?: "observable" | "atomic";
};

const NODES: Node[] = [
  { s: "OPEN",     x:  40, y:  30, note: "market funded",         branch: "neutral" },
  { s: "CLAIMED",  x: 320, y:  30, note: "25% paid · bond locked", branch: "neutral" },
  { s: "PENDING",  x: 600, y:  30, note: "durability window",     branch: "neutral" },
  { s: "MATURED",  x: 460, y: 180, note: "predicate = true",      branch: "good" },
  { s: "FAILED",   x: 740, y: 180, note: "predicate = false",     branch: "bad" },
  { s: "PAID",     x: 460, y: 320, note: "terminal · money moves",terminal: true, branch: "good" },
  { s: "SLASHED",  x: 740, y: 320, note: "terminal · bond gone",  terminal: true, branch: "bad" },
  { s: "EXPIRED",  x:  40, y: 180, note: "terminal · refund",     terminal: true, branch: "neutral" },
];

const EDGES: Edge[] = [
  { from: "OPEN",    to: "CLAIMED", label: "claim()",       kind: "observable" },
  { from: "CLAIMED", to: "PENDING", label: "atomic",        kind: "atomic" },
  { from: "PENDING", to: "MATURED", label: "finalize() ✓",  kind: "observable" },
  { from: "PENDING", to: "FAILED",  label: "finalize() ✗",  kind: "observable" },
  { from: "MATURED", to: "PAID",    label: "atomic",        kind: "atomic" },
  { from: "FAILED",  to: "SLASHED", label: "slash()",       kind: "observable" },
  { from: "OPEN",    to: "EXPIRED", label: "expire()",      kind: "observable" },
];

const NODE_W = 172;
const NODE_H = 60;

function center(s: StateName) {
  const n = NODES.find((n) => n.s === s)!;
  return { cx: n.x + NODE_W / 2, cy: n.y + NODE_H / 2 };
}

function nodeStroke(n: Node) {
  if (n.terminal && n.branch === "good") return "var(--st-paid)";
  if (n.terminal && n.branch === "bad")  return "var(--st-slashed)";
  if (n.terminal)                        return "var(--st-expired)";
  if (n.branch === "good") return "var(--sage)";
  if (n.branch === "bad")  return "var(--brick)";
  return "var(--hairline-2)";
}
function nodeFill(n: Node) {
  if (n.terminal && n.branch === "good") return "var(--st-paid)";
  if (n.terminal && n.branch === "bad")  return "var(--st-slashed)";
  if (n.terminal)                        return "var(--st-expired)";
  return "#ffffff";
}
function nodeLabelColor(n: Node) {
  if (n.terminal) return "#f4ecd4";
  if (n.branch === "good") return "var(--sage)";
  if (n.branch === "bad")  return "var(--brick)";
  return "var(--ink)";
}
function nodeNoteColor(n: Node) {
  if (n.terminal) return "rgba(244, 236, 212, 0.75)";
  return "var(--slate)";
}

export function StateMachineDiagram() {
  return (
    <div className="card card-flush" style={{ background: "#fff" }}>
      <div
        className="flex items-center justify-between px-6 py-4 hairline-b"
        style={{ background: "var(--paper)" }}
      >
        <div className="micro">
          <span className="micro-dot" />
          state machine
        </div>
        <div className="mono text-[10.5px] tracking-[0.16em] uppercase text-[color:var(--slate)]">
          8 states · 7 legal transitions · 3 terminal
        </div>
      </div>
      <div className="p-6 md:p-8" style={{ background: "var(--paper)" }}>
        <svg
          viewBox="0 0 912 400"
          className="w-full h-auto"
          role="img"
          aria-label="STATEKEEP state machine. OPEN → CLAIMED via claim(); CLAIMED → PENDING atomically; PENDING → MATURED (predicate true) then atomically to PAID; PENDING → FAILED (predicate false) then to SLASHED via slash(); OPEN → EXPIRED via expire()."
        >
          <defs>
            <marker id="arrow-neutral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--slate)" />
            </marker>
            <marker id="arrow-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--sage)" />
            </marker>
            <marker id="arrow-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--brick)" />
            </marker>
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--amber)" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map((e, i) => {
            const a = center(e.from);
            const b = center(e.to);
            const dx = b.cx - a.cx;
            const dy = b.cy - a.cy;
            const len = Math.sqrt(dx * dx + dy * dy);
            const trimStart = 46;
            const trimEnd = 46;
            const ux = dx / len;
            const uy = dy / len;
            const x1 = a.cx + ux * trimStart;
            const y1 = a.cy + uy * trimStart;
            const x2 = b.cx - ux * trimEnd;
            const y2 = b.cy - uy * trimEnd;

            const toNode = NODES.find((n) => n.s === e.to)!;
            const isAtomic = e.kind === "atomic";
            const stroke = isAtomic
              ? "var(--amber)"
              : toNode.branch === "good"
                ? "var(--sage)"
                : toNode.branch === "bad"
                  ? "var(--brick)"
                  : "var(--slate)";
            const marker = isAtomic
              ? "url(#arrow-amber)"
              : toNode.branch === "good"
                ? "url(#arrow-good)"
                : toNode.branch === "bad"
                  ? "url(#arrow-bad)"
                  : "url(#arrow-neutral)";

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const perpX = -uy;
            const perpY = ux;
            const labelX = midX + perpX * 12;
            const labelY = midY + perpY * 12;

            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={stroke}
                  strokeWidth={isAtomic ? 1.4 : 1.4}
                  strokeLinecap="round"
                  className={isAtomic ? "edge-flow" : undefined}
                  markerEnd={marker}
                />
                <text
                  x={labelX}
                  y={labelY}
                  fill={stroke}
                  fontSize="10.5"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                  letterSpacing="0.05em"
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
                rx={10}
                ry={10}
                fill={nodeFill(n)}
                stroke={nodeStroke(n)}
                strokeWidth={n.terminal ? 0 : 1.25}
              />
              <text
                x={NODE_W / 2}
                y={24}
                textAnchor="middle"
                fill={nodeLabelColor(n)}
                fontSize="13"
                fontFamily="var(--font-mono)"
                fontWeight={500}
                letterSpacing="0.14em"
              >
                {n.s}
              </text>
              {n.note && (
                <text
                  x={NODE_W / 2}
                  y={42}
                  textAnchor="middle"
                  fill={nodeNoteColor(n)}
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.02em"
                >
                  {n.note}
                </text>
              )}
            </g>
          ))}
        </svg>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] text-[color:var(--slate)]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-px" style={{ background: "var(--slate)" }} />
            <span>observable transition</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-8 h-px"
              style={{
                background:
                  "repeating-linear-gradient(to right, var(--amber) 0 3px, transparent 3px 6px)",
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

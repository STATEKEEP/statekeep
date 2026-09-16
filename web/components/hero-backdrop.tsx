/**
 * Hero backdrop — hand-authored SVG art tuned to the ink+amber palette.
 *
 * A large architectural constellation of the state machine, rendered as a
 * background layer: eight geometric nodes on a lattice, connected by the
 * canonical transitions, with one active flow highlighted. Reads as a
 * schematic instrument-panel etching, not decoration.
 *
 * PNG generation via OpenAI is deferred (no key set at build time); this
 * SVG is authored so the site is not empty of imagery. See
 * `docs/design-audit.md`.
 */

export function HeroBackdrop() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.42]"
    >
      <defs>
        <linearGradient id="edge-warm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(217,122,29,0)" />
          <stop offset="0.5" stopColor="rgba(217,122,29,0.55)" />
          <stop offset="1" stopColor="rgba(217,122,29,0)" />
        </linearGradient>
        <radialGradient id="glow-a" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(242,168,74,0.7)" />
          <stop offset="1" stopColor="rgba(242,168,74,0)" />
        </radialGradient>
        <pattern id="lattice" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(240,232,207,0.045)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Lattice */}
      <rect width="100%" height="100%" fill="url(#lattice)" />

      {/* Ambient warm glow bleeds */}
      <circle cx="960" cy="120" r="240" fill="url(#glow-a)" />
      <circle cx="120" cy="620" r="220" fill="url(#glow-a)" opacity="0.55" />

      {/* State-machine constellation. Positions are architectural, not spec-accurate here. */}
      {(() => {
        const nodes: Array<[number, number, string, boolean]> = [
          [140,  180, "OPEN",    false],
          [420,  180, "CLAIMED", false],
          [720,  180, "PENDING", false],
          [560,  380, "MATURED", true ],
          [860,  380, "FAILED",  false],
          [560,  540, "PAID",    true ],
          [860,  540, "SLASHED", false],
          [140,  380, "EXPIRED", false],
          [1020, 180, "·",       false],
          [1060, 540, "·",       false],
        ];
        const edges: Array<[number, number, boolean]> = [
          // indices into nodes
          [0, 1, true],
          [1, 2, true],
          [2, 3, true],
          [2, 4, false],
          [3, 5, true],
          [4, 6, false],
          [0, 7, false],
        ];
        return (
          <>
            {edges.map(([ai, bi, active], i) => {
              const [ax, ay] = nodes[ai];
              const [bx, by] = nodes[bi];
              return (
                <line
                  key={i}
                  x1={ax}
                  y1={ay}
                  x2={bx}
                  y2={by}
                  stroke={active ? "url(#edge-warm)" : "rgba(240,232,207,0.12)"}
                  strokeWidth={active ? 1.4 : 1}
                  strokeDasharray={active ? undefined : "3 5"}
                />
              );
            })}
            {nodes.map(([x, y, label, active], i) => (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={active ? 7 : 4.5}
                  fill={active ? "rgba(242,168,74,0.9)" : "rgba(240,232,207,0.55)"}
                />
                {active && (
                  <circle
                    cx={x}
                    cy={y}
                    r={14}
                    fill="none"
                    stroke="rgba(242,168,74,0.35)"
                    strokeWidth="1"
                  />
                )}
                {label !== "·" && (
                  <text
                    x={x + 14}
                    y={y + 4}
                    fill={active ? "rgba(242,168,74,0.9)" : "rgba(240,232,207,0.32)"}
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.16em"
                  >
                    {label}
                  </text>
                )}
              </g>
            ))}
          </>
        );
      })()}

      {/* Bottom hairline — the horizon */}
      <line x1="0" y1="680" x2="1200" y2="680" stroke="rgba(240,232,207,0.09)" strokeWidth="1" />
    </svg>
  );
}

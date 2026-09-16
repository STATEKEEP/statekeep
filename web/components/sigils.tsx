/**
 * Sigils — small hand-authored SVG glyphs used as per-card art anchors.
 *
 * These fill the role of daybreak's radial-gradient art panels on Spotlight
 * cards. Each sigil is a geometric abstraction of the concept it labels;
 * none are decorative, all trace back to a real STATEKEEP concept.
 */

const PALETTE = {
  paper: "#fbfaf5",
  amber: "#d97a1d",
  amber2: "#b8620f",
  amberGlow: "#f2a84a",
  ink: "#1a1712",
  slate: "#6a6558",
  slate2: "#4a4638",
  hairline: "#e6e1d1",
  sage: "#5f7855",
  brick: "#a8332b",
};

function Frame({ children, tint = "warm" }: { children: React.ReactNode; tint?: "warm" | "cool" | "sage" | "brick" }) {
  const gradient =
    tint === "sage"  ? `radial-gradient(circle at 50% 40%, #eef1e6 0%, #dfe5d1 100%)` :
    tint === "brick" ? `radial-gradient(circle at 50% 40%, #f5e8e5 0%, #ecd5cf 100%)` :
    tint === "cool"  ? `radial-gradient(circle at 50% 40%, #f0ecdd 0%, #e2dcc4 100%)` :
                        `radial-gradient(circle at 50% 40%, #fbf1dc 0%, #f2e2b8 100%)`;
  return (
    <div
      className="w-full h-[128px] rounded-[var(--r-3)] hairline overflow-hidden grid place-items-center"
      style={{ background: gradient, borderColor: "var(--hairline-2)" }}
      aria-hidden
    >
      {children}
    </div>
  );
}

/** Protocol — a sealed contract with a stamp */
export function SigilProtocol() {
  return (
    <Frame tint="warm">
      <svg viewBox="0 0 120 80" width="120" height="80">
        <rect x="18" y="14" width="84" height="52" rx="4" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="1.2" />
        <line x1="26" y1="26" x2="80" y2="26" stroke={PALETTE.slate2} strokeWidth="1" />
        <line x1="26" y1="34" x2="94" y2="34" stroke={PALETTE.hairline} strokeWidth="1" />
        <line x1="26" y1="42" x2="88" y2="42" stroke={PALETTE.hairline} strokeWidth="1" />
        <line x1="26" y1="50" x2="70" y2="50" stroke={PALETTE.hairline} strokeWidth="1" />
        <circle cx="86" cy="56" r="10" fill={PALETTE.amber} />
        <circle cx="86" cy="56" r="10" fill="none" stroke={PALETTE.amber2} strokeWidth="1.2" />
        <text x="86" y="59" textAnchor="middle" fill={PALETTE.paper} fontSize="7" fontFamily="ui-monospace" letterSpacing="0.14em">v1</text>
      </svg>
    </Frame>
  );
}

/** Executor — a bond puck locked with a chain link, arrow of proof */
export function SigilExecutor() {
  return (
    <Frame tint="cool">
      <svg viewBox="0 0 120 80" width="120" height="80">
        {/* bond puck */}
        <circle cx="34" cy="40" r="16" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="1.2" />
        <text x="34" y="43" textAnchor="middle" fill={PALETTE.ink} fontSize="7" fontFamily="ui-monospace" letterSpacing="0.14em">BOND</text>
        {/* proof arrow */}
        <path d="M 54 40 L 84 40" stroke={PALETTE.amber} strokeWidth="1.6" markerEnd="url(#s-arrow)" />
        <defs>
          <marker id="s-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={PALETTE.amber} />
          </marker>
        </defs>
        {/* delta */}
        <path d="M 92 30 L 104 44 L 80 44 Z" fill={PALETTE.paper} stroke={PALETTE.amber2} strokeWidth="1.2" />
        <text x="92" y="42" textAnchor="middle" fill={PALETTE.amber2} fontSize="10" fontFamily="var(--font-mono)">Δ</text>
        <text x="70" y="60" textAnchor="middle" fill={PALETTE.slate} fontSize="6" fontFamily="ui-monospace" letterSpacing="0.16em">PROOF</text>
      </svg>
    </Frame>
  );
}

/** Chain — a settlement gate, two states converging to a stamped verdict */
export function SigilChain() {
  return (
    <Frame tint="sage">
      <svg viewBox="0 0 120 80" width="120" height="80">
        <circle cx="30" cy="30" r="6" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="1.2" />
        <circle cx="30" cy="52" r="6" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="1.2" />
        <path d="M 38 30 Q 60 30 60 40 Q 60 52 38 52" fill="none" stroke={PALETTE.slate} strokeWidth="1" />
        <path d="M 36 30 L 58 30" stroke={PALETTE.slate} strokeWidth="1" />
        <path d="M 36 52 L 58 52" stroke={PALETTE.slate} strokeWidth="1" />
        {/* settlement node */}
        <rect x="70" y="30" width="34" height="20" rx="4" fill={PALETTE.sage} />
        <text x="87" y="43" textAnchor="middle" fill={PALETTE.paper} fontSize="8" fontFamily="ui-monospace" letterSpacing="0.14em">PAID</text>
      </svg>
    </Frame>
  );
}

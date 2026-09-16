/**
 * The proof band — daybreak's 4-column hairline-divided stat row, adapted
 * for STATEKEEP. Sits directly under the hero, on the paper surface. Each
 * cell has a dotted-mono eyebrow and a short display headline. No fake
 * metrics — every cell is a positioning claim, not a number we don't have.
 */

const CELLS: { eyebrow: string; head: React.ReactNode; note: string }[] = [
  {
    eyebrow: "settlement object",
    head: <>the resulting <em className="not-italic text-[color:var(--amber-2)]">state</em>, not the call</>,
    note: "payment gates on evaluated on-chain state — never on function-return",
  },
  {
    eyebrow: "durability",
    head: <>held across <em className="not-italic text-[color:var(--amber-2)]">M slots</em>, not one block</>,
    note: "a one-block fix earns partial. only durable state earns full",
  },
  {
    eyebrow: "reconciliation",
    head: <>whole surface, not one number</>,
    note: "headline metric fixed by draining protected balance ⇒ rejected",
  },
  {
    eyebrow: "authority",
    head: <>anyone attempts. chain settles.</>,
    note: "permissionless claim, permissionless finalize, permissionless slash",
  },
];

export function ProofBand() {
  return (
    <div className="hairline-t hairline-b" style={{ background: "#fff" }}>
      <div
        className="shell grid grid-cols-1 md:grid-cols-4 divide-hair"
        style={{ paddingBlock: "clamp(40px, 5vw, 60px)" }}
      >
        {CELLS.map((c) => (
          <div key={c.eyebrow} className="px-0 md:px-6 py-4 md:py-2 flex flex-col gap-3">
            <div className="micro">
              <span className="micro-dot" />
              {c.eyebrow}
            </div>
            <div
              className="font-display font-semibold tracking-[-0.02em] leading-[1.15] text-[19px] md:text-[20px]"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              {c.head}
            </div>
            <div className="text-[12.5px] leading-relaxed text-[color:var(--slate-2)] max-w-[28ch]">
              {c.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

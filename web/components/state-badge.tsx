import { cn } from "@/lib/cn";

export type StateName =
  | "OPEN"
  | "CLAIMED"
  | "PENDING"
  | "MATURED"
  | "PAID"
  | "FAILED"
  | "SLASHED"
  | "EXPIRED";

// Each state carries a stable hue. Terminal states are set in solid pill,
// non-terminal states are outlined — a signature typographic differentiation.
const CFG: Record<StateName, { fg: string; bg: string; bd: string; terminal?: boolean }> = {
  OPEN:     { fg: "var(--st-open)",     bg: "transparent",              bd: "var(--hairline-2)" },
  CLAIMED:  { fg: "var(--st-claimed)",  bg: "color-mix(in oklab, var(--amber) 12%, transparent)", bd: "color-mix(in oklab, var(--amber) 40%, transparent)" },
  PENDING:  { fg: "var(--st-pending)",  bg: "color-mix(in oklab, var(--amber) 8%, transparent)",  bd: "color-mix(in oklab, var(--amber) 30%, transparent)" },
  MATURED:  { fg: "var(--st-matured)",  bg: "color-mix(in oklab, var(--sage) 10%, transparent)",  bd: "color-mix(in oklab, var(--sage) 35%, transparent)" },
  PAID:     { fg: "#f3ecd6",            bg: "var(--st-paid)",           bd: "var(--st-paid)", terminal: true },
  FAILED:   { fg: "var(--st-failed)",   bg: "color-mix(in oklab, var(--brick) 8%, transparent)", bd: "color-mix(in oklab, var(--brick) 40%, transparent)" },
  SLASHED:  { fg: "#f3ecd6",            bg: "var(--st-slashed)",        bd: "var(--st-slashed)", terminal: true },
  EXPIRED:  { fg: "#f3ecd6",            bg: "var(--st-expired)",        bd: "var(--st-expired)", terminal: true },
};

export function StateBadge({
  name,
  className,
  size = "sm",
}: {
  name: StateName;
  className?: string;
  size?: "xs" | "sm" | "md";
}) {
  const cfg = CFG[name];
  const pad =
    size === "md" ? "px-2.5 py-1 text-[11px]" :
    size === "xs" ? "px-1.5 py-0.5 text-[9px]" :
                     "px-2 py-0.5 text-[10px]";
  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-1.5 leading-none tracking-[0.16em] font-medium",
        "rounded-[6px] border",
        pad,
        className,
      )}
      style={{
        color: cfg.fg,
        background: cfg.bg,
        borderColor: cfg.bd,
      }}
    >
      <span
        aria-hidden
        className="h-1 w-1 rounded-full"
        style={{ background: cfg.terminal ? cfg.fg : "currentColor" }}
      />
      {name}
    </span>
  );
}

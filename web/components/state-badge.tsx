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

const styles: Record<StateName, string> = {
  OPEN: "text-state-open border-ink-600",
  CLAIMED: "text-amber-400 border-amber-600/50",
  PENDING: "text-amber-400 border-amber-600/50",
  MATURED: "text-state-matured border-state-matured/40",
  PAID: "text-state-paid border-state-paid/40",
  FAILED: "text-state-failed border-state-failed/50",
  SLASHED: "text-state-slashed border-state-slashed/50",
  EXPIRED: "text-state-expired border-ink-600",
};

export function StateBadge({
  name,
  className,
}: {
  name: StateName;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-1.5 rounded-[var(--radius-2)] border px-2 py-0.5 text-[10px] leading-none tracking-[0.14em]",
        styles[name],
        className,
      )}
    >
      <span
        className="h-1 w-1 rounded-full bg-current"
        aria-hidden
      />
      {name}
    </span>
  );
}

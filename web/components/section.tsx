import { cn } from "@/lib/cn";

/**
 * Section — the rhythm unit of the page.
 *
 * The `fill` prop switches between the three surface fills that create the
 * page's alternating rhythm (paper / porcelain / ink). Every section head
 * uses the same anatomy: dotted-mono eyebrow → broken-line display headline
 * → optional sub-note → body.
 */
export function Section({
  eyebrow,
  title,
  note,
  index,
  children,
  className,
  id,
  fill = "paper",
  wide = false,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  note?: React.ReactNode;
  index?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  fill?: "paper" | "porcelain" | "ink";
  wide?: boolean;
}) {
  const fillClass =
    fill === "porcelain" ? "surface-porcelain hairline-t hairline-b" :
    fill === "ink"       ? "hero-ink" :
                           "surface-paper";

  const inkText = fill === "ink";

  return (
    <section
      id={id}
      className={cn("relative", fillClass, className)}
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div className={cn("shell", wide && "max-w-[1400px]")}>
        {(eyebrow || index) && (
          <div
            className={cn(
              "micro mb-6",
              inkText && "micro-on-ink"
            )}
          >
            {index && (
              <span
                className={cn(
                  "mono",
                  inkText ? "text-[color:var(--amber-glow)]" : "text-[color:var(--amber-2)]"
                )}
              >
                {index}
              </span>
            )}
            {eyebrow && <span>{eyebrow}</span>}
          </div>
        )}

        {title && (
          <h2
            className={cn(
              "display display-lg max-w-3xl",
              inkText ? "text-[#f4ecd4]" : "text-[color:var(--ink)]"
            )}
          >
            {title}
          </h2>
        )}

        {note && (
          <p
            className={cn(
              "mt-5 max-w-2xl text-[15px] leading-relaxed",
              inkText ? "text-[#c9c1a5]" : "text-[color:var(--slate-2)]"
            )}
          >
            {note}
          </p>
        )}

        <div className={cn("mt-12", !title && !eyebrow && "mt-0")}>{children}</div>
      </div>
    </section>
  );
}

/**
 * Broken-line headline. Each `<Line>` is its own display beat.
 * Usage:
 *   <Lines>
 *     <Line>Your world.</Line>
 *     <Line accent>Your stocks.</Line>
 *   </Lines>
 */
export function Lines({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("lines", className)}>{children}</span>;
}

export function Line({
  children,
  accent,
  italic,
  className,
}: {
  children: React.ReactNode;
  accent?: boolean;
  italic?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "line",
        accent && "text-[color:var(--amber)]",
        italic && "italic",
        className,
      )}
    >
      {children}
    </span>
  );
}

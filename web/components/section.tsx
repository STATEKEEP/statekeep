import { cn } from "@/lib/cn";

export function Section({
  eyebrow,
  title,
  children,
  className,
  id,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-6 py-20 md:py-28", className)}>
      {eyebrow && <div className="eyebrow mb-4">{eyebrow}</div>}
      {title && (
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink-050 max-w-3xl mb-10">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

"use client";

/**
 * The interactive artifact — daybreak's Spotlight equivalent for STATEKEEP.
 *
 * Drag the slider to change the reserve ratio. Watch the predicate flip
 * true → false in real time. This is the one moment on the site where the
 * mechanism *runs* without needing a live chain. Everything is local math,
 * but the shape of the predicate is the exact shape spec'd in
 * docs/INVARIANTS.md: composite AND of a headline threshold and a protected
 * bound. No claim of live chain state.
 */

import { useMemo, useState } from "react";
import { StateBadge } from "./state-badge";

const BASELINE_PRINCIPAL = 1_200_000;
const BASELINE_DEBT = 900_000;
const THRESHOLD_RATIO = 80;
const MAX_PRINCIPAL_DROP = 0; // strict — protected balance cannot regress

function fmt$(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + Math.round(n / 1_000) + "k";
  return "$" + Math.round(n).toString();
}

export function PredicateDemo() {
  const [ratio, setRatio] = useState(83);              // 40..100
  const [principal, setPrincipal] = useState(BASELINE_PRINCIPAL);   // 900k..1.2M
  const [debt, setDebt] = useState(850_000);            // 800k..1M

  const ratioOK = ratio >= THRESHOLD_RATIO;
  const principalOK = principal >= BASELINE_PRINCIPAL - MAX_PRINCIPAL_DROP;
  const debtOK = debt <= BASELINE_DEBT;
  const predicate = ratioOK && principalOK && debtOK;

  const state: "OPEN" | "CLAIMED" | "PENDING" | "PAID" | "FAILED" = useMemo(() => {
    if (predicate) return "PAID";
    if (ratioOK && (!principalOK || !debtOK)) return "FAILED";
    return "OPEN";
  }, [predicate, ratioOK, principalOK, debtOK]);

  return (
    <div
      className="rounded-[var(--r-4)] overflow-hidden hairline"
      style={{ background: "#fff" }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 hairline-b"
        style={{ background: "var(--paper)" }}
      >
        <div className="micro">
          <span className="micro-dot" />
          live predicate · runs in your browser
        </div>
        <StateBadge name={state} size="md" />
      </div>

      <div className="grid md:grid-cols-[1fr_1fr] gap-0 divide-hair">
        {/* LEFT: inputs */}
        <div className="p-6 md:p-8">
          <div className="mono text-[10.5px] tracking-[0.18em] uppercase text-[color:var(--slate)] mb-6">
            protocol state · drag to change
          </div>

          <div className="space-y-7">
            <Slider
              label="reserve ratio"
              suffix="%"
              min={40}
              max={100}
              step={0.5}
              value={ratio}
              onChange={setRatio}
              ok={ratioOK}
              baseline={THRESHOLD_RATIO}
              baselineLabel={`threshold ≥ ${THRESHOLD_RATIO}%`}
              display={ratio.toFixed(1)}
            />

            <Slider
              label="user principal"
              min={900_000}
              max={1_200_000}
              step={5_000}
              value={principal}
              onChange={setPrincipal}
              ok={principalOK}
              baseline={BASELINE_PRINCIPAL}
              baselineLabel={`protected ≥ ${fmt$(BASELINE_PRINCIPAL)}`}
              display={fmt$(principal)}
            />

            <Slider
              label="outstanding debt"
              min={800_000}
              max={1_100_000}
              step={5_000}
              value={debt}
              onChange={setDebt}
              ok={debtOK}
              baseline={BASELINE_DEBT}
              baselineLabel={`bounded ≤ ${fmt$(BASELINE_DEBT)}`}
              display={fmt$(debt)}
              invert
            />
          </div>

          <button
            onClick={() => {
              setRatio(83);
              setPrincipal(BASELINE_PRINCIPAL);
              setDebt(850_000);
            }}
            className="mt-8 mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--slate-2)] hover:text-[color:var(--amber-2)] transition-colors"
          >
            reset to baseline →
          </button>
        </div>

        {/* RIGHT: evaluated predicate */}
        <div className="p-6 md:p-8" style={{ background: "var(--porcelain)" }}>
          <div className="mono text-[10.5px] tracking-[0.18em] uppercase text-[color:var(--slate)] mb-6">
            what the program evaluates
          </div>

          <pre
            className="mono text-[13px] leading-[1.9] p-5 hairline rounded-[var(--r-3)] overflow-x-auto"
            style={{ background: "#fff" }}
          >
{`predicate = (
    reserve_ratio >= 80%      · `}<Marker ok={ratioOK} />{`
  ∧ principal    >= baseline  · `}<Marker ok={principalOK} />{`
  ∧ debt         <= baseline  · `}<Marker ok={debtOK} />{`
)                             ⟹ `}<Verdict ok={predicate} />
          </pre>

          <div className="mt-6 grid grid-cols-2 gap-3 text-[13px]">
            <ResultRow label="reward" value="fully released" active={predicate} />
            <ResultRow label="bond"   value="returned"       active={predicate} />
          </div>

          <p
            className="mt-6 text-[13px] leading-[1.7]"
            style={{ color: "var(--slate-2)" }}
          >
            {predicate ? (
              <>
                Every protected bound is satisfied. If this state
                <em className="not-italic text-[color:var(--ink)]"> stays </em>
                valid through the durability window, settlement releases the
                deferred reward. The executor keeps their bond.
              </>
            ) : ratioOK ? (
              <>
                Headline ratio is fine —{" "}
                <em className="not-italic text-[color:var(--brick)]">
                  but a protected surface has been sacrificed
                </em>
                . The predicate returns false. This is the metric-swap attack;
                whole-state reconciliation catches it.
              </>
            ) : (
              <>
                The health condition itself is unmet. There is nothing to
                recover yet — the recovery capability is not open.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Marker({ ok }: { ok: boolean }) {
  return (
    <span
      className="mono"
      style={{ color: ok ? "var(--sage)" : "var(--brick)" }}
    >
      {ok ? "✓ true " : "✗ false"}
    </span>
  );
}

function Verdict({ ok }: { ok: boolean }) {
  return (
    <span
      className="mono font-medium"
      style={{ color: ok ? "var(--sage)" : "var(--brick)" }}
    >
      {ok ? "PAY " : "REJECT"}
    </span>
  );
}

function ResultRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className="rounded-[var(--r-3)] hairline px-3.5 py-2.5"
      style={{ background: active ? "color-mix(in oklab, var(--sage) 10%, #fff)" : "#fff" }}
    >
      <div className="mono text-[9.5px] tracking-[0.18em] uppercase text-[color:var(--slate)]">
        {label}
      </div>
      <div
        className="text-[13.5px] font-medium mt-1"
        style={{ color: active ? "var(--st-paid)" : "var(--slate-2)" }}
      >
        {active ? value : "— held —"}
      </div>
    </div>
  );
}

function Slider({
  label,
  suffix,
  min,
  max,
  step,
  value,
  onChange,
  ok,
  baseline,
  baselineLabel,
  display,
  invert,
}: {
  label: string;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  ok: boolean;
  baseline: number;
  baselineLabel: string;
  display: string;
  invert?: boolean;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const bpct = ((baseline - min) / (max - min)) * 100;
  const color = ok ? "var(--sage)" : "var(--brick)";
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div className="mono text-[10.5px] tracking-[0.18em] uppercase text-[color:var(--slate-2)]">
          {label}
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="font-display text-[22px] font-semibold"
            style={{ fontFamily: "var(--font-display)", color }}
          >
            {display}
            {suffix && <span className="text-[color:var(--slate)] text-[15px] ml-0.5">{suffix}</span>}
          </span>
        </div>
      </div>
      <div className="relative h-8">
        {/* Track */}
        <div
          className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-1 rounded-full"
          style={{ background: "var(--hairline)" }}
        />
        {/* Filled */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full"
          style={{
            left: invert ? `${pct}%` : 0,
            width: invert ? `${100 - pct}%` : `${pct}%`,
            background: color,
          }}
        />
        {/* Baseline marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-px"
          style={{ left: `${bpct}%`, background: "var(--ink)" }}
          aria-hidden
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
        {/* Thumb (visual) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full shadow-sm pointer-events-none"
          style={{
            left: `calc(${pct}% - 8px)`,
            background: "#fff",
            border: `2px solid ${color}`,
          }}
        />
      </div>
      <div className="mt-2 mono text-[10.5px] tracking-[0.14em] uppercase text-[color:var(--slate)]">
        {baselineLabel}
      </div>
    </div>
  );
}

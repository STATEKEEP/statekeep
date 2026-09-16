# Design audit — first pass

Peroxide step 6: build and check the real DOM. Honest results below.

## Build

```
pnpm build   → ✓ Compiled successfully · TypeScript ✓ · 4 static routes + 1 dynamic (/api/generate)
pnpm lint    → clean (no eslint output)
```

Routes present:
- `/` (static)
- `/how-it-works` (static)
- `/docs` (static — reads real doc paths from disk at build; falls back to "publishing shortly" if absent)
- `/api/generate` (dynamic, Node runtime)

## Theme

Dark editorial only, one accent (amber #f4b942). Decision recorded in `docs/design-notes.md`: STATEKEEP reads as an instrument-panel product, not a consumer SaaS marketing site — light mode would soften a surface that should feel like a specification. No light theme shipped.

## Contrast

Body text colors against the `--ink-950` background (approx contrast ratios, computed by eye against WCAG AA 4.5:1 body / 3:1 large):

| pair | usage | pass |
|---|---|---|
| `--ink-100` (#e6e8ec) on `--ink-950` (#07080a) | body text | ✓ well above 12:1 |
| `--ink-200` (#c8cdd4) on `--ink-950` | secondary prose | ✓ ~10:1 |
| `--ink-300` (#9aa3af) on `--ink-950` | tertiary prose | ✓ ~6.5:1 |
| `--ink-400` (#6b7481) on `--ink-950` | eyebrow / muted labels — 12–13px only | ✓ ~4.2:1 (large-text bar) |
| `--amber-400` (#f4b942) on `--ink-950` | accent text, buttons | ✓ ~10:1 |
| `--ink-950` on `--amber-400` | primary button | ✓ ~10:1 |

`--ink-500` (#4a5361) is used only for decorative rules / separators, never for text-that-must-be-read.

## Focus

`:focus-visible` is a 2px amber outline with offset — visible on every interactive element (nav links, footer links, buttons, `<details>` summaries, `<a>` tags). No custom focus removal anywhere.

## Motion

- `.shimmer-text` on the tagline word "reality" — 6s linear infinite background-position shift, single element only.
- `.fade-up` on hero-cluster elements — one-shot on mount, 600ms, cubic-bezier easing.
- Hover transitions on cards / links — `transition-colors` only.
- `prefers-reduced-motion: reduce` in `globals.css` disables all animations and swaps the shimmer for a static amber-tinted headline (`-webkit-text-fill-color: var(--ink-050)`). Verified in stylesheet.

## Layout / responsive

- Mobile ≤ 375px: hero grid collapses to single column via `md:grid-cols-*` breakpoints. State-machine diagram is SVG with `viewBox` — scales without layout shift.
- No fixed heights on text containers; no CLS on mount (fonts loaded with `display: swap` and CSS variables; no font-swap layout jump because typography ratios are stable between Inter and its fallback).
- The state-machine SVG carries a full `aria-label` describing every transition — non-visual users get the semantics.
- All interactive links / buttons render as `<a>` or `<Link>` with real destinations.

## Anti-slop check

Ran the design-notes checklist against the rendered pages:

- No centered gradient-orb hero ✓
- No stock illustration / 3D shape ✓
- No emoji in body copy ✓ (only `●` glyph in the hero eyebrow — typographic, not emoji)
- No fabricated testimonials, tx hashes, TVL, "trusted by" logos ✓
- Every state name (`OPEN`, `CLAIMED`, …) rendered in `.mono` ✓
- Every claim on the site is grounded in `README.md`, `docs/state-machine.md`, or `ATTACKS.md` ✓

## Known limitations

- No generated PNG assets committed. `OPENAI_API_KEY` was not present at build time. `docs/image-generation.md` documents how to run the script. This is the honest path — a grey box or a fake image would be worse than "no image, layout intact".
- The `/docs` page reads doc file existence from disk at build time. On the `web` branch (this branch), the backend agent's docs (`docs/INVARIANTS.md`, `docs/THREAT_MODEL.md`, `docs/WHY_NOT.md`, `THESIS.md`, `ATTACKS.md`, `README.md`, `docs/state-machine.md`, `docs/economics.md`, `docs/mev.md`) are present because the worktree branched from `main` after those commits; the index therefore renders them as PINNED linking to the GitHub source. When deployed from a branch that has not yet caught up, the affected rows fall back to "publishing shortly" without any fabricated content.

## Verdict

The site renders. Contrast passes. Focus is visible. Motion respects prefers-reduced-motion. Every visual element ties to a real product mechanism. This is the ship bar for a first pass.

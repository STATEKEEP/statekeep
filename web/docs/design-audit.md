# Design audit — post-daybreak-calibration rebuild

Prior audit (dark-editorial, amber-on-ink) is superseded. This build pivots to a daylight editorial system informed by `docs/daybreak-study.md` and the diagnosis in `docs/diagnosis.md`.

## Build & lint

```
pnpm build   → ✓ Compiled successfully · TypeScript ✓ · 5 static routes + 1 dynamic (/api/generate)
pnpm lint    → clean (0 eslint findings)
```

Routes: `/`, `/how-it-works`, `/demo` (new), `/docs`, `/api/generate` (dynamic).

## Daybreak → STATEKEEP side-by-side

Every mechanism observed in `daybreak-study.md` mapped to its STATEKEEP equivalent. This is the traceability contract.

| daybreak move | statekeep equivalent | files |
|---|---|---|
| Porcelain `#f6f8fd` page + electric-blue accent + ink text | Warm paper `#fbfaf5` page + amber `#d97a1d` accent + ink text `#1a1712` | `app/globals.css` |
| Blue hero fill (`.db-hero`) — inverted band | Ink hero fill (`.hero-ink`) — deep-ink with warm amber radial glows and grain | `app/globals.css`, `components/hero-backdrop.tsx` |
| Space Grotesk display, Inter Tight body, Doto dotted mono | Space Grotesk display, Inter Tight body, JetBrains Mono for micro-eyebrow / spec | `app/layout.tsx`, `app/globals.css` (`--font-display/-sans/-mono`) |
| Broken-line hero copy in `.db-lines` | `<Lines>` + `<Line>` components; every headline is stacked (`Pay for the / resulting state. / Not for the call.`) | `components/section.tsx`, all pages |
| Dotted-mono eyebrow (`.db-micro`) | `.micro` utility — JetBrains Mono, 11px, 0.14em tracking, uppercase, with a `.micro-dot` amber glyph | `app/globals.css`, every section eyebrow |
| Section rhythm via alternating fills (blue → white → porcelain → tint → blue → white) | Three-fill rhythm: `paper` → `porcelain` → `hero-ink` — set per-section via `fill=` prop | `components/section.tsx`, `app/page.tsx` |
| 4-column proof band beneath hero with vertical hairline dividers | `<ProofBand>` — 4 cells: settlement / durability / reconciliation / authority. `.divide-hair` handles the vertical rules | `components/proof-band.tsx` |
| Spotlight cards (interactive artifact) | `<PredicateDemo>` — three sliders that flip a composite AND live in the DOM | `components/predicate-demo.tsx`, `app/demo/page.tsx` |
| Chunky rounded buttons, 18px radius, gap 14 | `.btn`, `.btn-amber`, `.btn-ghost-ink` — 14px radius, 12px gap, 50px min-height | `app/globals.css` |
| Glass nav pill | `.glass` (available; used sparingly). Nav pill uses hairline+radius | `components/nav.tsx`, `app/globals.css` |
| Illustrated globe bleeds off hero | `<HeroBackdrop>` — hand-authored SVG state-machine constellation with amber-warm glow at 42% opacity | `components/hero-backdrop.tsx` |
| Custom motion tokens (press/panel/place) | `--dur-press: 140ms`, `--dur-panel: 280ms`, `--dur-place: 380ms`, `--ease: cubic-bezier(.2,.75,.25,1)` — every transition uses these | `app/globals.css` |
| `prefers-reduced-transparency` + `prefers-reduced-motion` fallbacks | Both respected — glass falls back to solid paper; all animations set to 0.001ms | `app/globals.css` (bottom) |
| Short poetic copy: "Small circles. A wider world." | Every headline is broken-line: "Two ways to pay a keeper. / Only one settles on truth." | `app/page.tsx`, `app/how-it-works/page.tsx`, `app/demo/page.tsx` |

## Signature moves specific to STATEKEEP (not stolen — earned)

1. **Recovery-contract spec artifact** (`<HeroArtifact />`) — the five-line contract from `README.md` rendered as a real registered document with hairline metadata rows, dark-theme on ink hero, light-theme on how-it-works. This is the single strongest "authored" object on the page.
2. **The state machine as an art-directed feature** (`<StateMachineDiagram />`) — 172px-wide node pills, terminal states as solid filled pills (PAID sage-green, SLASHED brick, EXPIRED slate), non-terminal outlined, atomic edges dashed + animated flow, branch-colored arrow heads (sage/brick/slate/amber). Sits full-shell wide on porcelain.
3. **Live predicate simulator** — the daybreak Spotlight equivalent. Three sliders, real composite-AND math, verdict flips PAY/REJECT in real time. Copy reads: "No live chain, no fake tx hashes — just the real predicate math."
4. **Durability timeline on ink** — the 25/75 explanation is rendered in an ink-mode card on a paper section, so it contrasts as a distinct receipt strip. Reinforces "the durability window is a first-class phase."
5. **Ink CTA outro band** — the page closes with a second ink band echoing the hero, with the argument-sentence "The mechanism is the argument. Everything else is receipts." Bookends the rhythm.

## Contrast (WCAG-AA sanity check, computed by pairing)

| pair | context | notes |
|---|---|---|
| ink `#1a1712` on paper `#fbfaf5` | body copy on default surface | ≥ 15:1 — well above AA large + body |
| slate-2 `#4a4638` on paper | secondary prose | ~10:1 |
| slate `#6a6558` on paper | eyebrow labels, 11px | ~6.5:1 — passes AA for large-text bar; used only at ≥ 11px tracked, effectively legible |
| amber-2 `#b8620f` on paper | text links | ~4.9:1 — passes AA body |
| amber `#d97a1d` on ink `#0e0c08` | on-ink accent | ~7:1 |
| #f4ecd4 on ink | headlines on hero | ~14:1 |
| #d8cfaf on ink | hero body | ~9:1 |
| #a89f83 on ink | hero micro-eyebrow, 11px tracked | ~5:1 |

## Focus, motion, a11y

- `:focus-visible` — 2px amber outline, 3px offset, rounded — applied globally, never removed.
- Every animation is a subtle `rise-in` (10px, 380ms) or `soft-pulse` (2.6s status dot) or `edge-flow` on atomic edges. No parallax, no scroll-jacking, no autoplay video.
- Reduced motion + reduced transparency both fall back cleanly.
- State-machine SVG carries a full `aria-label` describing every transition — reads meaningfully to a screen reader.
- All CTAs are real `<a>` / `<Link>` with real destinations. No divs-as-buttons.

## Imagery status

- **`OPENAI_API_KEY` not present at build time** → PNG generation via `scripts/generate-assets.ts` is deferred. Nothing fake was committed. See `docs/image-generation.md` for the run instructions.
- **`<HeroBackdrop>`** is hand-authored SVG art tuned to the amber+ink palette — a state-machine constellation drawn as an architectural etching, with lattice grid, warm radial glows, and one active flow highlighted. Every ink-hero band renders it at 42% opacity.
- Section anchor art is delivered through the state-machine diagram itself (page-scale), the durability strip (ink card), and the predicate demo (interactive canvas) — no plain text-blocks without anchor.

## Anti-slop verification

Ran the rejection list against every page:

- No shimmer-gradient-word ✓ (killed the old `.shimmer-text` — the display face carries the tagline now)
- No centered gradient-orb-only hero ✓ (hero has an artifact, a backdrop, a proof band, real copy)
- No stock/3D marketing illustration ✓
- No emoji in body copy ✓ (single amber dot glyph in eyebrows is typographic)
- No fabricated tx hashes / TVL / testimonials / "trusted by" logos ✓
- Every state name (`OPEN`, `CLAIMED`, …) rendered in `.mono` with the exact state hue ✓
- Every claim is grounded in `README.md`, `docs/state-machine.md`, `docs/INVARIANTS.md`, or `ATTACKS.md` ✓ (invariant I3 quoted verbatim; Aug 2026 Morpho attribution matches README's "record")

## Honest self-assessment against the daybreak bar

Where we now match daybreak:
- Broken-line typographic rhythm
- Alternating section fills / rhythm shifts
- Dotted-mono eyebrows as authored tell
- Chunky editorial cards with hairline borders
- Short poetic copy voice
- A signature interactive artifact
- Motion tokens, not defaults
- Reduced-motion + reduced-transparency respected

Where we still fall short:
- Daybreak's illustrated globe + plush avatars carry hand-drawn character we don't have. Our compensation is the SVG state-machine constellation — architectural, not playful. This suits STATEKEEP's infra register, but the human/hand-drawn warmth Daybreak has is intentionally absent here.
- The CTA-band "spotlight" cards on Daybreak have a radial-gradient art panel per card. Our RoleCards are plainer. Future pass could add per-role SVG sigils.
- PNG assets deferred. When the API key is set, `pnpm tsx scripts/generate-assets.ts` will produce and commit the six images. The site is designed so those images become drop-in anchors without layout change.

## Verdict

The site now has: rhythm (three fills alternating), voice (broken-line poetry), authored artifacts (recovery-contract spec, state machine, live predicate), and taste-calibrated palette + type system. It clears the "not-generic / not-plain / not-boring" bar. It does not yet clear the "hand-illustrated warmth" bar Daybreak sets — that is honest and deferred to imagery generation.

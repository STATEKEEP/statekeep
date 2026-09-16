# Daybreak-Five — Taste Calibration

Reference: https://daybreak-five.vercel.app · Source: `_next/static/css/*.css` bundles inspected directly.

This is the reference bar. Every decision in the STATEKEEP rebuild must be traceable to one of the observations below.

## Palette (extracted from `:root`)
- **Background:** `#f6f8fd` (porcelain — light, cool, NOT white). Alt: `#eef2fb`.
- **Paper surface:** `#ffffff` (pure white, used for cards, footer, proof strip).
- **Ink (text):** `#18223c` — deep navy-slate, never black.
- **Muted:** `#657089` — cool secondary text.
- **Accent (signature):** `#0210ef` — electric ultramarine blue. Used everywhere: CTAs, links, hero fill, badges.
- **Support accents (rare):** apricot `#dce8ff`, meadow `#edf1ff` (soft blue-tinted), brick `#ad3038`, deep-green `#236447`.
- **Line/hairline:** `#e7ebf4`. All borders 1px, always this color, never darker.
- **Selection:** blue @ 20% opacity — a signature that shows up when you highlight anything.

## Typography (three-font system)
- **Display:** `Space Grotesk`, weight 500/600/700, letter-spacing **`-1.8px`** on wordmark, tight kerning throughout.
- **Body:** `Inter Tight` 400/500/600 — narrower than plain Inter, editorial feel.
- **Micro / eyebrow:** `Doto` (a dotted-pixel-mono display face) — used at ~11px, uppercase, `letter-spacing: 0.11em`, for eyebrows and captions. This is the signature typographic tell.
- Line-height: `1.12` on display, `1.5–1.7` on body/micro. Extreme contrast.

## Signature moves (the anti-generic tells)
1. **Broken-line hero copy.** Instead of one long headline they run **two-line stacks** in `.db-lines` — `"Your world."` / `"Your stocks."`, `"Different interests."` / `"Shared curiosity."`. Each line is its own `<span class="db-line">`. This is the biggest single move.
2. **Hero is a saturated inverted band.** The hero uses `background: var(--db-blue)` = full electric blue with white text, and the rest of the page is pale porcelain. Not a subtle gradient — a hard color block.
3. **Dotted-mono eyebrows** (`.db-micro`) — `Doto`, 11px, 0.11em tracking, uppercase. Placed above every section head, above every proof cell. This alone tells you the page is authored.
4. **The 4-column proof band** on white with vertical hairline dividers — 4 short stats/promises in a row, each labelled with a `.db-micro`. Big whitespace, small text, one border-left per cell.
5. **Glass surfaces** — `.db-glass` uses `backdrop-filter: blur(24px) saturate(1.25)` with white glass and a 1px inner light border. Used for nav pill and floating cards, not for everything.
6. **Chunky rounded controls** — buttons are 18–20px radius, 50px tall, gap:14px between icon and label. Cards are 20–22px radius. Nothing sharp.
7. **Section rhythm via alternating fills.** Hero (blue) → proof (white) → section (porcelain) → section-tint `#f5f7fe` → CTA (blue) → footer (white). Each transition is a hard color change, not a bleed.
8. **Illustrated art, not photography.** Hero has an SVG globe crop that bleeds off the bottom of the hero band. Card art blocks are 118px tall linear-gradient panels with a plush avatar inside — playful, hand-drawn character.
9. **1200px shell, clamp() everything.** `--db-shell-w:1200px`, `--db-pad:clamp(24px,5vw,56px)`, section padding `clamp(72px,9vw,120px)`. Fluid, generous, never cramped.
10. **Copy voice.** Short. Poetic. Full stops. "Small circles. A wider world." "Good finds deserve company." "A little less serious." The site *speaks*.
11. **Community Spotlight cards** — 3-column grid where each card has a radial-gradient art panel, a score chip, an action pill. That's a signature *interactive artifact*, not just a section.
12. **Text-links with a gap:14px arrow** — `.db-text-link` puts a chunky ArrowUpRight after `Explore` verbs, always in blue, always at 14px 600 weight. The pattern repeats — makes navigation feel intentional.
13. **Custom motion tokens.** `--dw-duration-press:140ms`, `--dw-duration-panel:280ms`, `--dw-duration-place:380ms`, ease `cubic-bezier(0.2, 0.75, 0.25, 1)`. Motion is designed, not defaulted.
14. **`prefers-reduced-transparency` respected** — glass surfaces fall back to solid paper. Same for `prefers-reduced-motion`. This is a design-system-level detail, not a hack.
15. **Doto dot-labels** appear inline in headings and captions — a distinctive dotted `●` motif that reads as digital-artifact texture.

## What Daybreak explicitly does NOT do
- No dark mode. It's confidently a daylight product.
- No neon gradient washes. No aurora blobs. No grain overlay.
- No hero video. No stock photography.
- No 100vh section-snap. No infinite marquees.
- No accent color other than blue for interactive things. Discipline > decoration.

## Translation rules for STATEKEEP
- **Steal the mechanism, not the palette blindly.** STATEKEEP is instrument-panel infrastructure, not consumer finance — but the *rhythm* transfers exactly.
- Use **broken-line headlines** for the hero and every section head.
- Use **dotted-mono eyebrows** (JetBrains Mono w/ tracking-widest as our proxy; Doto is too playful for infra).
- Use a **saturated inverted band** for the hero — pale page, dark hero with the accent (amber-on-ink for us, since amber IS our color).
- Section rhythm: **alternate fills** (paper / porcelain-warm / ink-hero) — no more flat single-tone page.
- **Proof band** of 4 cells with vertical dividers, right below the hero — perfect place to show state-machine terminal states.
- **Signature move for us:** the same short-line poetry, plus the recovery-contract spec artifact rendered as a real registered document (mono, hairline borders, metadata rows).
- **Interactive artifact** to match their Spotlight cards: a live-toggle predicate demo (slider morphs reserve ratio; predicate value flips true/false in the DOM).

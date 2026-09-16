# Diagnosis — Why the Old STATEKEEP Site Reads as Generic

Reading `app/page.tsx`, `app/how-it-works/page.tsx`, `app/docs/page.tsx`, `app/globals.css` on branch `web` at commit `6c53654`. Brutal honesty follows.

## Structural failures
1. **Flat single-tone page.** The entire site sits on one `--ink-950 #07080a` background. There is no rhythm shift between sections — hero, comparison, state machine, durability all live on the same near-black. Compare to Daybreak: five distinct fills across the page (blue hero, white proof, porcelain section, tinted section, blue CTA, white footer).
2. **Sections separated by `<Section>` padding only.** No color change, no fill contrast, no "chapter breaks." Every section is a ~800px vertical slab of same-colored cards. It scans as one long undifferentiated column.
3. **No proof band.** Daybreak's 4-column proof strip after the hero is the single strongest "this is a real product" tell. We have nothing equivalent — the user has to read three paragraphs before they see any structured claim.
4. **Every card is `bg-ink-900 border-border`.** Zero surface variation. Cards, tables, code blocks, FAQ items all render on the same elevated panel. There is no hierarchy of surfaces.

## Typographic failures
5. **System sans (Inter) doing everything.** No display face. `text-5xl md:text-7xl font-semibold tracking-tight` is the same treatment every "AI-generated dark hero" ships. Daybreak buys character with **Space Grotesk** + **Inter Tight** + a signature **Doto** mono. We use Inter + JetBrains — competent, uncharacterful.
6. **No broken-line hero.** Our hero is one wrapped paragraph: `Pay for reality. Not for calls.` runs as prose with a `<br />`. Daybreak splits every headline into standalone `<span class="db-line">` units — each line is its own artifact, its own rhythm beat. Our version reads as one thought; theirs reads as poetry.
7. **Shimmer-text gradient on "reality".** This is the single most templated move on the site — a rainbow-shimmer keyframe over one word. Every AI-generated landing page in 2024–2026 does this. It signals "generated" instantly.
8. **Body copy walls.** The hero paragraph is 58 words. The FAQ answers are 40–70-word blocks of prose. Daybreak's longest section paragraph is 22 words. Ours reads as documentation; theirs reads as a landing page.

## Palette failures
9. **Pure-near-black with one amber is the default dark-portfolio recipe.** #07080a bg + amber accent + Inter/JetBrains is the same stack as ~40% of hackathon submissions. It communicates "developer took an afternoon", not "designer thought about this."
10. **Amber accent used everywhere.** Amber-400 on the shimmer, on the CTA, on the eyebrow dot, on the state badges, on the divider rules, on the hover borders. When one color does *everything* it becomes wallpaper. Daybreak uses electric blue with discipline — CTAs and links only. Other accents (apricot, meadow, brick) appear once or twice as scene changes.
11. **No warm tint anywhere.** Even the "warm off-black" claim in the token file is fiction — #07080a is a flat cool-neutral. Daybreak's porcelain has a cool-blue cast that unifies the whole page. Our dark has no undertone.

## Motion failures
12. **`fade-up 0.6s` on load, and nothing else.** That's the entire motion budget. No hover states beyond color-swaps. No section-anchored transitions. No scroll-driven reveals. No interactive artifact anywhere. The `bloom` and `grid-bg` are static layers — decorative, not responsive.
13. **The state-machine SVG is small and inline, not art-directed.** Daybreak elevates their globe illustration to a 820px bleed-off-the-bottom feature. Our state machine sits inside a 1fr column of a 2-column grid, no more prominent than the sidebar next to it. The state machine IS the product — it should be page-hero-sized once.

## Copy failures
14. **"the distinction the whole design turns on"** — that phrase is doing the work of a photograph. Fine as a footnote, but it's used as an eyebrow, so it reads as filler where a term-of-art callout should be. Daybreak eyebrows are **nouns**: "The experience", "Our direction", "Community Spotlight". Ours are **sentences**.
15. **No pull-quote, no marginalia, no oversized numeral.** The invariant text `I3 · …` is the closest we get. Daybreak breaks copy with score chips, action pills, `live points` labels, footnote-style small notes. We break copy with more prose.

## Imagery failures
16. **No imagery at all.** The AGENTS build had a plan for six generated images and a `/api/generate` route, but nothing is committed and nothing renders. The result is a text-only page. Daybreak has a globe, avatars, plush characters, gradient art panels — every section has visual anchor. Ours has none.

## The one thing we got right
- **The recovery-contract spec artifact** (the mono block below the hero) IS the right instinct. It's a real object rendered as a real document. It stays. The rest of the page has to rise to meet it.

## Repair list (informs the rebuild)
- Add a display face (Space Grotesk or similar geometric-humanist).
- Introduce section-fill alternation: paper (warm off-white) / porcelain-warm / ink-hero — three fills, not one.
- Split every headline into broken-line stacks.
- Kill the shimmer keyframe on "reality" — replace with a serif italic or a hard color-block treatment.
- Add a 4-column proof band under the hero showing the four durability states.
- Build ONE signature interactive: a reserve-ratio slider that flips the predicate live.
- Elevate the state machine to a full-bleed art-directed feature (large, animated edges, terminal states styled distinctly).
- Cut hero prose from 58 words to under 20.
- Add authored SVG anchors per section (no fake stock photos, no fake screenshots).

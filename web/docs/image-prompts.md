# STATEKEEP — image prompt library

Six prompts for OpenAI `gpt-image-1`. Each follows the atomic-schema style borrowed from [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2) — `subject / lighting / materials / layout / typography / palette / negative`.

**Source of truth for code:** [`web/lib/image-prompts.ts`](../lib/image-prompts.ts). This markdown file is a human-readable mirror.

**Palette used in every prompt** (STATEKEEP tokens):
- Deep-ink background: `#07080a`
- Elevated: `#0b0d10`, `#161a20`
- Hairlines / borders: `#1f242c`
- Muted text: `#6b7481`, `#9aa3af`
- Primary text: `#e6e8ec`
- Amber accent: `#f4b942`
- Danger (used only in `delta-guard-attack`): `#ef6a6a`

**Universal rules** (baked into every prompt via the negative):
- No logos, no watermarks
- No readable text (the real HTML overlays the visual — abstract mono glyphs only)
- No photorealism, no 3D coins, no glossy crypto tropes
- No stock people, no isometric cities
- No rainbow gradients
- No fabricated tx hashes, TVL, testimonials, or product mockups

---

## 1 · `hero`

**Purpose.** Home hero background visual — subtle, sits behind the tagline.
**Size.** 1536×1024 (aspect 3:2).
**Borrowed from.** awesome-gpt-image-2 · UI / Editorial Poster template.

> Editorial dark-tech composition. Subject: a horizontal chain of eight small labeled cells connected by thin arrows, representing a state machine — cells drawn as flat rectangles with monospaced labels (leave labels blank / illegible so the site's real HTML overlays cleanly). Lighting: low-key, single warm amber rim-light from top-left, matte deep-ink `#07080a` background, faint 48px grid underlay at 3% opacity. Materials: matte paper, no gloss, no gradients on the cells themselves; one soft amber `#f4b942` bloom top-center at 8% opacity. Layout: cells arranged along the lower third, generous negative space above. Typography: monospaced but blurred / abstract — do not spell real words. Palette: strictly `#07080a`, `#0b0d10`, `#161a20`, `#6b7481`, `#e6e8ec`, `#f4b942` — no other colors. Aspect 3:2.

**Negative.** No logos, no photorealistic hardware, no gradients on background, no rainbow palette, no glossy 3D crypto coins, no readable text, no watermarks, no stock illustration people, no isometric city.

---

## 2 · `state-machine-infographic`

**Purpose.** Editorial infographic of the 8-state machine: OPEN → CLAIMED → PENDING → MATURED → PAID / FAILED → SLASHED / EXPIRED.
**Size.** 1536×1024 (aspect 3:2).
**Borrowed from.** awesome-gpt-image-2 · Infographic / Technical-diagram template.

> Editorial technical infographic on matte deep-ink `#07080a` background. Subject: an eight-node state-machine diagram drawn as a technical schematic — thin 1px hairlines, small labeled rectangular nodes, arrows with small arrowheads. Node labels (leave as abstract short mono glyphs, not readable words): eight nodes with three drawn slightly larger with a thin amber `#f4b942` outline (representing terminal states) and five drawn with a cool grey outline. Arrows: five solid grey, two dashed amber (representing atomic transitions). Layout: centered composition, node grid on a soft 24px underlay grid. Lighting: flat, diffuse, editorial — no drop shadows, no glow. Palette: `#07080a` background, `#1f242c` hairlines, `#9aa3af` secondary, `#e6e8ec` primary, one amber `#f4b942` accent. Feels like a page torn out of a hardware manual, not a marketing image. Aspect 3:2.

**Negative.** No glossy 3D, no isometric render, no color gradients, no rainbow arrows, no readable text, no marketing copy, no icons of coins or padlocks, no futuristic sci-fi elements.

---

## 3 · `pay-for-reality-poster`

**Purpose.** Editorial "Pay for reality. Not for calls." poster — used as OG image and a section separator.
**Size.** 1024×1536 (aspect 2:3, vertical portrait).
**Borrowed from.** awesome-gpt-image-2 · Poster / Editorial layout template.

> Editorial poster, vertical portrait. Deep-ink `#07080a` background with barely-visible 48px grid. Subject: two stacked minimal diagrams — top diagram shows a single arrow labeled with a blurred abstract glyph pointing into a dollar-sign shape drawn as a thin outline (representing "pay for the call"); bottom diagram shows three sequential rectangles (state, prove, pay) connected by arrows leading into a solid amber `#f4b942` filled circle (representing "pay for reality"). Between the two diagrams: a thin horizontal amber `#f4b942` hairline that spans the poster width. Typography: monospaced abstract glyphs only, not readable — the real headline is composited by the site. Materials: matte, no gloss. Lighting: even, editorial. Palette: strictly `#07080a`, `#161a20`, `#9aa3af`, `#e6e8ec`, `#f4b942`. Aspect 2:3.

**Negative.** No photorealism, no 3D coins, no glossy phones, no product mockups, no readable body text, no logos, no gradient sky, no marketing shine.

---

## 4 · `executor-market`

**Purpose.** Section illustration for the executor market — protocol / executor / chain trio.
**Size.** 1536×1024 (aspect 3:2).
**Borrowed from.** awesome-gpt-image-2 · Editorial three-panel diagram template.

> Three-panel editorial diagram on deep-ink `#07080a` background. Each panel is a thin-outlined rectangle. Left panel: a small stack of registered rules — thin horizontal lines representing entries — labeled abstractly (no readable text). Center panel: three overlapping small rectangles representing candidate executors, each holding a small filled square (representing a bond); one is tinted amber `#f4b942` (the current claimant). Right panel: a single dense grid — the chain — with one cell filled amber. Arrows connect left→center→right, drawn as thin 1px hairlines. Palette strictly `#07080a`, `#1f242c`, `#9aa3af`, `#e6e8ec`, `#f4b942`. Editorial, flat, no gloss, no drop shadow. Aspect 3:2.

**Negative.** No faces, no people illustrations, no glossy iconography, no rainbow accents, no readable text, no coin/token clipart, no isometric city.

---

## 5 · `delta-guard-attack`

**Purpose.** Section illustration for the delta-guard example — metric-swap attack rejected.
**Size.** 1536×1024 (aspect 3:2).
**Borrowed from.** awesome-gpt-image-2 · Data comparison / before-after template.

> Editorial before/after data comparison on deep-ink `#07080a`. Two side-by-side thin-outlined rectangles. Inside each: a small grid of four horizontal bars representing four protected balances, drawn as thin hairlines with abstract labels (not readable). Left rectangle labeled with an abstract mono glyph and shows all four bars balanced. Right rectangle: three bars sit at similar levels but one bar has been visibly reduced (drawn shorter) and is colored red `#ef6a6a` to indicate the protected surface was violated. An amber `#f4b942` hairline diagonal strike-through crosses the right rectangle, representing the predicate rejecting the transition. Palette strictly `#07080a`, `#1f242c`, `#9aa3af`, `#e6e8ec`, `#f4b942`, `#ef6a6a`. Editorial, flat. Aspect 3:2.

**Negative.** No gauges, no dashboards, no cartoon warnings, no photorealism, no readable text, no exclamation icons, no stock "hacker" imagery.

---

## 6 · `durability-window`

**Purpose.** Infographic of the 25 / 75 durability split across the maturity window.
**Size.** 1536×1024 (aspect 3:2).
**Borrowed from.** awesome-gpt-image-2 · Timeline / Gantt template.

> Editorial horizontal timeline on deep-ink `#07080a` background. A single wide horizontal bar spans 80% of the width, divided into two segments: a small left segment (approximately 25% width) filled amber `#f4b942`, and a large right segment (75% width) filled dark card grey `#161a20` with a thin amber outline. Above the bar, four vertical hairline tick marks with small labels (abstract mono glyphs, unreadable) — representing `t=0 · claim`, `t<M · pending`, `t=M · finalize`, `t=M · settle`. Below the bar, a thin dashed amber line loops from the right segment back to a small icon shaped like an X (representing slash on regression). Palette strictly `#07080a`, `#161a20`, `#9aa3af`, `#e6e8ec`, `#f4b942`. Flat, editorial, engineering-drawing feel. Aspect 3:2.

**Negative.** No coin imagery, no clocks with hands, no calendar UI, no gloss, no gradients on the bar, no photorealism, no readable text.

---

## Running them

```bash
cd web
export OPENAI_API_KEY=sk-...
pnpm dlx tsx scripts/generate-assets.ts             # generate all six
pnpm dlx tsx scripts/generate-assets.ts --id=hero   # one at a time
```

PNGs land in `web/public/generated/<id>.png`. The script refuses to run without a key and refuses to write payloads smaller than 10 KB (which is how gpt-image-1 signals a policy refusal). Nothing under `public/generated/` is committed unless it was generated by a real API call.

Alternatively, hit the server route from any client:

```bash
curl -X POST https://statekeep.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"id":"hero"}'
```

Returns 501 with a clean message if `OPENAI_API_KEY` is not set on the server.

# STATEKEEP web — design notes

Peroxide path: foundation → catalog → source → port → audit.

## Foundation

- Stack: Next.js 16 (App Router) · React 19 · Tailwind v4 · Framer Motion · TypeScript.
- Token source of truth: `app/globals.css` (`:root` custom properties, exposed to Tailwind via `@theme inline`).
- Palette: **dark editorial only.** One accent — amber `#f4b942`. No light mode. Justified: STATEKEEP is an instrument-panel product for on-chain state — this is not a consumer SaaS marketing site, and a dark editorial surface reads more like a specification than an ad.
- Type pairing: Inter (sans, prose) + JetBrains Mono (states, code, receipts). Monospace carries any word that names an on-chain state (`OPEN`, `CLAIMED`, `PENDING`, `MATURED`, `PAID`, `FAILED`, `SLASHED`, `EXPIRED`) — a house rule the eye learns after one section.
- Radius scale: 2 / 4 / 6 / 10 px. Small on purpose. Instrument-panel, not soft-UI.
- Ambient depth layer: faint 48px grid (`.grid-bg`) at 2.5% opacity behind content, plus one amber bloom (`.bloom`) behind the hero. No stock-photo textures.

Existing component to mirror: none — this is the first surface. The token file *is* the reference. Every subsequent component must import only tokens named above; the review gate is "does it introduce a new color?"

## Catalog picks (peroxide step 2)

**Hero / page pattern — `ui.shadcn.com/blocks` → the "docs / marketing" split hero.**
- URL: <https://ui.shadcn.com/blocks>
- Reason it beats alternatives: 21st.dev / shadcnblocks lean consumer-SaaS (gradient orbs, soft radii, giant illustration slots). The shadcn split hero is the only one whose density and typography read as *engineering documentation* out of the box — a tagline, one line of prose, two buttons, then immediately a code/spec artifact. That's what STATEKEEP has: a claim (`Pay for reality. Not for calls.`) and a state machine as the primary visual, not a product screenshot.
- We port the *shape* (spec-first, mono-for-artifact, two-action row) onto our tokens; we do not copy the palette.

**Animation primitive — `reactbits.dev` → text shimmer + `.fade-up` scroll-in.**
- URL: <https://www.reactbits.dev/text-animations>
- Reason: one confident text-shimmer on the tagline word "reality", plus a single stagger-fade for section entries. Aurora / marquee / typewriter would all be louder than the copy deserves. Shimmer is exactly one detail — it names the accent color and stops.

## Source → port

- Text-shimmer implemented directly in `globals.css` (`.shimmer-text` keyframes). No new package; the reactbits pattern is just a CSS gradient background-clipped to text. Attribution: <https://www.reactbits.dev/text-animations>.
- Split-hero + spec-card layout hand-ported into `app/page.tsx` using our tokens. Attribution: <https://ui.shadcn.com/blocks>.
- Zero new palette entries. Every color on the page is one of the tokens declared in `:root`.

## Reduced motion

`prefers-reduced-motion` disables shimmer and fade-up entirely — the layout is fully readable without any animation.

## Anti-slop checklist

- No centered hero with a giant gradient orb.
- No stock illustration or 3D shape.
- No emoji in body copy.
- No fabricated testimonials, tx hashes, TVL, or "trusted by" logos.
- Every state name uses the mono font, everywhere.
- Every claim on the site maps to a line in `README.md`, `THESIS.md`, or `docs/*.md`.

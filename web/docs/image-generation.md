# Image generation

STATEKEEP's editorial visuals are generated from an authored prompt library — not clip-art, not stock illustration, not "a hero image".

## Prompt library

Source of truth: [`web/lib/image-prompts.ts`](../lib/image-prompts.ts).

Every prompt follows the atomic-schema style borrowed from [awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2) — the schema is (subject / lighting / materials / layout / typography / palette / negative), expressed as a single dense prompt. Each entry documents which template from awesome-gpt-image-2 inspired it.

Current prompts:

| id | purpose | size |
|---|---|---|
| `hero` | Home hero background | 1536×1024 |
| `state-machine-infographic` | Editorial diagram of the 8-state machine | 1536×1024 |
| `pay-for-reality-poster` | Vertical editorial poster / OG card | 1024×1536 |
| `executor-market` | Section illustration: protocol → executor → chain | 1536×1024 |
| `delta-guard-attack` | Section illustration: metric-swap attack rejected | 1536×1024 |
| `durability-window` | Timeline infographic of the 25/75 split | 1536×1024 |

## Generating locally

```bash
cd web
export OPENAI_API_KEY=sk-...
pnpm dlx tsx scripts/generate-assets.ts
```

To render one prompt only:

```bash
pnpm dlx tsx scripts/generate-assets.ts --id=hero
```

The script writes PNGs to `web/public/generated/<id>.png`. It refuses to write anything if the response is smaller than 10KB (which is how OpenAI signals a policy refusal). It never writes placeholder images.

## Serving

Any client — or a curl one-liner — can also POST to the built-in API route:

```
POST /api/generate
{ "id": "hero" }
```

If `OPENAI_API_KEY` is not set, the route returns 501 with a clean message. It never fabricates.

## Honesty rule

Nothing under `public/generated/*.png` is committed to the repo unless a real API key generated it. If you see an empty `public/generated/` directory in a checkout, that is the correct state — either run the script yourself, or the site renders without images (the layout and copy stand alone).

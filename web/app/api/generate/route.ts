import { NextResponse } from "next/server";
import { PROMPTS, getPrompt } from "@/lib/image-prompts";

export const runtime = "nodejs";

/**
 * POST /api/generate
 * Body: { id: string }  — the prompt id from lib/image-prompts.ts
 *
 * Returns:
 *   200: { b64_json: string, prompt: ImagePrompt }
 *   400: { error }  bad id
 *   501: { error }  OPENAI_API_KEY not set — we do not fabricate images
 *   502: { error, upstream }  OpenAI call failed
 */
export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY not set on this server. Image generation is disabled. Set the env var and redeploy to enable /api/generate.",
      },
      { status: 501 },
    );
  }

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json(
      { error: "missing 'id' — must be one of: " + PROMPTS.map((p) => p.id).join(", ") },
      { status: 400 },
    );
  }

  const prompt = getPrompt(body.id);
  if (!prompt) {
    return NextResponse.json(
      { error: `unknown prompt id: ${body.id}` },
      { status: 400 },
    );
  }

  const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: prompt.prompt,
      size: prompt.size,
      n: 1,
    }),
  });

  if (!openaiRes.ok) {
    const text = await openaiRes.text().catch(() => "");
    return NextResponse.json(
      { error: "OpenAI images.generate failed", upstream: text.slice(0, 500), status: openaiRes.status },
      { status: 502 },
    );
  }

  const data = (await openaiRes.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
  };
  const first = data.data?.[0];
  if (!first?.b64_json && !first?.url) {
    return NextResponse.json(
      { error: "OpenAI returned no image payload" },
      { status: 502 },
    );
  }

  return NextResponse.json({ prompt, ...first });
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/generate",
    method: "POST",
    body: { id: "<prompt id>" },
    available: PROMPTS.map((p) => ({ id: p.id, purpose: p.purpose, size: p.size })),
  });
}

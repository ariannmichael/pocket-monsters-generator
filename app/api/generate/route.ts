import { NextResponse } from "next/server";

type Body = {
  words: string;
  background: "white" | "transparent";
}

const limiter = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, limit = 10, windowsMs = 60_000) {
  const now = Date.now();
  const entry = limiter.get(ip);

  if (!entry || now > entry.resetAt) {
    limiter.set(ip, { count: 1, resetAt: now + windowsMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) return { ok: false, remaining: 0 };

  entry.count += 1;
  limiter.set(ip, entry);
  return { ok: true, remaining: limit - entry.count };
}

function buildPrompt(wordsRaw: string, background: "white" | "transparent") {
  const words = wordsRaw
    .split(/[,+]/g)
    .map((w) => w.trim())
    .filter(Boolean)
    .slice(0, 5);

  const concept = words.join(", ");
  const backgroundLine =
    background === "transparent"
      ? "- transparent background; sprite only, no background fill"
      : "- plain white background behind the sprite";

  return `
    Design a pocket monster creature inspired by: ${concept}.

    STYLE (MUST FOLLOW — like Coromon or Pokémon from the Game Boy Advance era):
    - Classic GBA-era pixel art sprite: blocky, visible pixels, late-90s/early-2000s RPG look.
    - Strong black 1px outlines around the whole creature and every detail (hallmark of GBA sprites).
    - Limited color palette per area: a few shades per part (e.g. 2–3 greens, 2–3 accent colors), no gradients.
    - Cute/chibi proportions: relatively large head, expressive simple face (big eyes, small mouth), stubby limbs.
    - Slight 3/4 or isometric view, front-facing or slightly angled like in-game monster sprites.
    - Single centered character, clear readable silhouette, no motion blur, no background scenery.
    - Optional: one small pixel-art prop (e.g. leaf, item, tiny device) if it fits the creature; otherwise sprite only.
    - No text, no letters, no UI, no readable symbols. No particles, no glow, no extra effects.
    - ${backgroundLine}

    OUTPUT: One character sprite only, in the style of a GBA monster (e.g. Pokémon Ruby/Sapphire/Emerald or Coromon).
  `.trim();
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const rl = rateLimit(ip);
    if(!rl.ok) {
      return NextResponse.json(
        { error: "Rate limit hit. Try again in a minute." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as Body;
    const words = (body.words || "").trim();
    
    if (words.length < 3) {
      return NextResponse.json({ error: "Enter at least 3 characters." }, { status: 400 });
    }
    if (words.length > 80) {
      return NextResponse.json({ error: "Keep it under 80 characters." }, { status: 400 });
    }

    const prompt = buildPrompt(words, body.background ?? "white");
    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: FAL_KEY is not set." },
        { status: 500 }
      );
    }

    const falRes = await fetch("https://fal.run/fal-ai/nano-banana-2", {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        num_images: 1,
        output_format: "png",
        resolution: "1K",
        aspect_ratio: "1:1",
      }),
    });

    if (!falRes.ok) {
      const text = await falRes.text();
      return NextResponse.json(
        { error: "Image generation failed", details: text },
        { status: falRes.status >= 500 ? 502 : falRes.status }
      );
    }

    const falData = (await falRes.json()) as {
      images?: Array<{ url?: string }>;
    };
    const imageUrl = falData?.images?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: "No image returned." }, { status: 500 });
    }

    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch generated image." },
        { status: 502 }
      );
    }
    const imgBuffer = await imgRes.arrayBuffer();
    const imageBase64 = Buffer.from(imgBuffer).toString("base64");

    return NextResponse.json({
      imageBase64,
      promptUsed: prompt,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpect error", details: String(err?.message || err) },
      { status: 500 }
    )
  }
}

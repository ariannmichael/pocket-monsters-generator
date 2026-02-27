import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!rateLimit(ip, 20, 60_000).ok) {
      return NextResponse.json(
        { error: "Too many uploads. Try again in a minute." },
        { status: 429 },
      );
    }

    const body = (await req.json()) as { imageBase64?: string };
    const base64 = body.imageBase64;
    if (typeof base64 !== "string" || !base64) {
      return NextResponse.json(
        { error: "Missing imageBase64." },
        { status: 400 },
      );
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "Image sharing is not configured (BLOB_READ_WRITE_TOKEN)." },
        { status: 503 },
      );
    }

    const raw = base64.includes(",") ? base64.split(",")[1] : base64;
    const binary = Buffer.from(raw ?? "", "base64");
    if (binary.length === 0) {
      return NextResponse.json(
        { error: "Invalid image data." },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const blob = await put(`monsters/${id}.png`, binary, {
      access: "private",
      contentType: "image/png",
    });

    return NextResponse.json({ url: blob.url, id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to save image", details: message },
      { status: 500 },
    );
  }
}

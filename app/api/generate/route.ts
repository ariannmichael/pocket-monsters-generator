import { NextResponse } from "next/server";
import type { GenerateRequest } from "@/lib/types";
import { rateLimit } from "@/lib/rate-limit";
import { buildPrompt } from "@/lib/prompt";
import { generateImage, FalError } from "@/lib/fal-client";

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

    if (!rateLimit(ip).ok) {
      return NextResponse.json(
        { error: "Rate limit hit. Try again in a minute." },
        { status: 429 },
      );
    }

    const body = (await req.json()) as GenerateRequest;
    const words = (body.words || "").trim();

    if (words.length < 3) {
      return NextResponse.json(
        { error: "Enter at least 3 characters." },
        { status: 400 },
      );
    }
    if (words.length > 80) {
      return NextResponse.json(
        { error: "Keep it under 80 characters." },
        { status: 400 },
      );
    }

    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: FAL_KEY is not set." },
        { status: 500 },
      );
    }

    const prompt = buildPrompt(words, body.background ?? "white");
    const imageBase64 = await generateImage(prompt, falKey);

    return NextResponse.json({ imageBase64, promptUsed: prompt });
  } catch (err) {
    if (err instanceof FalError) {
      return NextResponse.json(
        { error: err.message, details: err.details },
        { status: err.statusCode },
      );
    }

    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Unexpected error", details: message },
      { status: 500 },
    );
  }
}

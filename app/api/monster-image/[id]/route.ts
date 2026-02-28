import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const blobUrl = process.env.KV_REST_API_URL
    ? ((await kv.get(`monster:${id}`)) as string | null)
    : null;

  if (!blobUrl) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.redirect(blobUrl, {
    status: 302,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

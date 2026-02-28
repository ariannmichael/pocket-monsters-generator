import { get } from "@vercel/blob";
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

  try {
    const result = await get(blobUrl, { access: "private" });
    if (!result || result.statusCode !== 200) {
      return new NextResponse(null, { status: 404 });
    }
    const { stream, blob } = result;
    return new NextResponse(stream, {
      headers: {
        "Content-Type": blob.contentType ?? "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": 'inline; filename="monster.png"',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}

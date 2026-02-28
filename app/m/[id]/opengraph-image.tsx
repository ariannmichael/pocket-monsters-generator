import { ImageResponse } from "next/og";
import { kv } from "@vercel/kv";
import { get } from "@vercel/blob";

export const alt = "Pocket Monster";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let spriteDataUrl: string | null = null;

  if (process.env.KV_REST_API_URL) {
    const blobUrl = (await kv.get(`monster:${id}`)) as string | null;
    if (blobUrl) {
      try {
        const result = await get(blobUrl, { access: "private" });
        if (result && result.statusCode === 200) {
          const reader = result.stream.getReader();
          const chunks: Uint8Array[] = [];
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
          }
          const buf = Buffer.concat(chunks);
          spriteDataUrl = `data:image/png;base64,${buf.toString("base64")}`;
        }
      } catch {
        // fall through to fallback
      }
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #262626 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          }}
        >
          {spriteDataUrl ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "repeating-conic-gradient(#3a3a3a 0% 25%, #2a2a2a 0% 50%) 50% / 24px 24px",
                borderRadius: 16,
                border: "4px solid #404040",
                padding: 24,
              }}
            >
              <img
                src={spriteDataUrl}
                alt=""
                width={320}
                height={320}
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 320,
                height: 320,
                borderRadius: 16,
                border: "4px solid #404040",
                background: "#1a1a1a",
                fontSize: 120,
              }}
            >
              ?
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 36,
                color: "#fafafa",
                fontWeight: 700,
              }}
            >
              Pocket Monster
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#737373",
                fontWeight: 400,
              }}
            >
              pocket-monster-generator.com
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

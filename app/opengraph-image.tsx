import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Pocket Monster Generator – GBA-style pixel sprite maker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const spriteBuffer = await readFile(
    join(process.cwd(), "public", "character_down_walk_1.png"),
  );
  const spriteDataUrl = `data:image/png;base64,${spriteBuffer.toString("base64")}`;

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
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <img
            src={spriteDataUrl}
            alt=""
            width={200}
            height={200}
            style={{
              imageRendering: "pixelated",
              borderRadius: 12,
              border: "4px solid #404040",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: "-0.02em",
              }}
            >
              Pocket Monster Generator
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#a3a3a3",
                maxWidth: 420,
              }}
            >
              GBA-style pixel sprite maker – generate monsters from 2–5 words
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

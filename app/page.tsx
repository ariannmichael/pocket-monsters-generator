"use client"

import Image from "next/image";
import { useMemo, useState } from "react";

export default function Home() {
  const [words, setWords] = useState<string>("coding + leaf + frog");
  const [background, setBackground] = useState<"white" | "transparent">("white");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [promptUsed, setPromptUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dataUrl = useMemo(() => {
    if (!imageBase64) return null;
    return `data:image/png;base64,${imageBase64}`;
  }, [imageBase64]);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setImageBase64(null);
    setPromptUsed(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words, background }),
      });

      const text = await res.text();
      let json: { error?: string; imageBase64?: string; promptUsed?: string };
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(res.ok ? "Invalid response from server" : "Something went wrong");
      }
      if (!res.ok) {
        throw new Error(json.error || "Something went wrong");
      }

      setImageBase64(json.imageBase64 ?? null);
      setPromptUsed(json.promptUsed ?? null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  function onDownload() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "pocket-monster.png";
    a.click();
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Pocket Monster Generator</h1>
      <p style={{ opacity: 0.75, marginBottom: 20 }}>
        Enter 2–5 words. Output is forced into a GBA-era pixel sprite style.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={words}
          onChange={(e) => setWords(e.target.value)}
          placeholder="e.g. volcano + turtle"
          style={{ flex: "1 1 420px", padding: 12, fontSize: 16 }}
        />

        <select value={background} onChange={(e) => setBackground(e.target.value as "white" | "transparent")} style={{ padding: 12 }}>
          <option value="white">White background</option>
          <option value="transparent">Transparent background</option>
        </select>

        <button
          onClick={onGenerate}
          disabled={loading}
          style={{ padding: "12px 16px", fontSize: 16, cursor: "pointer" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 16, color: "crimson" }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Preview</h2>

          {dataUrl ? (
            <>
              <div
                style={{
                  background: background === "white" ? "#fff" : "repeating-conic-gradient(#eee 0% 25%, #ddd 0% 50%) 50% / 20px 20px",
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 360,
                  border: "1px solid #eee",
                }}
              >
                {/* Display “sprite scaled up” */}
                <Image
                  width={256}
                  height={256}
                  src={dataUrl}
                  alt="Generated sprite"
                  style={{
                    imageRendering: "pixelated",
                    width: 256,
                    height: 256,
                    borderRadius: 12,
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <button onClick={onDownload} style={{ padding: "10px 12px", cursor: "pointer" }}>
                  Download PNG
                </button>
                <button onClick={onGenerate} style={{ padding: "10px 12px", cursor: "pointer" }}>
                  Generate variation
                </button>
              </div>
            </>
          ) : (
            <div style={{ opacity: 0.7, padding: "24px 0" }}>No image yet.</div>
          )}
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Prompt (debug)</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.85 }}>
            {promptUsed || "Generate an image to see the prompt used."}
          </pre>
        </div>
      </div>
    </main>
  )
}
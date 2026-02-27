"use client";

import { useCallback, useMemo, useState } from "react";
import type { Background, GenerateResponse } from "@/lib/types";

interface GenerateState {
  loading: boolean;
  imageBase64: string | null;
  promptUsed: string | null;
  error: string | null;
  dataUrl: string | null;
}

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [promptUsed, setPromptUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dataUrl = useMemo(
    () => (imageBase64 ? `data:image/png;base64,${imageBase64}` : null),
    [imageBase64],
  );

  const generate = useCallback(async (words: string, background: Background) => {
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
      let json: Partial<GenerateResponse> & { error?: string };
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          res.ok ? "Invalid response from server" : "Something went wrong",
        );
      }

      if (!res.ok) {
        throw new Error(json.error || "Something went wrong");
      }

      setImageBase64(json.imageBase64 ?? null);
      setPromptUsed(json.promptUsed ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const download = useCallback(() => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "pocket-monster.png";
    a.click();
  }, [dataUrl]);

  const state: GenerateState = { loading, imageBase64, promptUsed, error, dataUrl };

  return { ...state, generate, download };
}

"use client";

import { useState } from "react";
import type { Background } from "@/lib/types";
import { useGenerate } from "@/hooks/use-generate";
import { GeneratorForm } from "@/components/generator-form";
import { PreviewCard } from "@/components/preview-card";

export default function Home() {
  const [words, setWords] = useState("bird + boxe + old school");
  const [background, setBackground] = useState<Background>("white");

  const { loading, dataUrl, error, generate, download } = useGenerate();

  function handleGenerate() {
    generate(words, background);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <main className="w-full max-w-3xl rounded-2xl bg-zinc-900 px-6 py-10 shadow-2xl ring-1 ring-zinc-800 md:px-8">
        <header className="mb-8">
        <h1
          className="font-pixel text-4xl font-normal leading-relaxed tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.45),0_0_20px_rgba(34,211,238,0.2),0_0_40px_rgba(139,92,246,0.15),0_0_60px_rgba(217,70,239,0.1)] md:text-5xl"
        >
          Pocket Monster Generator
        </h1>
        <p className="mt-2 text-zinc-400">
          Enter 2-5 words separated by commas or plus signs. Output is forced
          into a GBA-era pixel sprite style.
        </p>
      </header>

      <GeneratorForm
        words={words}
        background={background}
        loading={loading}
        onWordsChange={setWords}
        onBackgroundChange={setBackground}
        onGenerate={handleGenerate}
      />

      {error && (
        <p className="mt-4 text-sm font-medium text-error">{error}</p>
      )}

      <div className="mt-8">
        <PreviewCard
          dataUrl={dataUrl}
          background={background}
          loading={loading}
          onDownload={download}
          onRegenerate={handleGenerate}
        />
      </div>
      </main>
    </div>
  );
}

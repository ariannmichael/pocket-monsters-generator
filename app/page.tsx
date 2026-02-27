"use client";

import { useState } from "react";
import type { Background } from "@/lib/types";
import { useGenerate } from "@/hooks/use-generate";
import { GeneratorForm } from "@/components/generator-form";
import { PreviewCard } from "@/components/preview-card";
import { PromptDebug } from "@/components/prompt-debug";

export default function Home() {
  const [words, setWords] = useState("coding + leaf + frog");
  const [background, setBackground] = useState<Background>("white");

  const { loading, dataUrl, promptUsed, error, generate, download } = useGenerate();

  function handleGenerate() {
    generate(words, background);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Pocket Monster Generator
        </h1>
        <p className="mt-2 text-text-muted">
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

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <PreviewCard
          dataUrl={dataUrl}
          background={background}
          loading={loading}
          onDownload={download}
          onRegenerate={handleGenerate}
        />
        <PromptDebug promptUsed={promptUsed} />
      </div>
    </main>
  );
}

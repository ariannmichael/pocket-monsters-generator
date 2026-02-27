"use client";

import type { Background } from "@/lib/types";
import { LoadingSprite } from "@/components/loading-sprite";

interface GeneratorFormProps {
  words: string;
  background: Background;
  loading: boolean;
  onWordsChange: (words: string) => void;
  onBackgroundChange: (bg: Background) => void;
  onGenerate: () => void;
}

export function GeneratorForm({
  words,
  background,
  loading,
  onWordsChange,
  onBackgroundChange,
  onGenerate,
}: GeneratorFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onGenerate();
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <input
        value={words}
        onChange={(e) => onWordsChange(e.target.value)}
        placeholder="e.g. volcano + turtle"
        className="min-w-0 flex-1 basis-80 rounded-lg border border-border bg-surface px-4 py-3 text-base
                   text-text outline-none transition-colors placeholder:text-text-muted
                   focus:border-primary focus:ring-2 focus:ring-primary/25"
      />

      <select
        value={background}
        onChange={(e) => onBackgroundChange(e.target.value as Background)}
        className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text outline-none
                   transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25"
      >
        <option value="white">White background</option>
        <option value="transparent">Transparent background</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-base font-medium text-white transition-colors
                   hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <LoadingSprite size={20} />
            Generating...
          </>
        ) : (
          "Generate"
        )}
      </button>
    </form>
  );
}

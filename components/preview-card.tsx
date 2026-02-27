"use client";

import type { Background } from "@/lib/types";
import { LoadingSprite } from "@/components/loading-sprite";

interface PreviewCardProps {
  dataUrl: string | null;
  background: Background;
  loading: boolean;
  onDownload: () => void;
  onRegenerate: () => void;
}

const CHECKER_BG =
  "repeating-conic-gradient(#d4d4d4 0% 25%, #e5e5e5 0% 50%) 50% / 20px 20px";

export function PreviewCard({
  dataUrl,
  background,
  loading,
  onDownload,
  onRegenerate,
}: PreviewCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
        Preview
      </h2>

      {dataUrl ? (
        <>
          <div
            className="flex min-h-[360px] items-center justify-center rounded-lg border border-border p-4"
            style={{
              background: background === "white" ? "#ffffff" : CHECKER_BG,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt="Generated sprite"
              width={256}
              height={256}
              className="rounded-lg"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          <div className="mt-3 flex gap-3">
            <button
              onClick={onDownload}
              className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium
                         text-text transition-colors hover:bg-border"
            >
              Download PNG
            </button>
            <button
              onClick={onRegenerate}
              disabled={loading}
              className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium
                         text-text transition-colors hover:bg-border disabled:opacity-50"
            >
              Generate variation
            </button>
          </div>
        </>
      ) : (
        <div className="py-6">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-sm text-text-muted">
              <LoadingSprite />
              <p>Generating your monster...</p>
            </div>
          ) : (
            <p className="text-sm text-text-muted">No image yet. Hit Generate to start.</p>
          )}
        </div>
      )}
    </div>
  );
}

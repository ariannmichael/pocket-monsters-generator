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

const SHARE_TEXT = "Check out my Pocket Monster!";

function getShareTextWithUrl(): string {
  const url = typeof window !== "undefined" ? window.location.href : "";
  return url ? `${SHARE_TEXT} ${url}` : SHARE_TEXT;
}

function openTwitterShare(): void {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareTextWithUrl())}`,
    "_blank",
    "noopener,noreferrer",
  );
}

function openWhatsAppShare(): void {
  window.open(
    `https://wa.me/?text=${encodeURIComponent(getShareTextWithUrl())}`,
    "_blank",
    "noopener,noreferrer",
  );
}

function downloadImage(dataUrl: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = "pocket-monster.png";
  a.click();
}

/** Convert a data URL to a File (no fetch – works everywhere). */
function dataUrlToFile(dataUrl: string, filename: string): File {
  const [, base64] = dataUrl.split(",", 2);
  const mime = "image/png";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

/** Share image via Web Share API when supported; returns true if shared. */
async function shareWithImage(dataUrl: string): Promise<boolean> {
  if (!navigator.share) return false;
  const file = dataUrlToFile(dataUrl, "pocket-monster.png");
  if (navigator.canShare && !navigator.canShare({ files: [file] })) return false;
  try {
    await navigator.share({
      files: [file],
      title: "Pocket Monster",
      text: getShareTextWithUrl(),
    });
    return true;
  } catch {
    return false;
  }
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

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

          <div className="mt-3 flex flex-wrap gap-3">
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

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-text-muted">Share:</span>
            <button
              type="button"
              onClick={async () => {
                if (!dataUrl) return;
                const shared = await shareWithImage(dataUrl);
                if (!shared) openTwitterShare();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-border"
              title="Share on X (Twitter)"
            >
              <XIcon className="h-4 w-4" />
              X
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!dataUrl) return;
                const shared = await shareWithImage(dataUrl);
                if (!shared) openWhatsAppShare();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-border"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!dataUrl) return;
                const shared = await shareWithImage(dataUrl);
                if (!shared) downloadImage(dataUrl);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-border"
              title="Share on Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
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

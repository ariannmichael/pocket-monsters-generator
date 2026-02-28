/**
 * Canonical base URL for the site (no trailing slash).
 * Used for metadataBase, og:image, and share links so crawlers get absolute URLs.
 */
export function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

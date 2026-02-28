/**
 * Canonical base URL for the site (no trailing slash).
 * Used for metadataBase, og:image, and share links so crawlers get absolute URLs.
 *
 * Priority: explicit env > Vercel production domain > Vercel deployment URL > localhost.
 * VERCEL_PROJECT_PRODUCTION_URL is preferred over VERCEL_URL because the latter
 * resolves to a preview-deployment hostname that returns 401 to unauthenticated
 * callers (social-media crawlers), breaking og:image fetches.
 */
export function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

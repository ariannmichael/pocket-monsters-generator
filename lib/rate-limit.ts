import type { RateLimitResult } from "./types";

const store = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60_000;

export function rateLimit(
  ip: string,
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count };
}

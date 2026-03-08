# Pocket Monster Generator

Generate GBA-era pixel art monster sprites from simple word prompts — inspired by Pokémon Ruby/Sapphire/Emerald and Coromon.

## Getting Started

1. Copy `.env.example` to `.env` and add your [fal.ai](https://fal.ai) API key:

   ```
   FAL_KEY=your-key-here
   ```

2. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## How It Works

Enter 2-5 words separated by commas or plus signs (e.g. `volcano + turtle`), pick a background, and hit **Generate**. The app sends a crafted prompt to fal.ai's image model and returns a pixel-art sprite.

## Features

- **Pixel art generation** — GBA-style sprites via fal.ai (nano-banana-2) with a custom prompt builder
- **Shareable links** — save a monster to `/m/[id]` with a unique short URL (requires Vercel Blob + KV)
- **Social sharing** — share to X (Twitter), WhatsApp, and Instagram with Web Share API fallback
- **Open Graph previews** — dynamic OG images so shared links look great on social platforms
- **Animated background** — scrolling monster sprites for a retro feel
- **Loading sprite** — animated character walk cycle while generating
- **Download** — save the generated sprite as a PNG
- **Dark mode** — follows system preference
- **Google AdSense** — optional ad units, gated by environment variables (only on content pages; see [AdSense program policies](https://support.google.com/adsense/answer/48182))
- **Analytics** — Vercel Analytics for page-view tracking
- **Rate limiting** — 10 req/min for generation, 20 req/min for image saving (per IP)

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** for styling
- **fal.ai** (nano-banana-2) for image generation
- **@vercel/blob** for persistent image storage
- **@vercel/kv** (Upstash Redis) for short-URL mapping
- **@vercel/analytics** for web analytics

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `FAL_KEY` | Yes | fal.ai API key |
| `BLOB_READ_WRITE_TOKEN` | No | Vercel Blob token — enables shareable image URLs |
| `KV_REST_API_URL` | No | Upstash Redis URL — enables `/m/[id]` share links |
| `KV_REST_API_TOKEN` | No | Upstash Redis token |
| `NEXT_PUBLIC_APP_URL` | No | Canonical URL for OG tags (defaults to `VERCEL_URL`) |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | No | Google AdSense publisher ID (script loads only when set) |
| `NEXT_PUBLIC_ADSENSE_SLOT` | No | Google AdSense ad-unit slot ID |

**AdSense policy:** Ads are shown only on the main generator page (substantial content). They are not shown on shared monster pages (`/m/[id]`), error/404, or navigation-only screens, per [AdSense program policies](https://support.google.com/adsense/answer/48182).
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Google site-verification code |

## Project Structure

```
app/
  layout.tsx                  Root layout, metadata, analytics, background
  page.tsx                    Main generator page
  globals.css                 Tailwind imports, CSS variables, animations
  opengraph-image.tsx         Dynamic Open Graph image generation
  api/generate/
    route.ts                  POST — validate input, build prompt, call fal.ai
  api/save-image/
    route.ts                  POST — upload sprite to Vercel Blob, store ID in KV
  api/monster-image/[id]/
    route.ts                  GET — redirect to blob URL for a shared monster
  m/[id]/
    page.tsx                  Shareable monster page with OG metadata
components/
  generator-form.tsx          Word input, background picker, submit button
  preview-card.tsx            Sprite preview, download, share actions
  prompt-debug.tsx            Debug view of the prompt sent to fal.ai
  ad-unit.tsx                 Google AdSense ad component
  monster-scroll-background.tsx  Animated scrolling monster sprite rows
  loading-sprite.tsx          Animated loading sprite (character walk cycle)
hooks/
  use-generate.ts             Client-side generation state + API call logic
lib/
  types.ts                    Shared TypeScript types
  prompt.ts                   Prompt builder for GBA-style sprites
  rate-limit.ts               In-memory rate limiter
  fal-client.ts               fal.ai API wrapper with error handling
  site-url.ts                 Base URL resolution utility
```

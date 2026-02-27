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

## Tech Stack

- **Next.js** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** for styling
- **fal.ai** (nano-banana-2) for image generation
- In-memory rate limiting (10 req/min per IP)

## Project Structure

```
app/
  layout.tsx          Root layout with Geist font + global styles
  page.tsx            Main page composing UI components
  globals.css         Tailwind imports + CSS custom properties
  api/generate/
    route.ts          POST endpoint — validates, builds prompt, calls fal.ai
components/
  generator-form.tsx  Input form (words, background, submit)
  preview-card.tsx    Generated image preview + download
  prompt-debug.tsx    Debug view of the prompt sent to fal.ai
hooks/
  use-generate.ts     Client-side generation state + API call logic
lib/
  types.ts            Shared TypeScript types
  prompt.ts           Prompt builder for GBA-style sprites
  rate-limit.ts       In-memory rate limiter
  fal-client.ts       fal.ai API wrapper
```

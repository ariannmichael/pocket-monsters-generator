import type { Background } from "./types";

const MAX_WORDS = 5;

export function parseWords(raw: string): string[] {
  return raw
    .split(/[,+]/g)
    .map((w) => w.trim())
    .filter(Boolean)
    .slice(0, MAX_WORDS);
}

export function buildPrompt(wordsRaw: string, background: Background): string {
  const concept = parseWords(wordsRaw).join(", ");

  const backgroundLine =
    background === "transparent"
      ? "- transparent background; sprite only, no background fill"
      : "- plain white background behind the sprite";

  return `
Design a pocket monster creature inspired by: ${concept}.

STYLE (MUST FOLLOW — like Coromon or Pokémon from the Game Boy Advance era):
- Classic GBA-era pixel art sprite: blocky, visible pixels, late-90s/early-2000s RPG look.
- Strong black 1px outlines around the whole creature and every detail (hallmark of GBA sprites).
- Limited color palette per area: a few shades per part (e.g. 2–3 greens, 2–3 accent colors), no gradients.
- Cute/chibi proportions: relatively large head, expressive simple face (big eyes, small mouth), stubby limbs.
- Slight 3/4 or isometric view, front-facing or slightly angled like in-game monster sprites.
- Single centered character, clear readable silhouette, no motion blur, no background scenery.
- Optional: one small pixel-art prop (e.g. leaf, item, tiny device) if it fits the creature; otherwise sprite only.
- No text, no letters, no UI, no readable symbols. No particles, no glow, no extra effects.
- ${backgroundLine}

OUTPUT: One character sprite only, in the style of a GBA monster (e.g. Pokémon Ruby/Sapphire/Emerald or Coromon).
  `.trim();
}

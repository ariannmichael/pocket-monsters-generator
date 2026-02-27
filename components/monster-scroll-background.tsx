"use client";

const MONSTER_IMAGES = [
  "/monsters/pocket-monster (1).png",
  "/monsters/pocket-monster (2).png",
  "/monsters/pocket-monster (3).png",
  "/monsters/pocket-monster (4).png",
  "/monsters/pocket-monster (5).png",
  "/monsters/pocket-monster (6).png",
  "/monsters/pocket-monster (7).png",
  "/monsters/pocket-monster (8).png",
  "/monsters/pocket-monster (9).png",
  "/monsters/pocket-monster (10).png",
  "/monsters/pocket-monster (11).png",
  "/monsters/pocket-monster (12).png",
  "/monsters/pocket-monster (13).png",
];

export function MonsterScrollBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex flex-col items-center justify-center gap-8 overflow-hidden"
      aria-hidden
    >
      {/* Row 1: scroll right-to-left */}
      <div className="w-full shrink-0 overflow-hidden">
        <div className="monster-scroll-track monster-scroll-rtl flex w-max shrink-0 gap-6">
          {[...MONSTER_IMAGES, ...MONSTER_IMAGES].map((src, i) => (
            <img
              key={`r1-${i}`}
              src={src}
              alt=""
              className="h-20 w-auto shrink-0 object-contain opacity-40 [image-rendering:pixelated] sm:h-24 md:h-28"
            />
          ))}
        </div>
      </div>

      {/* Row 2: scroll left-to-right */}
      <div className="w-full shrink-0 overflow-hidden">
        <div className="monster-scroll-track monster-scroll-ltr flex w-max shrink-0 gap-6">
          {[...MONSTER_IMAGES, ...MONSTER_IMAGES].map((src, i) => (
            <img
              key={`r2-${i}`}
              src={src}
              alt=""
              className="h-20 w-auto shrink-0 object-contain opacity-40 [image-rendering:pixelated] sm:h-24 md:h-28"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

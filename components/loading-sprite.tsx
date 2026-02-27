"use client";

import { useState, useEffect } from "react";

const FRAME_1 = "/character_down_walk_1.png";
const FRAME_2 = "/character_down_walk_2.png";
const INTERVAL_MS = 300;

export function LoadingSprite({ size = 64 }: { size?: number }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f === 0 ? 1 : 0));
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative inline-block flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Both images loaded once; we only toggle opacity so no extra requests */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FRAME_1}
        alt=""
        width={size}
        height={size}
        className="absolute inset-0 block h-full w-full object-contain"
        style={{
          imageRendering: "pixelated",
          opacity: frame === 0 ? 1 : 0,
          pointerEvents: "none",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FRAME_2}
        alt=""
        width={size}
        height={size}
        className="absolute inset-0 block h-full w-full object-contain"
        style={{
          imageRendering: "pixelated",
          opacity: frame === 1 ? 1 : 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical";

type AdUnitProps = {
  /** Ad slot ID from your AdSense account (e.g. "1234567890") */
  slot: string;
  /** Ad format; "auto" lets AdSense choose. */
  format?: AdFormat;
  /** Optional className for the wrapper. */
  className?: string;
};

/**
 * Renders a single Google AdSense unit. Only renders when
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID is set. Uses the global adsbygoogle script
 * injected by the root layout.
 */
export function AdUnit({ slot, format = "auto", className }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!clientId || pushed.current) return;

    const run = () => {
      try {
        if (typeof window === "undefined" || !insRef.current) return;
        // Queue exists when the async script runs; create it so push() queues until script loads
        const q = (window.adsbygoogle = window.adsbygoogle || []);
        if (Array.isArray(q)) {
          q.push({});
          pushed.current = true;
        }
      } catch {
        // Ad blockers may break adsbygoogle
      }
    };

    run();
    // Retry a few times in case script hasn't created the queue yet
    const t1 = setTimeout(run, 300);
    const t2 = setTimeout(run, 1000);
    const t3 = setTimeout(run, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!clientId || !slot) return null;

  return (
    <aside
      className={className}
      aria-label="Advertisement"
    >
      <ins
        ref={insRef}
        className="adsbygoogle block"
        data-ad-client={clientId.startsWith("ca-pub-") ? clientId : `ca-pub-${clientId}`}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        style={{ display: "block", minHeight: format === "rectangle" ? 250 : 90 }}
      />
    </aside>
  );
}

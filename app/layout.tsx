import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/site-url";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { MonsterScrollBackground } from "@/components/monster-scroll-background";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Pocket Monster Generator – GBA-style pixel sprite maker",
    template: "%s | Pocket Monster Generator",
  },
  description:
    "Generate GBA-era pixel sprite monsters from 2–5 words. Free online tool to create retro pixel art creatures in classic Game Boy Advance style.",
  keywords: [
    "pocket monster",
    "pixel art",
    "sprite generator",
    "GBA",
    "pixel sprite",
    "monster generator",
    "retro game art",
    "pixel art generator",
    "pokemon",
    "coromon",
    "digimon"
  ],
  authors: [{ name: "Ariann Michael", url: "https://github.com/ariann" }],
  creator: "Ariann Michael",
  applicationName: "Pocket Monster Generator",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/character_down_walk_1.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Pocket Monster Generator",
    title: "Pocket Monster Generator – GBA-style pixel sprite maker",
    description:
      "Generate GBA-era pixel sprite monsters from 2–5 words. Free online tool for retro pixel art creatures.",
    images: [
      {
        url: `${baseUrl}/character_down_walk_1.png`,
        width: 256,
        height: 256,
        alt: "Pocket Monster Generator – pixel sprite icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pocket Monster Generator – GBA-style pixel sprite maker",
    description:
      "Generate GBA-era pixel sprite monsters from 2–5 words. Free online tool for retro pixel art creatures.",
    images: [`${baseUrl}/character_down_walk_1.png`],
  },
  ...(googleVerification && {
    verification: { google: googleVerification },
  }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pocket Monster Generator",
    description:
      "Generate GBA-era pixel sprite monsters from 2–5 words. Free online tool to create retro pixel art creatures.",
    url: baseUrl,
    applicationCategory: "GameApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3370565214003746"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-bg text-text antialiased" suppressHydrationWarning>
        <MonsterScrollBackground />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { MonsterScrollBackground } from "@/components/monster-scroll-background";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Pocket Monster Generator",
  description: "Generate GBA-era pixel sprite monsters from 2-5 words.",
  icons: {
    icon: "/character_down_walk_1.png",
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3370565214003746"
      crossOrigin="anonymous"></script>
      </head>
      <body className="bg-bg text-text antialiased" suppressHydrationWarning>
        <MonsterScrollBackground />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}

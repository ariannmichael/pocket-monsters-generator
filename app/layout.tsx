import type { Metadata } from "next";
import "./globals.css";
import { MonsterScrollBackground } from "@/components/monster-scroll-background";

export const metadata: Metadata = {
  title: "Pocket Monster Generator",
  description: "Generate GBA-era pixel sprite monsters from 2-5 words.",
  icons: {
    icon: "/character_down_walk_1.png",
  },
};

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const adsenseClientParam = adsenseClientId
  ? adsenseClientId.startsWith("ca-pub-")
    ? adsenseClientId
    : `ca-pub-${adsenseClientId}`
  : null;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {adsenseClientParam && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientParam}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="bg-bg text-text antialiased" suppressHydrationWarning>
        <MonsterScrollBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

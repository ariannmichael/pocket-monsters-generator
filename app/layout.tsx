import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { MonsterScrollBackground } from "@/components/monster-scroll-background";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  title: "Pocket Monster Generator",
  description: "Generate GBA-era pixel sprite monsters from 2-5 words.",
  icons: {
    icon: "/character_down_walk_1.png",
  },
  ...(googleVerification && {
    verification: { google: googleVerification },
  }),
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
          <>
            <meta name="google-adsense-account" content={adsenseClientParam} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientParam}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body className="bg-bg text-text antialiased" suppressHydrationWarning>
        <MonsterScrollBackground />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}

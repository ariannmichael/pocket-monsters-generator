import type { Metadata } from "next";
import "./globals.css";
import { MonsterScrollBackground } from "@/components/monster-scroll-background";

export const metadata: Metadata = {
  title: "Pocket Monster Generator",
  description: "Generate GBA-era pixel sprite monsters from 2-5 words.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-text antialiased" suppressHydrationWarning>
        <MonsterScrollBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

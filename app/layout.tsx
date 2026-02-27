import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter_Tight({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "STATEKEEP — Pay for reality. Not for calls.",
  description:
    "A protocol declares what healthy means and how it may be repaired. STATEKEEP settles on the resulting on-chain state, held across a durability window, reconciled against the whole protected surface. Built for Solana.",
  metadataBase: new URL("https://statekeep.vercel.app"),
  openGraph: {
    title: "STATEKEEP — Pay for reality. Not for calls.",
    description:
      "Self-healing protocols without trusting the healer. The chain decides settlement.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STATEKEEP — Pay for reality. Not for calls.",
    description: "Self-healing protocols on Solana. Settle on the result, not the call.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable} ${jetbrains.variable} antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "STATEKEEP — Pay for reality. Not for calls.",
  description:
    "Protocols become self-healing without trusting the healer. STATEKEEP settles on the resulting on-chain state, not on the fact that a function was called. Built for Solana.",
  metadataBase: new URL("https://statekeep.io"),
  openGraph: {
    title: "STATEKEEP — Pay for reality. Not for calls.",
    description:
      "Self-healing protocols on Solana. The chain decides settlement.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STATEKEEP — Pay for reality. Not for calls.",
    description: "Self-healing protocols on Solana.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

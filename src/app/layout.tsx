import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import AIFloatingAssistant from "@/components/AIFloatingAssistant";

export const metadata: Metadata = {
  title: "PulseBridge.ai - AI Marketing Intelligence",
  description: "Autonomous Marketing Intelligence Platform - Bridge the gap between strategy and execution with AI-powered precision.",
  keywords: "AI marketing, marketing automation, campaign optimization, PulseBridge, marketing intelligence",
  authors: [{ name: "PulseBridge.ai" }],
  creator: "PulseBridge.ai",
  publisher: "PulseBridge.ai",
  openGraph: {
    title: "PulseBridge.ai - AI Marketing Intelligence",
    description: "Autonomous Marketing Intelligence Platform - Bridge the gap between strategy and execution with AI-powered precision.",
    url: "https://pulsebridge.ai",
    siteName: "PulseBridge.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseBridge.ai - AI Marketing Intelligence",
    description: "Autonomous Marketing Intelligence Platform - Bridge the gap between strategy and execution with AI-powered precision.",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
  },
};

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${exo2.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientProviders>
          {children}
          <AIFloatingAssistant />
        </ClientProviders>
      </body>
    </html>
  );
}

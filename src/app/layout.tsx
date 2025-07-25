import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/masonry.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "edskool - Course Reviews & Educational Insights",
  description:
    "Find and review the best courses with edskool. Get insights from real students and make informed decisions about your education.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
    other: {
      rel: "apple-touch-icon",
      url: "/favicon.png",
    },
  },
  manifest: "/manifest.json",
};

import { NavigationWrapper } from "@/components/layout/navigation-wrapper";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/shared/cookie-consent";
import { GoogleAnalytics } from "@/components/shared/google-analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GoogleAnalytics />
        <NavigationWrapper>{children}</NavigationWrapper>
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}

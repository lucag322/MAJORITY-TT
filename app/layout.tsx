import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "Globe Explorer - Interactive World Countries",
  description:
    "Explore countries around the world with an interactive 3D globe. Click on flags to discover detailed information about each nation.",
  keywords: [
    "globe",
    "countries",
    "world map",
    "interactive",
    "geography",
    "flags",
    "nations",
    "3D globe",
  ],
  authors: [{ name: "Globe Explorer" }],
  creator: "Globe Explorer",
  publisher: "Globe Explorer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://globe-explorer.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Globe Explorer - Interactive World Countries",
    description:
      "Explore countries around the world with an interactive 3D globe. Click on flags to discover detailed information about each nation.",
    siteName: "Globe Explorer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Globe Explorer - Interactive World Countries",
    description:
      "Explore countries around the world with an interactive 3D globe. Click on flags to discover detailed information about each nation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          touchAction: "pan-x pan-y",
          // Pas de padding gauche/droite pour plein écran
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

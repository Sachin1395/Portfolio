import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { DeviceProbe } from "@/components/providers/DeviceProbe";
import { HideOnFooter } from "@/components/nav/HideOnFooter";
import { loaderPrepaintScript } from "@/components/loader/prepaint";
import { site } from "@/content/site";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  // Only small labels use it, far down the page: don't let it compete with the hero.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    type: "website",
  },
  // The share image comes from app/opengraph-image.png and twitter-image.png.
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ededeb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f10" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Decides before first paint whether the intro loader should show. */}
        <script dangerouslySetInnerHTML={{ __html: loaderPrepaintScript }} />
      </head>
      <body>
        <SmoothScroll />
        <DeviceProbe />
        <HideOnFooter />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/jost";
// Scripts for other languages: browsers download these only when the page uses those characters.
import "@fontsource-variable/noto-naskh-arabic";
import "@fontsource-variable/noto-sans-devanagari";
import "@fontsource-variable/noto-sans-sc";
import "./globals.css";
import { siteUrl } from "@/lib/env";
import { SITE_DESCRIPTION } from "@/lib/seo";
import { getLocale } from "@/i18n/server";
import { LOCALE_INFO } from "@/i18n/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Witchy Portal — Retreats & rituals with Yulia Moon",
    template: "%s · Witchy Portal",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Witchy Portal",
  authors: [{ name: "Yulia Moon", url: "/about" }],
  creator: "Yulia Moon",
  openGraph: {
    type: "website",
    siteName: "Witchy Portal",
    locale: "en_GB",
  },
  // Search Console / Bing ownership checks — set these in Vercel, no code change needed.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
  },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: "Witchy Portal", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ef",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const info = LOCALE_INFO[await getLocale()];
  return (
    <html lang={info.hreflang === "en" ? "en-GB" : info.hreflang} dir={info.dir}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/jost";
import "./globals.css";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Witchy Portal — Retreats & rituals with Yulia Moon",
    template: "%s · Witchy Portal",
  },
  description:
    "Seaside retreats, witchy tips, astrology and gentle rituals with Yulia Moon.",
  applicationName: "Witchy Portal",
  openGraph: {
    type: "website",
    siteName: "Witchy Portal",
    images: [{ url: "/images/horned-dusk-beach.jpg", width: 2560, height: 1710 }],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}

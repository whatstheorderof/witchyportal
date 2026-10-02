import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Shared renderer for social preview cards (WhatsApp, Instagram DMs, Facebook,
 * iMessage…). 1200×630, photo background with a plum scrim and serif title.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const ASSETS = join(process.cwd(), "assets");
let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 600; style: "normal" | "italic" }[]> | null = null;
function loadFonts() {
  fonts ??= Promise.all([
    readFile(join(ASSETS, "fonts/cormorant-garamond-latin-600-normal.woff")).then((data) => ({ name: "Cormorant", data, weight: 600 as const, style: "normal" as const })),
    readFile(join(ASSETS, "fonts/cormorant-garamond-latin-500-italic.woff")).then((data) => ({ name: "Cormorant", data, weight: 500 as const, style: "italic" as const })),
    readFile(join(ASSETS, "fonts/jost-latin-500-normal.woff")).then((data) => ({ name: "Jost", data, weight: 500 as const, style: "normal" as const })),
  ]);
  return fonts;
}

/** Bundled photos are pre-cropped to 1200×630 in assets/og; uploads are fetched from Blob. */
async function background(url: string | null | undefined): Promise<string | null> {
  const fallback = "/images/horned-dusk-beach.jpg";
  const src = url || fallback;
  try {
    if (src.startsWith("/images/")) {
      const buf = await readFile(join(ASSETS, "og", src.slice("/images/".length)));
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    }
    if (/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(src)) return src;
  } catch {
    /* fall through */
  }
  if (src !== fallback) return background(fallback);
  return null;
}

export async function ogCard({ eyebrow, title, subtitle, image, italic = false }: { eyebrow: string; title: string; subtitle?: string | null; image?: string | null; italic?: boolean }) {
  const [f, bg] = await Promise.all([loadFonts(), background(image)]);
  const size = title.length > 70 ? 58 : title.length > 40 ? 70 : 84;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#2a0f22", color: "#fbf6ef" }}>
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={bg} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(90deg, rgba(42,15,34,0.92) 0%, rgba(42,15,34,0.72) 50%, rgba(42,15,34,0.15) 100%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Jost", fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#f3d3cc" }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, boxShadow: "inset -8px 0 0 0 #f3d3cc" }} /> Witchy Portal
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 860 }}>
            <div style={{ fontFamily: "Jost", fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#f3d3cc" }}>{eyebrow}</div>
            <div style={{ marginTop: 14, fontFamily: "Cormorant", fontStyle: italic ? "italic" : "normal", fontWeight: italic ? 500 : 600, fontSize: size, lineHeight: 1.05 }}>{title}</div>
            {subtitle && <div style={{ marginTop: 20, fontFamily: "Jost", fontSize: 28, lineHeight: 1.35, color: "rgba(251,246,239,0.85)" }}>{subtitle.length > 140 ? subtitle.slice(0, 137) + "…" : subtitle}</div>}
          </div>
          <div style={{ display: "flex", fontFamily: "Jost", fontSize: 22, color: "rgba(251,246,239,0.75)" }}>with Yulia Moon</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: f },
  );
}

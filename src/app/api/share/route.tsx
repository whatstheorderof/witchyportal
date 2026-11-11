import { ImageResponse } from "next/og";
import { loadFonts } from "@/lib/og";
import { FULL_DECK, TAROT_DEPTH } from "@/lib/tarot";
import { SIGNS, type Sign } from "@/lib/astro/types";
import { sunCompatibility } from "@/lib/astro/compat";
import { CHINESE_ANIMALS, type ChineseAnimal } from "@/lib/astro/text/stars/chinese-animals";

/**
 * Story-sized share images (1080×1920) for results people want to post:
 *   ?kind=tarot&n=0..77&r=0|1          card of the day
 *   ?kind=big3&sun=Aries&moon=…&rising=… (rising optional)
 *   ?kind=compat&a=Aries&b=Leo
 *   ?kind=animal&a=Dragon
 * English text: the bundled fonts cover Latin script only.
 */
const W = 1080, H = 1920;
const sign = (v: string | null): Sign | null => (v && (SIGNS as readonly string[]).includes(v) ? (v as Sign) : null);

type Card = { eyebrow: string; title: string; subtitle?: string; lines?: [string, string][]; quote?: string; path: string };

function build(q: URLSearchParams): Card | null {
  const kind = q.get("kind");
  if (kind === "tarot") {
    const n = Number(q.get("n"));
    const card = Number.isInteger(n) ? FULL_DECK[n] : undefined;
    if (!card) return null;
    const r = q.get("r") === "1";
    return { eyebrow: "My card of the day", title: card.name + (r ? " (reversed)" : ""), subtitle: TAROT_DEPTH[card.n].theme, quote: card.prompt, path: "witchyportal.org/tarot" };
  }
  if (kind === "big3") {
    const sun = sign(q.get("sun")), moon = sign(q.get("moon")), rising = sign(q.get("rising"));
    if (!sun || !moon) return null;
    const lines: [string, string][] = [["Sun", sun], ["Moon", moon]];
    if (rising) lines.push(["Rising", rising]);
    return { eyebrow: rising ? "My big three" : "My Sun and Moon", title: rising ? `${sun}, ${moon}, ${rising}` : `${sun} & ${moon}`, lines, path: "witchyportal.org/big-three-calculator" };
  }
  if (kind === "compat") {
    const a = sign(q.get("a")), b = sign(q.get("b"));
    if (!a || !b) return null;
    const c = sunCompatibility(a, b);
    return {
      eyebrow: "Our compatibility",
      title: `${c.a} & ${c.b}`,
      subtitle: c.relationLabel.charAt(0).toUpperCase() + c.relationLabel.slice(1),
      lines: [["Overall", `${c.scores.overall}/10`], ["Love", `${c.scores.love}/10`], ["Friendship", `${c.scores.friendship}/10`], ["Trust", `${c.scores.trust}/10`]],
      path: `witchyportal.org/compatibility`,
    };
  }
  if (kind === "animal") {
    const a = q.get("a") as ChineseAnimal | null;
    const data = a ? CHINESE_ANIMALS[a] : undefined;
    if (!a || !data) return null;
    return { eyebrow: "My Chinese zodiac animal", title: `The ${a}`, subtitle: data.keywords.slice(0, 4).join(" · "), path: "witchyportal.org/chinese-zodiac" };
  }
  return null;
}

export async function GET(req: Request) {
  const c = build(new URL(req.url).searchParams);
  if (!c) return new Response("Not found", { status: 404 });
  const fonts = await loadFonts();
  const size = c.title.length > 34 ? 96 : c.title.length > 20 ? 118 : 140;
  return new ImageResponse(
    (
      <div style={{ width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "120px 96px", color: "#fbf6ef", backgroundImage: "linear-gradient(170deg, #4a1f40 0%, #2a0f22 55%, #160711 100%)", position: "relative" }}>
        <div style={{ position: "absolute", top: 210, right: -180, width: 620, height: 620, borderRadius: 310, display: "flex", boxShadow: "inset -120px 0 0 0 rgba(243,211,204,0.18)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "Jost", fontSize: 34, letterSpacing: 8, textTransform: "uppercase", color: "#f3d3cc" }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, display: "flex", boxShadow: "inset -11px 0 0 0 #f3d3cc" }} /> Witchy Portal
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Jost", fontSize: 38, letterSpacing: 7, textTransform: "uppercase", color: "#f3d3cc" }}>{c.eyebrow}</div>
          <div style={{ marginTop: 28, fontFamily: "Cormorant", fontWeight: 600, fontSize: size, lineHeight: 1.02 }}>{c.title}</div>
          {c.subtitle && <div style={{ marginTop: 30, fontFamily: "Jost", fontSize: 44, lineHeight: 1.3, color: "rgba(251,246,239,0.85)" }}>{c.subtitle}</div>}
          {c.lines && (
            <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 22 }}>
              {c.lines.map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid rgba(243,211,204,0.25)", paddingBottom: 18 }}>
                  <span style={{ fontFamily: "Jost", fontSize: 42, letterSpacing: 4, textTransform: "uppercase", color: "#f3d3cc" }}>{k}</span>
                  <span style={{ fontFamily: "Cormorant", fontWeight: 600, fontSize: 64 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {c.quote && <div style={{ marginTop: 70, fontFamily: "Cormorant", fontStyle: "italic", fontWeight: 500, fontSize: 62, lineHeight: 1.2, color: "#f3d3cc" }}>{`“${c.quote}”`}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "Jost" }}>
          <div style={{ fontSize: 34, color: "rgba(251,246,239,0.7)" }}>Find yours at</div>
          <div style={{ fontSize: 46, color: "#fbf6ef" }}>{c.path}</div>
        </div>
      </div>
    ),
    { width: W, height: H, fonts, headers: { "cache-control": "public, max-age=31536000, immutable" } },
  );
}

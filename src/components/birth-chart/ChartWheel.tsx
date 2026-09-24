import type { ChartResult } from "@/lib/astro/types";
import { SIGNS } from "@/lib/astro/types";
import { BODY_INFO, SIGN_INFO } from "@/lib/astro/interpretations";

const C = 200;
const rad = Math.PI / 180;

const ELEMENT_FILL: Record<string, string> = {
  Fire: "#f1d3cb",
  Earth: "#e9d9c3",
  Air: "#ece6f4",
  Water: "#d9cdea",
};

export function ChartWheel({ chart }: { chart: ChartResult }) {
  const asc = chart.angles.find((a) => a.name === "Ascendant")?.longitude ?? 0;
  // Ascendant on the left; zodiac runs anticlockwise as on a traditional chart.
  const theta = (lon: number) => 180 + (lon - asc);
  const pt = (lon: number, r: number) => [C + r * Math.cos(theta(lon) * rad), C - r * Math.sin(theta(lon) * rad)] as const;

  // Spread planets that are close together
  const sorted = [...chart.placements].sort((a, b) => a.longitude - b.longitude);
  const display = sorted.map((p) => ({ p, lon: p.longitude }));
  for (let pass = 0; pass < 6; pass++) {
    for (let i = 0; i < display.length; i++) {
      const a = display[i];
      const b = display[(i + 1) % display.length];
      const gap = (b.lon - a.lon + 360) % 360;
      if (display.length > 1 && gap < 9) {
        const push = (9 - gap) / 2;
        a.lon -= push;
        b.lon += push;
      }
    }
  }

  const aspectColor = { conjunction: "#7d67a6", sextile: "#3f6b4f", trine: "#3f6b4f", square: "#c97f73", opposition: "#c97f73" };

  return (
    <svg viewBox="-16 -16 432 432" role="img" aria-labelledby="wheel-title wheel-desc" className="h-auto w-full max-w-[520px]">
      <title id="wheel-title">Birth chart wheel</title>
      <desc id="wheel-desc">
        {`Zodiac wheel showing ${chart.placements.map((p) => `${p.body} in ${p.sign}`).join(", ")}.`}
      </desc>
      {/* Sign ring */}
      {SIGNS.map((s, i) => {
        const a0 = i * 30, a1 = (i + 1) * 30;
        const [x0, y0] = pt(a0, 192), [x1, y1] = pt(a1, 192), [x2, y2] = pt(a1, 160), [x3, y3] = pt(a0, 160);
        const [gx, gy] = pt(a0 + 15, 176);
        return (
          <g key={s}>
            <path d={`M${x0},${y0} A192,192 0 0 0 ${x1},${y1} L${x2},${y2} A160,160 0 0 1 ${x3},${y3} Z`} fill={ELEMENT_FILL[SIGN_INFO[s].element]} stroke="#cfb591" strokeWidth=".6" />
            <text x={gx} y={gy} textAnchor="middle" dominantBaseline="central" fontSize="15" fill="#4a1f40">{SIGN_INFO[s].glyph}</text>
          </g>
        );
      })}
      <circle cx={C} cy={C} r={160} fill="#fffdf9" stroke="#cfb591" strokeWidth=".8" />
      <circle cx={C} cy={C} r={92} fill="none" stroke="#e3d5c4" strokeWidth=".8" />

      {/* Houses */}
      {chart.houseCusps?.map((cusp, i) => {
        const [x0, y0] = pt(cusp, 92), [x1, y1] = pt(cusp, 160);
        const next = chart.houseCusps![(i + 1) % 12];
        const mid = cusp + (((next - cusp) + 360) % 360) / 2;
        const [nx, ny] = pt(mid, 100);
        const angle = i === 0 || i === 3 || i === 6 || i === 9;
        return (
          <g key={i}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={angle ? "#4a1f40" : "#cfb591"} strokeWidth={angle ? 1.4 : 0.7} />
            <text x={nx} y={ny} fontSize="8" textAnchor="middle" dominantBaseline="central" fill="#6a5664">{i + 1}</text>
          </g>
        );
      })}

      {/* Aspects */}
      {chart.aspects.map((a, i) => {
        const pa = chart.placements.find((p) => p.body === a.a)!;
        const pb = chart.placements.find((p) => p.body === a.b)!;
        if (a.type === "conjunction") return null;
        const [x0, y0] = pt(pa.longitude, 90), [x1, y1] = pt(pb.longitude, 90);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={aspectColor[a.type]} strokeWidth=".8" opacity={Math.max(0.25, 0.9 - a.orb / 10)} />;
      })}

      {/* Planets */}
      {display.map(({ p, lon }) => {
        const [tx, ty] = pt(p.longitude, 158), [tx2, ty2] = pt(p.longitude, 150);
        const [gx, gy] = pt(lon, 132);
        return (
          <g key={p.body}>
            <line x1={tx} y1={ty} x2={tx2} y2={ty2} stroke="#4a1f40" strokeWidth="1" />
            <text x={gx} y={gy} fontSize="15" textAnchor="middle" dominantBaseline="central" fill={p.signUncertain ? "#7d67a6" : "#2a1025"}>
              {BODY_INFO[p.body].glyph}
            </text>
            <text x={pt(lon, 115)[0]} y={pt(lon, 115)[1]} fontSize="7" textAnchor="middle" dominantBaseline="central" fill="#6a5664">
              {Math.floor(p.degree)}°{p.retrograde && p.body !== "North Node" ? "℞" : ""}
            </text>
          </g>
        );
      })}

      {chart.angles.filter((a) => a.name === "Ascendant" || a.name === "Midheaven").map((a) => {
        const [x, y] = pt(a.longitude, 200);
        return <text key={a.name} x={x} y={y} fontSize="9" fontWeight="600" textAnchor="middle" dominantBaseline="central" fill="#4a1f40">{a.name === "Ascendant" ? "AC" : "MC"}</text>;
      })}
    </svg>
  );
}

/** Draws the Moon's current phase. angle: 0 = new, 90 = first quarter, 180 = full, 270 = last quarter. */
export function MoonGlyph({ angle, size = 96, className = "" }: { angle: number; size?: number; className?: string }) {
  const r = 50;
  const a = ((angle % 360) + 360) % 360;
  const waxing = a < 180;
  const k = Math.cos((a * Math.PI) / 180); // 1 at new, -1 at full
  const rx = Math.abs(k) * r;
  let lit: string;
  if (waxing) {
    lit = `M0,${-r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 ${k > 0 ? 0 : 1} 0,${-r} Z`;
  } else {
    lit = `M0,${-r} A${r},${r} 0 0 0 0,${r} A${rx},${r} 0 0 ${k > 0 ? 1 : 0} 0,${-r} Z`;
  }
  return (
    <svg viewBox="-56 -56 112 112" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <radialGradient id="moonglow" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#f1d3cb" stopOpacity=".35" />
          <stop offset="100%" stopColor="#f1d3cb" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="56" fill="url(#moonglow)" />
      <circle r={r} fill="#3a1833" />
      <path d={lit} fill="#fbf6ef" />
      <circle r={r} fill="none" stroke="#d9cdea" strokeOpacity=".5" />
    </svg>
  );
}

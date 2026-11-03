import type { Sign } from "./types";
import { solarHouse } from "./sky";
import type { AxisKey } from "./text/stars/yearly";

/** The house axis (from a Sun sign) that an eclipse in `sign` falls across. */
export function axisFor(reader: Sign, sign: Sign): AxisKey {
  const h = solarHouse(reader, sign);
  const lo = h > 6 ? h - 6 : h;
  return `${lo}-${lo + 6}` as AxisKey;
}

/** The axis most of a set of eclipses fall across for a reader (ties: the first eclipse's). */
export function mainAxis(reader: Sign, signs: Sign[]): AxisKey | null {
  if (!signs.length) return null;
  const count = new Map<AxisKey, number>();
  for (const s of signs) { const a = axisFor(reader, s); count.set(a, (count.get(a) ?? 0) + 1); }
  let best = axisFor(reader, signs[0]);
  for (const [a, n] of count) if (n > count.get(best)!) best = a;
  return best;
}

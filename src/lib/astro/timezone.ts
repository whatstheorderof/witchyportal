/**
 * Converts a local wall-clock time at a place into UTC using the IANA time
 * zone database bundled with the JavaScript runtime (ICU). This includes
 * historical offsets, daylight-saving rules and, for older dates, Local Mean
 * Time where the tz database records it.
 */

export interface ZoneResolution {
  utc: Date;
  offsetMinutes: number;
  notes: string[];
}

function wallClockAsUtcMs(utcMs: number, timeZone: string): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    era: "short",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(new Date(utcMs)).map((p) => [p.type, p.value]),
  );
  let year = Number(parts.year);
  if (parts.era === "BC" || parts.era === "B") year = 1 - year;
  const d = new Date(0);
  d.setUTCFullYear(year, Number(parts.month) - 1, Number(parts.day));
  d.setUTCHours(Number(parts.hour), Number(parts.minute), Number(parts.second), 0);
  return d.getTime();
}

/** Offset (ms) of the zone from UTC at the given instant. */
export function zoneOffsetMs(utcMs: number, timeZone: string): number {
  // Drop sub-second precision in the instant before comparing.
  const whole = Math.floor(utcMs / 1000) * 1000;
  return wallClockAsUtcMs(whole, timeZone) - whole;
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function localToUtc(
  date: string,
  time: string,
  timeZone: string,
): ZoneResolution {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const wall = new Date(0);
  wall.setUTCFullYear(y, mo - 1, d);
  wall.setUTCHours(h, mi, 0, 0);
  const wallMs = wall.getTime();

  // Candidate offsets: those in force half a day either side.
  const candidates = new Set<number>([
    zoneOffsetMs(wallMs - 12 * 3600e3, timeZone),
    zoneOffsetMs(wallMs, timeZone),
    zoneOffsetMs(wallMs + 12 * 3600e3, timeZone),
  ]);
  const valid: number[] = [];
  for (const off of candidates) {
    const utc = wallMs - off;
    if (zoneOffsetMs(utc, timeZone) === off) valid.push(utc);
  }
  valid.sort((a, b) => a - b);

  const notes: string[] = [];
  let utcMs: number;
  if (valid.length === 0) {
    // Non-existent local time (clocks jumped forward). Use the offset that
    // applied just before the change, which is what most astrologers do.
    const before = zoneOffsetMs(wallMs - 12 * 3600e3, timeZone);
    utcMs = wallMs - before;
    notes.push(
      "This local time did not exist on that date because the clocks went forward. We used the offset in force just before the change — please double-check the recorded time.",
    );
  } else {
    utcMs = valid[0];
    if (valid.length > 1) {
      notes.push(
        "This local time occurred twice on that date because the clocks went back. We used the first occurrence; if you were born in the second hour, your Ascendant and houses may differ.",
      );
    }
  }
  return {
    utc: new Date(utcMs),
    offsetMinutes: zoneOffsetMs(utcMs, timeZone) / 60000,
    notes,
  };
}

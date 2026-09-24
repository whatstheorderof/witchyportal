const TZ = process.env.NEXT_PUBLIC_SITE_TIMEZONE || "Europe/London";

export function formatDate(d: string | Date, opts: Intl.DateTimeFormatOptions = {}) {
  const date = typeof d === "string" ? new Date(d.length === 10 ? d + "T12:00:00Z" : d) : d;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: TZ, ...opts }).format(date);
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(start + "T12:00:00Z");
  const e = new Date(end + "T12:00:00Z");
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const sameMonth = sameYear && s.getUTCMonth() === e.getUTCMonth();
  const f = (d: Date, o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...o }).format(d);
  if (sameMonth) return `${f(s, { day: "numeric" })}–${f(e, { day: "numeric", month: "long", year: "numeric" })}`;
  if (sameYear) return `${f(s, { day: "numeric", month: "short" })} – ${f(e, { day: "numeric", month: "short", year: "numeric" })}`;
  return `${f(s, { day: "numeric", month: "short", year: "numeric" })} – ${f(e, { day: "numeric", month: "short", year: "numeric" })}`;
}

export function nightsBetween(start: string, end: string) {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86400000);
}

/** Convert a Date to a value for <input type="datetime-local"> in the site time zone. */
export function toDateTimeLocal(d: Date | null | undefined): string {
  if (!d) return "";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(d).map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** Interpret a datetime-local value as wall time in the site time zone. */
export function fromDateTimeLocal(v: string): Date | null {
  if (!v) return null;
  const [date, time] = v.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const offset = (ms: number) => {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - ms;
  };
  const utc = guess - offset(guess);
  return new Date(guess - offset(utc));
}

export const SITE_TIMEZONE = TZ;

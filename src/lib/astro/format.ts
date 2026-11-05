/** UK-time date formatting for astrology pages. */
const TZ = "Europe/London";
export const ukDate = (d: Date, intl = "en-GB") => new Intl.DateTimeFormat(intl, { timeZone: TZ, weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(d);
export const ukDateShort = (d: Date, intl = "en-GB") => new Intl.DateTimeFormat(intl, { timeZone: TZ, day: "numeric", month: "short" }).format(d);
export const ukClock = (d: Date, intl = "en-GB") => new Intl.DateTimeFormat(intl, { timeZone: TZ, hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(d);
export const ukDateTime = (d: Date, intl = "en-GB") => `${ukDate(d, intl)}, ${ukClock(d, intl)}`;
export const ordinal = (n: number) => `${n}${n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"}`;
export const deg = (x: { sign: string; degree: number }) => `${Math.floor(x.degree)}° ${x.sign}`;

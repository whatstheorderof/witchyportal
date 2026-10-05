import { keyDates, ukDay } from "@/lib/astro/calendar";

/** Key moon and witchy dates as an .ics file for phone and desktop calendars. */
export async function GET(req: Request) {
  const now = new Date().getUTCFullYear();
  const y = Number(new URL(req.url).searchParams.get("year"));
  const years = Number.isInteger(y) && y >= now - 1 && y <= now + 3 ? [y] : [now, now + 1];
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const fold = (line: string) => {
    const out: string[] = [];
    let rest = line;
    while (Buffer.byteLength(rest) > 74) {
      let cut = 74;
      while (Buffer.byteLength(rest.slice(0, cut)) > 74) cut--;
      out.push(rest.slice(0, cut));
      rest = " " + rest.slice(cut);
    }
    out.push(rest);
    return out.join("\r\n");
  };
  const d8 = (key: string) => key.replace(/-/g, "");
  const nextDay = (key: string) => { const d = new Date(`${key}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const ukTime = (iso: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Witchy Portal//Moon calendar//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Witchy Portal moon calendar", "X-WR-TIMEZONE:Europe/London"];
  for (const year of years) {
    for (const k of keyDates(year)) {
      const start = ukDay(new Date(k.start));
      const end = k.end ? nextDay(ukDay(new Date(k.end))) : nextDay(start);
      const when = k.kind === "sabbat" || k.kind === "retrograde" ? "" : `Exact time: ${ukTime(k.start)} UK time. `;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${k.id}-${year}@witchyportal`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${d8(start)}`,
        `DTEND;VALUE=DATE:${d8(end)}`,
        fold(`SUMMARY:${esc(k.title)}`),
        fold(`DESCRIPTION:${esc(`${when}${k.detail}${k.tags.length ? `\n${k.tags.join(" · ")}` : ""}`)}`),
        "TRANSP:TRANSPARENT",
        "END:VEVENT",
      );
    }
  }
  lines.push("END:VCALENDAR");
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="witchy-portal-moon-${years.join("-")}.ics"`,
      "cache-control": "public, max-age=86400",
    },
  });
}

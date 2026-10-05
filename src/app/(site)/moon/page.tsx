import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { FULL_MOON_NAMES, PHASE_GUIDANCE, moonNow, upcomingMoons } from "@/lib/astro/moon";
import { keyDates, ukDay, yearMoons } from "@/lib/astro/calendar";
import { formatDate, SITE_TIMEZONE } from "@/lib/dates";
import { MoonGlyph } from "@/components/MoonGlyph";
import { PageHero } from "@/components/Section";
import { RetreatPromo } from "@/components/RetreatPromo";
import { ArrowRight } from "@/components/Icons";
import { MoonYear, type DayMark } from "@/components/moon/MoonYear";
import { KeyDates } from "@/components/moon/KeyDates";

export const metadata: Metadata = {
  title: "Moon calendar",
  description: "Tonight's moon, a full-year moon calendar, and the dates to look out for: new and full moons, eclipses, sabbats, equinoxes and retrogrades.",
};

const time = (d: Date) => new Intl.DateTimeFormat("en-GB", { timeZone: SITE_TIMEZONE, hour: "2-digit", minute: "2-digit" }).format(d);

type Props = { searchParams: Promise<{ year?: string }> };

export default async function MoonPage({ searchParams }: Props) {
  await connection();
  const nowDate = new Date();
  const todayKey = ukDay(nowDate);
  const thisYear = Number(todayKey.slice(0, 4));
  const asked = Number((await searchParams).year);
  const year = Number.isInteger(asked) && asked >= thisYear - 1 && asked <= thisYear + 3 ? asked : thisYear;

  const now = moonNow(nowDate);
  const guide = PHASE_GUIDANCE[now.phaseKey];
  const next = upcomingMoons(1)[0];
  const uk = (iso: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: SITE_TIMEZONE, ...o }).format(new Date(iso));
  // Times are formatted here so the browser shows exactly what the server rendered.
  const months = yearMoons(year).map((m) => ({
    ...m,
    days: m.days.map((d) => (d.quarter ? { ...d, quarter: { ...d.quarter, time: uk(d.quarter.time, { hour: "2-digit", minute: "2-digit" }) } } : d)),
  }));
  const dates = keyDates(year);
  const shownDates = dates.map((d) => ({
    ...d,
    month: uk(d.start, { month: "long" }),
    when: d.end
      ? `${uk(d.start, { weekday: "short", day: "numeric", month: "short" })} – ${uk(d.end, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}`
      : `${uk(d.start, { weekday: "long", day: "numeric", month: "long" })}${d.kind === "sabbat" ? "" : ` · ${uk(d.start, { hour: "2-digit", minute: "2-digit" })}`}`,
  }));

  // Small markers on the calendar for eclipses, sabbats/seasons and retrograde stations
  const marks: Record<string, DayMark[]> = {};
  const add = (iso: string, m: DayMark) => ((marks[ukDay(new Date(iso))] ??= []).push(m));
  for (const d of dates) {
    if (d.kind.endsWith("eclipse")) add(d.start, { kind: "eclipse", label: d.title });
    else if (d.kind === "sabbat" || d.kind === "season") add(d.start, { kind: "sabbat", label: d.title });
    else if (d.kind === "retrograde") {
      const planet = d.title.split(" ")[0];
      add(d.start, { kind: "retrograde", label: `${planet} turns retrograde` });
      if (d.end) add(d.end, { kind: "retrograde", label: `${planet} turns direct` });
    }
  }

  return (
    <>
      <PageHero image="veiledSea" eyebrow="Moon calendar" title="Live by the moon" intro="Tonight's moon, the whole year at a glance, and the dates worth planning your rituals around." />

      <section className="container-page py-14 lg:py-20" aria-labelledby="tonight">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-plum-deep p-8 text-ivory sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <MoonGlyph angle={now.angle} size={200} className="mx-auto" />
          <div>
            <p className="eyebrow text-blush">Tonight</p>
            <h2 id="tonight" className="display-md mt-2 text-ivory">{now.phaseName} in {now.sign}</h2>
            <p className="mt-2 text-ivory/75">{Math.round(now.illumination * 100)}% illuminated · {now.waxing ? "waxing (growing)" : "waning (shrinking)"}</p>
            <div className="mt-6 rounded-2xl bg-ivory/10 p-5">
              <p className="font-display text-2xl text-blush">{guide.theme}</p>
              <p className="mt-2 text-ivory/85">{guide.ritual}</p>
            </div>
            {next && (
              <p className="mt-5 text-ivory/80">
                Next: <strong className="text-ivory">{next.kind === "new" ? "New Moon" : FULL_MOON_NAMES[next.date.getUTCMonth()]}</strong> in {next.sign} on {formatDate(next.date, { weekday: "long", day: "numeric", month: "long", year: undefined })} at {time(next.date)}
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="calendar" className="container-page scroll-mt-24 pb-14 lg:pb-20" aria-labelledby="calendar-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Moon calendar</p>
            <h2 id="calendar-title" className="display-md mt-2">The moon in {year}</h2>
            <p className="mt-2 text-muted">Every day&rsquo;s phase, with new and full moons highlighted. Tap or hover a day for details. UK time.</p>
          </div>
          <nav aria-label="Choose a year" className="flex items-center gap-2">
            {year > thisYear - 1 && <Link href={`/moon?year=${year - 1}#calendar`} className="btn-outline min-h-11" scroll={false}>‹ {year - 1}</Link>}
            {year !== thisYear && <Link href="/moon#calendar" className="btn-outline min-h-11" scroll={false}>This year</Link>}
            {year < thisYear + 3 && <Link href={`/moon?year=${year + 1}#calendar`} className="btn-outline min-h-11" scroll={false}>{year + 1} ›</Link>}
          </nav>
        </div>
        <div className="mt-8 rounded-[2rem] bg-ivory-deep p-4 sm:p-8">
          <MoonYear year={year} months={months} todayKey={todayKey} marks={marks} />
        </div>
      </section>

      <section id="dates" className="container-page scroll-mt-24 pb-14 lg:pb-20" aria-labelledby="dates-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Dates to look out for</p>
            <h2 id="dates-title" className="display-md mt-2">Your {year} magical calendar</h2>
            <p className="mt-2 max-w-2xl text-muted">New and full moons, eclipses, the Wheel of the Year and planetary retrogrades — with a little guidance for each.</p>
          </div>
          <a href={`/moon/calendar.ics?year=${year}`} className="btn-primary min-h-11" download>Add to my calendar</a>
        </div>
        <div className="mt-8">
          <KeyDates dates={shownDates} now={nowDate.toISOString()} />
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/articles/beginners-guide-to-moon-rituals" className="btn-outline">A beginner&rsquo;s guide to moon rituals <ArrowRight /></Link>
          <Link href="/astrology" className="btn-outline">Astrology posts</Link>
        </div>
        <p className="mt-6 text-xs text-muted">
          Calculated with Astronomy Engine for the UK (Europe/London). Full moon names are traditional Northern Hemisphere names; a Blue Moon is the second full moon in a calendar month; supermoons are full moons closer than 362,000 km. Imbolc, Beltane, Lammas and Samhain are shown on their traditional dates.
        </p>
      </section>
      <RetreatPromo eyebrow="Dance under the stars" />
    </>
  );
}

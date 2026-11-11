import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import Link from "@/i18n/client";
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
import { NewsletterForm } from "@/components/forms";
import { siteUrl } from "@/lib/env";

export async function generateMetadata() {
  const year = new Intl.DateTimeFormat("en-GB", { timeZone: SITE_TIMEZONE, year: "numeric" }).format(new Date());
  const rx = await getReadings();
  return localeMeta({
    title: rx.t("Moon calendar {year} — moon phases, full moons & eclipses", { year }),
    description: rx.fill("Tonight's moon and the full {year} moon calendar: every new and full moon, eclipses, sabbats, equinoxes and retrogrades, in UK time.", { year }),
    path: "/moon",
  });
}

const time = (d: Date, intl: string) => new Intl.DateTimeFormat(intl, { timeZone: SITE_TIMEZONE, hour: "2-digit", minute: "2-digit" }).format(d);

type Props = { searchParams: Promise<{ year?: string }> };

export default async function MoonPage({ searchParams }: Props) {
  await connection();
  const nowDate = new Date();
  const todayKey = ukDay(nowDate);
  const thisYear = Number(todayKey.slice(0, 4));
  const asked = Number((await searchParams).year);
  const year = Number.isInteger(asked) && asked >= thisYear - 1 && asked <= thisYear + 3 ? asked : thisYear;

  const rx = await getReadings();
  const t = rx.t;
  const now = moonNow(nowDate);
  const guide = rx.deep(PHASE_GUIDANCE[now.phaseKey]);
  const next = upcomingMoons(1)[0];
  const uk = (iso: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(rx.intl, { timeZone: SITE_TIMEZONE, ...o }).format(new Date(iso));
  // Times are formatted here so the browser shows exactly what the server rendered.
  const months = yearMoons(year).map((m) => ({
    ...m,
    days: m.days.map((d) => (d.quarter ? { ...d, quarter: { ...d.quarter, time: uk(d.quarter.time, { hour: "2-digit", minute: "2-digit" }) } } : d)),
  }));
  const dates = keyDates(year, rx);
  const shownDates = dates.map((d) => ({
    ...d,
    month: uk(d.start, { month: "long" }).replace(/^./, (c) => c.toUpperCase()),
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
      const planet = t(d.planet ?? "");
      add(d.start, { kind: "retrograde", label: t("{planet} turns retrograde", { planet }) });
      if (d.end) add(d.end, { kind: "retrograde", label: t("{planet} turns direct", { planet }) });
    }
  }

  const webcal = `${siteUrl().replace(/^https?:/, "webcal:")}/moon/calendar.ics`;
  return (
    <>
      <PageHero image="veiledSea" eyebrow={t("Moon calendar")} title={t("Live by the moon")} intro={rx("Tonight's moon, the whole year at a glance, and the dates worth planning your rituals around.")} />

      <section className="container-page py-14 lg:py-20" aria-labelledby="tonight">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-plum-deep p-8 text-ivory sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <MoonGlyph angle={now.angle} size={200} className="mx-auto" />
          <div>
            <p className="eyebrow text-blush">{t("Tonight")}</p>
            <h2 id="tonight" className="display-md mt-2 text-ivory">{t("{phase} in {sign}", { phase: t(now.phaseName), sign: t(now.sign) })}</h2>
            <p className="mt-2 text-ivory/75">{t("{n}% illuminated", { n: Math.round(now.illumination * 100) })} · {now.waxing ? t("waxing (growing)") : t("waning (shrinking)")}</p>
            <div lang={rx.lang} className="mt-6 rounded-2xl bg-ivory/10 p-5">
              <p className="font-display text-2xl text-blush">{guide.theme}</p>
              <p className="mt-2 text-ivory/85">{guide.ritual}</p>
            </div>
            {next && (
              <p className="mt-5 text-ivory/80">
                {t("Next:")} <strong className="text-ivory">{t(next.kind === "new" ? "New Moon" : FULL_MOON_NAMES[next.date.getUTCMonth()])}</strong> {t("in {sign} on {date} at {time}", { sign: t(next.sign), date: formatDate(next.date, { weekday: "long", day: "numeric", month: "long", year: undefined }, rx.intl), time: time(next.date, rx.intl) })}
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="calendar" className="container-page scroll-mt-24 pb-14 lg:pb-20" aria-labelledby="calendar-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t("Moon calendar")}</p>
            <h2 id="calendar-title" className="display-md mt-2">{t("The moon in {year}", { year })}</h2>
            <p className="mt-2 text-muted">{t("Every day’s phase, with new and full moons highlighted. Tap or hover a day for details. UK time.")}</p>
          </div>
          <nav aria-label={t("Choose a year")} className="flex items-center gap-2">
            {year > thisYear - 1 && <Link href={`/moon?year=${year - 1}#calendar`} className="btn-outline min-h-11" scroll={false}>‹ {year - 1}</Link>}
            {year !== thisYear && <Link href="/moon#calendar" className="btn-outline min-h-11" scroll={false}>{t("This year")}</Link>}
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
            <p className="eyebrow">{t("Dates to look out for")}</p>
            <h2 id="dates-title" className="display-md mt-2">{t("Your {year} magical calendar", { year })}</h2>
            <p className="mt-2 max-w-2xl text-muted">{t("New and full moons, eclipses, the Wheel of the Year and planetary retrogrades — with a little guidance for each.")}</p>
          </div>
          <a href={`/moon/calendar.ics?year=${year}`} className="btn-primary min-h-11" download>{t("Add to my calendar")}</a>
        </div>
        <div className="mt-8">
          <KeyDates dates={shownDates} now={nowDate.toISOString()} />
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/articles/beginners-guide-to-moon-rituals" className="btn-outline">{t("A beginner’s guide to moon rituals")} <ArrowRight /></Link>
          <Link href="/astrology" className="btn-outline">{t("Astrology posts")}</Link>
        </div>
        <p className="mt-6 text-xs text-muted">
          {rx("Calculated with Astronomy Engine for the UK (Europe/London). Full moon names are traditional Northern Hemisphere names; a Blue Moon is the second full moon in a calendar month; supermoons are full moons closer than 362,000 km. Imbolc, Beltane, Lammas and Samhain are shown on their traditional dates.")}
        </p>
      </section>
      <section id="reminders" className="scroll-mt-24 bg-plum-deep py-14 text-ivory lg:py-20" aria-labelledby="reminders-title">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-blush">{t("Moon reminders")}</p>
            <h2 id="reminders-title" className="display-md mt-2 text-ivory">{t("Never miss a Moon")}</h2>
            <p className="mt-4 text-ivory/85">{t("Add every New and Full Moon, eclipse and sabbat to your phone's calendar. It updates by itself, so next year's Moons appear on their own.")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={webcal} className="btn-light min-h-11">{t("Subscribe on iPhone or Mac")}</a>
              <a href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`} target="_blank" rel="noopener noreferrer" className="btn-outline min-h-11 border-ivory/40 text-ivory hover:bg-ivory/10">{t("Add to Google Calendar")}</a>
            </div>
          </div>
          <div className="rounded-[2rem] bg-ivory/10 p-6 ring-1 ring-ivory/15 sm:p-8">
            <p className="font-display text-2xl text-ivory">{t("Or get an email on each New and Full Moon")}</p>
            <p className="mt-2 text-ivory/80">{t("Yulia's ritual for that Moon, in your inbox on the day. Unsubscribe any time.")}</p>
            <div className="mt-5"><NewsletterForm source="moon" dark buttonLabel={t("Remind me")} /></div>
            <Link href="/journal?add=moon" className="mt-6 inline-block text-ivory underline underline-offset-4">{t("Write a Moon intention in your journal")}</Link>
          </div>
        </div>
      </section>
      <RetreatPromo eyebrow={t("Dance under the stars")} />
    </>
  );
}

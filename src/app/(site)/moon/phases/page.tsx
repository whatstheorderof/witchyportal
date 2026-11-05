import Link from "@/i18n/client";
import { connection } from "next/server";
import { lunations, moonPhaseAt, positionsAt } from "@/lib/astro/sky";
import { yearMoons } from "@/lib/astro/calendar";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { MOON_GUIDE_INTRO, MOON_IN_SIGN_DAY, PHASE_GUIDE, VOID_OF_COURSE } from "@/lib/astro/text/stars/moon-guide";
import type { MoonPhaseName } from "@/lib/astro/text/types";
import { breadcrumbLd, faqLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Section";
import { MoonGlyph } from "@/components/MoonGlyph";

export async function generateMetadata() {
  const rx = await getReadings();
  return localeMeta({
    title: rx.t("Moon Phases Guide & Calendar: Meanings and Rituals | Witchy Portal"),
    absoluteTitle: true,
    description: rx("A witch's guide to the eight phases of the Moon — what each phase means, the magic and rituals for it, what to avoid — with this month's moon phase calendar in UK time."),
    path: "/moon/phases",
  });
}

const PHASES: { name: MoonPhaseName; angle: number; slug: string }[] = [
  { name: "New Moon", angle: 0, slug: "new-moon" }, { name: "Waxing Crescent", angle: 45, slug: "waxing-crescent" },
  { name: "First Quarter", angle: 90, slug: "first-quarter" }, { name: "Waxing Gibbous", angle: 135, slug: "waxing-gibbous" },
  { name: "Full Moon", angle: 180, slug: "full-moon" }, { name: "Waning Gibbous", angle: 225, slug: "waning-gibbous" },
  { name: "Last Quarter", angle: 270, slug: "last-quarter" }, { name: "Balsamic Moon", angle: 315, slug: "balsamic-moon" },
];
const paras = (t: string) => t.split(/\n\s*\n/).filter(Boolean);
const tz = { timeZone: "Europe/London" } as const;
const QUARTER_NAME = { new: "New Moon", first: "First Quarter", full: "Full Moon", last: "Last Quarter" } as const;

export default async function MoonPhasesPage() {
  await connection();
  const rx = await getReadings();
  const t = rx.t;
  const GUIDE = rx.deep(PHASE_GUIDE);
  const now = new Date();
  const phase = moonPhaseAt(now);
  const moon = positionsAt(now).find((p) => p.body === "Moon")!;
  const upcoming = lunations(now, new Date(+now + 92 * 86400000));
  const ukNow = new Intl.DateTimeFormat("en-CA", tz).format(now);
  const [y, m] = [Number(ukNow.slice(0, 4)), Number(ukNow.slice(5, 7))];
  const month = yearMoons(y)[m - 1];
  const monthLabel = new Intl.DateTimeFormat(rx.intl, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 15)));

  return (
    <>
      <JsonLd data={[breadcrumbLd([[t("Moon calendar"), "/moon"], [t("Moon phases"), "/moon/phases"]]), faqLd(PHASES.map((p) => ({ question: t("What does the {phase} mean?", { phase: t(p.name) }), answer: paras(GUIDE[p.name].meaning).join(" ") })))]} />
      <PageHero image="veil" eyebrow={t("Moon magic")} title={t("The phases of the Moon")} intro={rx("What each phase means, the magic it's best for and what to leave for another night — with the dates of this month's phases in UK time.")} />

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[22rem_1fr] lg:py-16">
        <div className="grid content-start justify-items-center gap-4 rounded-[2rem] bg-plum-deep p-8 text-center text-ivory">
          <p className="eyebrow text-blush">{t("Tonight")}</p>
          <MoonGlyph angle={phase.angle} size={140} />
          <p className="font-display text-3xl">{t(phase.name)}</p>
          <p className="text-sm text-ivory/80">{t("{n}% lit", { n: Math.round(phase.illumination * 100) })} · {t("Moon in {sign}", { sign: t(moon.sign) })}</p>
          <a href={`#${PHASES.find((p) => p.name === phase.name)!.slug}`} className="btn-outline mt-2 border-ivory/40 text-ivory hover:bg-ivory/10">{t("What it means")}</a>
        </div>
        <div lang={rx.lang} className="prose-witchy max-w-none">{paras(rx(MOON_GUIDE_INTRO)).map((p, i) => <p key={i}>{p}</p>)}</div>
      </section>

      <section className="container-page pb-12" aria-labelledby="cal-h">
        <h2 id="cal-h" className="display-md">{t("Moon phase calendar: {month}", { month: monthLabel })}</h2>
        <div className="mt-6 overflow-x-auto" tabIndex={0} aria-label={t("Moon phases this month")}>
          <ol className="grid min-w-[620px] grid-cols-7 gap-2">
            {Array.from({ length: month.firstWeekday }, (_, i) => <li key={`b${i}`} aria-hidden />)}
            {month.days.map((d) => (
              <li key={d.key} className={`grid justify-items-center gap-1 rounded-xl p-2 text-center ${d.key === ukNow ? "bg-plum text-ivory" : "bg-white/70 ring-1 ring-line"}`}>
                <span className="text-xs">{d.day}</span>
                <MoonGlyph angle={d.angle} size={28} glow={false} />
                {d.quarter && <span className="text-[0.62rem] leading-tight">{t(QUARTER_NAME[d.quarter.kind])}</span>}
              </li>
            ))}
          </ol>
        </div>
        <h3 className="mt-10 font-display text-2xl text-plum">{t("The next three months")}</h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {upcoming.map((l) => (
            <li key={+l.time} className="card flex items-center gap-3 p-4">
              <MoonGlyph angle={{ new: 0, first: 90, full: 180, last: 270 }[l.phase]} size={34} glow={false} />
              <span className="text-sm"><span className="block font-medium text-plum">{t("{phase} in {sign}", { phase: t(QUARTER_NAME[l.phase]), sign: t(l.sign) })}{l.eclipse ? ` · ${t(l.eclipse === "solar" ? "solar eclipse" : "lunar eclipse")}` : ""}</span><span className="text-muted">{new Intl.DateTimeFormat(rx.intl, { ...tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(l.time)}</span></span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">{t("Times are UK time. See the whole year — eclipses, sabbats and retrogrades — in the")} <Link href="/moon" className="link-underline">{t("moon calendar")}</Link>.</p>
      </section>

      <div className="border-t border-line bg-ivory-deep/50 py-14">
        <div className="container-page grid gap-8">
          <nav aria-label={t("Phases")} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {PHASES.map((p) => <a key={p.slug} href={`#${p.slug}`} className="chip min-h-10 shrink-0 whitespace-nowrap">{t(p.name)}</a>)}
          </nav>
          {PHASES.map((p) => {
            const g = GUIDE[p.name];
            return (
              <article key={p.slug} id={p.slug} className="card scroll-mt-28 p-6 sm:p-10" aria-labelledby={`${p.slug}-h`}>
                <div className="grid gap-8 lg:grid-cols-[9rem_1fr]">
                  <div className="grid justify-items-center gap-3 self-start"><span className="rounded-full bg-plum-deep p-3"><MoonGlyph angle={p.angle} size={96} /></span><p lang={rx.lang} className="text-center text-xs uppercase tracking-[0.18em] text-plum-soft">{g.keywords.join(" · ")}</p></div>
                  <div>
                    <h2 id={`${p.slug}-h`} className="display-md">{t(p.name)}</h2>
                    <div lang={rx.lang} className="mt-4 grid gap-3 leading-relaxed text-ink/85">{paras(g.meaning).map((x, i) => <p key={i}>{x}</p>)}</div>
                    <h3 className="mt-6 font-display text-2xl text-plum">{t("Magic for this phase")}</h3>
                    <div lang={rx.lang} className="mt-2 grid gap-3 leading-relaxed text-ink/85">{paras(g.magic).map((x, i) => <p key={i}>{x}</p>)}</div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-success/10 p-4"><p className="text-xs font-medium uppercase tracking-[0.18em] text-success">{t("Do")}</p><p lang={rx.lang} className="mt-1 text-[0.95rem]">{g.do}</p></div>
                      <div className="rounded-2xl bg-blush/40 p-4"><p className="text-xs font-medium uppercase tracking-[0.18em] text-plum-soft">{t("Avoid")}</p><p lang={rx.lang} className="mt-1 text-[0.95rem]">{g.avoid}</p></div>
                    </div>
                    <p className="mt-5 font-display text-xl italic text-plum">{t("Journal:")} <span lang={rx.lang}>{g.journal}</span></p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <section className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="signs-h">
        <div>
          <h2 id="signs-h" className="display-md">{t("The Moon through the signs")}</h2>
          <p className="mt-3 text-ink/80">{t("Every two to three days the Moon moves into a new sign and the mood shifts. It is in {sign} now.", { sign: t(moon.sign) })}</p>
          <div className="card mt-6 p-6"><h3 className="font-display text-xl text-plum">{t("Void-of-course Moon")}</h3><p lang={rx.lang} className="mt-2 text-[0.97rem] text-ink/85">{rx(VOID_OF_COURSE)}</p></div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {SIGNS.map((s) => (
            <li key={s} className={`rounded-2xl p-4 ${s === moon.sign ? "bg-plum text-ivory" : "bg-white/70 ring-1 ring-line"}`}>
              <p className="font-display text-lg"><span aria-hidden className="me-1">{SIGN_INFO[s].glyph}</span>{t("Moon in {sign}", { sign: t(s) })}{s === moon.sign ? ` · ${t("now")}` : ""}</p>
              <p lang={rx.lang} className={`mt-1 text-sm ${s === moon.sign ? "text-ivory/85" : "text-ink/80"}`}>{rx(MOON_IN_SIGN_DAY[s])}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

import Link from "@/i18n/client";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SIGNS, type Sign } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { signFromSlug } from "@/lib/astro/horoscope";
import { yearlyHoroscope, yearlyYears } from "@/lib/astro/yearly";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ sign: string; year: string }> };

async function resolve(params: Props["params"]): Promise<{ sign: Sign; year: number } | null> {
  const p = await params;
  const sign = signFromSlug(p.sign);
  if (!sign || !/^\d{4}$/.test(p.year)) return null;
  const year = Number(p.year);
  const [y] = yearlyYears();
  if (year < y - 1 || year > y + 1) return null;
  return { sign, year };
}

export async function generateMetadata({ params }: Props) {
  await connection();
  const r = await resolve(params);
  if (!r) return { title: "Not found" };
  const rx = await getReadings();
  return localeMeta({
    title: rx.t("{sign} Horoscope {year} — Your Year Ahead | Witchy Portal", { sign: rx.t(r.sign), year: r.year }),
    absoluteTitle: true,
    description: rx.fill("Your {sign} {year} horoscope from Yulia Moon: Jupiter's blessing, Saturn's lesson, the eclipses and retrogrades in your chart, every New and Full Moon month by month, and a ritual to open your year.", { sign: rx.t(r.sign), year: r.year }),
    path: `/horoscope/${r.sign.toLowerCase()}/${r.year}`,
  });
}

export default async function YearlyPage({ params }: Props) {
  await connection();
  const r = await resolve(params);
  if (!r) notFound();
  const { sign, year } = r;
  const rx = await getReadings();
  const t = rx.t, name = t(sign);
  const h = yearlyHoroscope(sign, year, rx);
  const slug = sign.toLowerCase();
  const [y] = yearlyYears();

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: t("{sign} horoscope {year}", { sign: name, year }), author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(`/horoscope/${slug}/${year}`), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([[t("Horoscopes"), "/horoscope"], [t("{sign} horoscope", { sign: name }), `/horoscope/${slug}`], [String(year), `/horoscope/${slug}/${year}`]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/horoscope" className="hover:text-ivory">{t("Horoscopes")}</Link> <span aria-hidden>/</span> <Link href={`/horoscope/${slug}`} className="hover:text-ivory">{name}</Link> <span aria-hidden>/</span> {year}</nav>
          <h1 className="display-lg mt-4 text-ivory"><span aria-hidden className="me-3">{SIGN_INFO[sign].glyph}</span>{t("{sign} horoscope {year}", { sign: name, year })}</h1>
          <p lang={rx.lang} className="mt-4 max-w-2xl text-lg text-ivory/85">{h.intro}</p>
          <nav aria-label={t("Choose a year")} className="mt-6 flex flex-wrap gap-2">
            {[y, y + 1].map((yr) => (
              <Link key={yr} href={`/horoscope/${slug}/${yr}`} aria-current={yr === year ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm ${yr === year ? "bg-ivory text-plum" : "border border-ivory/30 text-ivory hover:bg-ivory/10"}`}>{yr}</Link>
            ))}
            <Link href={`/horoscope/${slug}/monthly`} className="rounded-full border border-ivory/30 px-4 py-2 text-sm text-ivory hover:bg-ivory/10">{t("This month")}</Link>
            <Link href={`/horoscope/${slug}`} className="rounded-full border border-ivory/30 px-4 py-2 text-sm text-ivory hover:bg-ivory/10">{t("Today")}</Link>
          </nav>
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        {h.sections.map((s) => (
          <section key={s.id} className="card p-6 sm:p-8" aria-labelledby={s.id}>
            {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
            <h2 id={s.id} className="mt-1 font-display text-2xl text-plum sm:text-3xl">{s.title}</h2>
            {s.when && <p className="mt-1 text-sm text-muted">{s.when}</p>}
            <div lang={rx.lang} className="mt-3 grid gap-3 leading-relaxed text-ink/85">{s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
          </section>
        ))}
        <section className="card p-6 sm:p-8" aria-labelledby="months">
          <h2 id="months" className="font-display text-2xl text-plum sm:text-3xl">{t("{year} month by month", { year })}</h2>
          <p className="mt-1 text-sm text-muted">{t("Every New Moon and Full Moon, and the house of your chart it lights up.")}</p>
          <div className="mt-4 grid gap-5">
            {h.months.map((m) => (
              <div key={m.month}>
                <h3 className="font-display text-xl text-plum">{m.month}</h3>
                <ul className="mt-2 grid gap-2">
                  {m.items.map((it) => (
                    <li key={it.when + it.title} className={`rounded-2xl p-3 ${it.eclipse ? "bg-blush/40" : "bg-ivory ring-1 ring-line"}`}>
                      <p className="text-sm font-medium text-plum">{it.when} · {it.title}</p>
                      <p lang={rx.lang} className="mt-1 text-[0.95rem] text-ink/85">{it.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[2rem] bg-blush/40 p-6 sm:p-8">
          <p className="eyebrow">{t("Yulia’s ritual")}</p>
          <h2 className="mt-1 font-display text-2xl text-plum">{t("Open your {year}", { year })}</h2>
          <p lang={rx.lang} className="mt-3 font-display text-lg italic leading-relaxed text-plum">{h.ritual}</p>
        </section>
        <nav aria-label={t("Other signs in {year}", { year })} className="flex flex-wrap gap-2">
          {SIGNS.filter((s) => s !== sign).map((s) => <Link key={s} href={`/horoscope/${s.toLowerCase()}/${year}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-lavender/40"><span aria-hidden>{SIGN_INFO[s].glyph}</span> {t(s)}</Link>)}
        </nav>
        <p className="text-sm text-muted">{t("Read from your Sun sign with whole-sign houses, using the real positions of the planets (UK time). If you know your rising sign, read that one too. For dates in detail see")} <Link href="/mercury-retrograde" className="link-underline">{t("Mercury retrograde")}</Link> {t("and")} <Link href="/eclipses" className="link-underline">{t("eclipses")}</Link>.</p>
      </div>
    </>
  );
}

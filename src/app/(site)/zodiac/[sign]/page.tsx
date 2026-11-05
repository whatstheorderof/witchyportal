import Link from "@/i18n/client";
import { notFound } from "next/navigation";
import { SIGNS, type Sign } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { ZODIAC } from "@/lib/astro/text/zodiac";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { LOCALE_INFO, msg } from "@/i18n/config";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLeft, ArrowRight } from "@/components/Icons";

type Props = { params: Promise<{ sign: string }> };

const toSign = (slug: string) => SIGNS.find((s) => s.toLowerCase() === slug.toLowerCase()) as Sign | undefined;
const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export function generateStaticParams() {
  return SIGNS.map((s) => ({ sign: s.toLowerCase() }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const sign = toSign((await params).sign);
  if (!sign) return { title: "Not found" };
  const rx = await getReadings();
  const z = rx.deep(ZODIAC[sign]), t = rx.t, name = t(sign);
  return localeMeta({
    title: t("{sign} Zodiac Sign: Traits, Love, Career & Compatibility", { sign: name }),
    description: t("{sign} ({dates}): {element} sign ruled by {ruler}. {sign} personality traits, strengths and challenges, {sign} in love and at work, self-care and compatibility.", { sign: name, dates: z.dates, element: t(z.element).toLowerCase(), ruler: t(z.ruler).replace(/ \(.*\)/, "") }),
    path: `/zodiac/${sign.toLowerCase()}`,
    type: "article",
  });
}

const SECTIONS = [
  ["overview", msg("Personality"), msg("{sign} personality")],
  ["strengths", msg("Strengths"), msg("{sign} strengths")],
  ["challenges", msg("Challenges"), msg("{sign} challenges")],
  ["love", msg("Love"), msg("{sign} in love")],
  ["work", msg("Work"), msg("{sign} at work")],
  ["selfCare", msg("Self-care"), msg("Self-care for {sign}")],
  ["compatibility", msg("Compatibility"), msg("{sign} compatibility")],
] as const;

export default async function SignPage({ params }: Props) {
  const sign = toSign((await params).sign);
  if (!sign) notFound();
  const rx = await getReadings();
  const t = rx.t, name = t(sign);
  const z = rx.deep(ZODIAC[sign]);
  const i = SIGNS.indexOf(sign);
  const prev = SIGNS[(i + 11) % 12], next = SIGNS[(i + 1) % 12];
  const sameElement = SIGNS.filter((s) => s !== sign && SIGN_INFO[s].element === z.element);

  return (
    <>
      <JsonLd data={[
        {
          "@type": "Article",
          headline: t("{sign} zodiac sign: traits, love, career and compatibility", { sign: name }),
          about: { "@type": "Thing", name: t("{sign} (astrology)", { sign: name }) },
          url: absoluteUrl(`/zodiac/${sign.toLowerCase()}`),
          inLanguage: rx.lang === "en" ? "en-GB" : LOCALE_INFO[rx.lang].hreflang,
          author: { "@id": absoluteUrl("/about#yulia") },
          publisher: { "@id": absoluteUrl("/#organization") },
          image: absoluteUrl("/opengraph-image"),
        },
        breadcrumbLd([[t("Zodiac signs"), "/zodiac"], [name, `/zodiac/${sign.toLowerCase()}`]]),
      ]} />

      <section className="relative overflow-hidden border-b border-line/70 bg-plum-deep pt-28 pb-14 text-ivory lg:pt-40 lg:pb-20">
        <span aria-hidden className="pointer-events-none absolute -end-6 -top-10 font-display text-[16rem] leading-none text-ivory/[0.07] sm:text-[22rem]">{SIGN_INFO[sign].glyph}</span>
        <div className="container-page relative">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/75"><Link href="/zodiac" className="hover:text-ivory">{t("Zodiac signs")}</Link> <span aria-hidden>/</span> {name}</nav>
          <p className="eyebrow mt-6 text-blush">{z.dates} · {z.symbol}</p>
          <h1 className="display-lg mt-3 text-ivory"><span aria-hidden className="me-3">{SIGN_INFO[sign].glyph}</span>{name}</h1>
          <ul lang={rx.lang} className="mt-6 flex flex-wrap gap-2">
            {z.keywords.map((k) => <li key={k} className="rounded-full border border-ivory/30 px-3 py-1 text-sm text-ivory/90">{k}</li>)}
          </ul>
        </div>
      </section>

      <div className="container-page grid gap-14 py-14 lg:grid-cols-[1fr_19rem] lg:gap-20 lg:py-20">
        <article className="min-w-0">
          <nav aria-label={t("On this page")} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`} className="chip min-h-10 shrink-0 whitespace-nowrap">{t(label)}</a>)}
          </nav>
          {SECTIONS.map(([id, , heading]) => (
            <section key={id} id={id} className="mt-12 scroll-mt-28" aria-labelledby={`${id}-h`}>
              <h2 id={`${id}-h`} className="font-display text-3xl text-plum sm:text-4xl">{t(heading, { sign: name })}</h2>
              <div lang={rx.lang} className="prose-witchy mt-4">{paras(z[id]).map((p, k) => <p key={k}>{p}</p>)}</div>
            </section>
          ))}

          <div className="mt-16 rounded-[2rem] bg-ivory-deep p-8 ring-1 ring-line">
            <p className="eyebrow">{t("Beyond your Sun sign")}</p>
            <h2 className="mt-2 font-display text-3xl text-plum">{t("Where is {sign} in your chart?", { sign: name })}</h2>
            <p className="mt-3 text-ink/80">{rx.fill("Your Sun sign is only the start. Your Moon, rising sign and every planet sit in a sign too — and {sign} may colour your love life, your career or your inner world even if it isn’t your star sign.", { sign: name })}</p>
            <Link href="/birth-chart" className="btn-primary mt-6">{t("Get your free birth chart")} <ArrowRight /></Link>
          </div>

          <nav aria-label={t("Other signs")} className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6">
            <Link href={`/zodiac/${prev.toLowerCase()}`} className="inline-flex items-center gap-2 text-plum link-underline"><ArrowLeft />{t(prev)}</Link>
            <Link href={`/zodiac/${next.toLowerCase()}`} className="inline-flex items-center gap-2 text-plum link-underline">{t(next)}<ArrowRight /></Link>
          </nav>
        </article>

        <aside className="grid content-start gap-8">
          <div className="card p-6">
            <h2 className="font-display text-2xl text-plum">{t("{sign} at a glance", { sign: name })}</h2>
            <dl className="mt-4 grid gap-3 text-[0.95rem]">
              {([[t("Dates"), z.dates], [t("Symbol"), z.symbol], [t("Element"), t(z.element)], [t("Modality"), t(z.modality)], [t("Ruling planet"), t(z.ruler)], [t("Polarity"), t(z.polarity)]] as const).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-2"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted">{t("Sun-sign dates can shift by a day from year to year. If you were born on a cusp, your birth chart shows your exact Sun sign.")}</p>
          </div>
          <div className="card p-6">
            <h2 className="font-display text-xl text-plum">{t(`Fellow ${z.element.toLowerCase()} signs`)}</h2>
            <ul className="mt-3 grid gap-2">
              {sameElement.map((s) => <li key={s}><Link href={`/zodiac/${s.toLowerCase()}`} className="link-underline"><span aria-hidden className="me-1">{SIGN_INFO[s].glyph}</span>{t(s)}</Link></li>)}
            </ul>
          </div>
          <nav aria-labelledby="all-signs" className="card p-6">
            <h2 id="all-signs" className="font-display text-xl text-plum">{t("All twelve signs")}</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-[0.95rem]">
              {SIGNS.map((s) => <li key={s}><Link href={`/zodiac/${s.toLowerCase()}`} aria-current={s === sign ? "page" : undefined} className={s === sign ? "font-semibold text-plum" : "link-underline"}><span aria-hidden className="me-1">{SIGN_INFO[s].glyph}</span>{t(s)}</Link></li>)}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}

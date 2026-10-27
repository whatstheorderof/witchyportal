import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SIGNS, type Sign } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { ZODIAC } from "@/lib/astro/text/zodiac";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLeft, ArrowRight } from "@/components/Icons";

type Props = { params: Promise<{ sign: string }> };

const toSign = (slug: string) => SIGNS.find((s) => s.toLowerCase() === slug.toLowerCase()) as Sign | undefined;
const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export function generateStaticParams() {
  return SIGNS.map((s) => ({ sign: s.toLowerCase() }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sign = toSign((await params).sign);
  if (!sign) return { title: "Not found" };
  const z = ZODIAC[sign];
  return pageMeta({
    title: `${sign} Zodiac Sign: Traits, Love, Career & Compatibility`,
    description: `${sign} (${z.dates}): ${z.element.toLowerCase()} sign ruled by ${z.ruler.replace(/ \(.*\)/, "")}. ${sign} personality traits, strengths and challenges, ${sign} in love and at work, self-care and compatibility.`,
    path: `/zodiac/${sign.toLowerCase()}`,
    type: "article",
  });
}

const SECTIONS = [
  ["overview", "Personality", (s: Sign) => `${s} personality`],
  ["strengths", "Strengths", (s: Sign) => `${s} strengths`],
  ["challenges", "Challenges", (s: Sign) => `${s} challenges`],
  ["love", "Love", (s: Sign) => `${s} in love`],
  ["work", "Work", (s: Sign) => `${s} at work`],
  ["selfCare", "Self-care", (s: Sign) => `Self-care for ${s}`],
  ["compatibility", "Compatibility", (s: Sign) => `${s} compatibility`],
] as const;

export default async function SignPage({ params }: Props) {
  const sign = toSign((await params).sign);
  if (!sign) notFound();
  const z = ZODIAC[sign];
  const i = SIGNS.indexOf(sign);
  const prev = SIGNS[(i + 11) % 12], next = SIGNS[(i + 1) % 12];
  const sameElement = SIGNS.filter((s) => s !== sign && SIGN_INFO[s].element === z.element);

  return (
    <>
      <JsonLd data={[
        {
          "@type": "Article",
          headline: `${sign} zodiac sign: traits, love, career and compatibility`,
          about: { "@type": "Thing", name: `${sign} (astrology)` },
          url: absoluteUrl(`/zodiac/${sign.toLowerCase()}`),
          inLanguage: "en-GB",
          author: { "@id": absoluteUrl("/about#yulia") },
          publisher: { "@id": absoluteUrl("/#organization") },
          image: absoluteUrl("/opengraph-image"),
        },
        breadcrumbLd([["Zodiac signs", "/zodiac"], [sign, `/zodiac/${sign.toLowerCase()}`]]),
      ]} />

      <section className="relative overflow-hidden border-b border-line/70 bg-plum-deep pt-28 pb-14 text-ivory lg:pt-40 lg:pb-20">
        <span aria-hidden className="pointer-events-none absolute -right-6 -top-10 font-display text-[16rem] leading-none text-ivory/[0.07] sm:text-[22rem]">{SIGN_INFO[sign].glyph}</span>
        <div className="container-page relative">
          <nav aria-label="Breadcrumb" className="text-sm text-ivory/75"><Link href="/zodiac" className="hover:text-ivory">Zodiac signs</Link> <span aria-hidden>/</span> {sign}</nav>
          <p className="eyebrow mt-6 text-blush">{z.dates} · {z.symbol}</p>
          <h1 className="display-lg mt-3 text-ivory"><span aria-hidden className="mr-3">{SIGN_INFO[sign].glyph}</span>{sign}</h1>
          <ul className="mt-6 flex flex-wrap gap-2">
            {z.keywords.map((k) => <li key={k} className="rounded-full border border-ivory/30 px-3 py-1 text-sm text-ivory/90">{k}</li>)}
          </ul>
        </div>
      </section>

      <div className="container-page grid gap-14 py-14 lg:grid-cols-[1fr_19rem] lg:gap-20 lg:py-20">
        <article className="min-w-0">
          <nav aria-label="On this page" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`} className="chip min-h-10 shrink-0 whitespace-nowrap">{label}</a>)}
          </nav>
          {SECTIONS.map(([id, , heading]) => (
            <section key={id} id={id} className="mt-12 scroll-mt-28" aria-labelledby={`${id}-h`}>
              <h2 id={`${id}-h`} className="font-display text-3xl text-plum sm:text-4xl">{heading(sign)}</h2>
              <div className="prose-witchy mt-4">{paras(z[id]).map((p, k) => <p key={k}>{p}</p>)}</div>
            </section>
          ))}

          <div className="mt-16 rounded-[2rem] bg-ivory-deep p-8 ring-1 ring-line">
            <p className="eyebrow">Beyond your Sun sign</p>
            <h2 className="mt-2 font-display text-3xl text-plum">Where is {sign} in your chart?</h2>
            <p className="mt-3 text-ink/80">Your Sun sign is only the start. Your Moon, rising sign and every planet sit in a sign too — and {sign} may colour your love life, your career or your inner world even if it isn&rsquo;t your star sign.</p>
            <Link href="/birth-chart" className="btn-primary mt-6">Get your free birth chart <ArrowRight /></Link>
          </div>

          <nav aria-label="Other signs" className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6">
            <Link href={`/zodiac/${prev.toLowerCase()}`} className="inline-flex items-center gap-2 text-plum link-underline"><ArrowLeft />{prev}</Link>
            <Link href={`/zodiac/${next.toLowerCase()}`} className="inline-flex items-center gap-2 text-plum link-underline">{next}<ArrowRight /></Link>
          </nav>
        </article>

        <aside className="grid content-start gap-8">
          <div className="card p-6">
            <h2 className="font-display text-2xl text-plum">{sign} at a glance</h2>
            <dl className="mt-4 grid gap-3 text-[0.95rem]">
              {([["Dates", z.dates], ["Symbol", z.symbol], ["Element", z.element], ["Modality", z.modality], ["Ruling planet", z.ruler], ["Polarity", z.polarity]] as const).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-2"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted">Sun-sign dates can shift by a day from year to year. If you were born on a cusp, your birth chart shows your exact Sun sign.</p>
          </div>
          <div className="card p-6">
            <h2 className="font-display text-xl text-plum">Fellow {z.element.toLowerCase()} signs</h2>
            <ul className="mt-3 grid gap-2">
              {sameElement.map((s) => <li key={s}><Link href={`/zodiac/${s.toLowerCase()}`} className="link-underline"><span aria-hidden className="mr-1">{SIGN_INFO[s].glyph}</span>{s}</Link></li>)}
            </ul>
          </div>
          <nav aria-labelledby="all-signs" className="card p-6">
            <h2 id="all-signs" className="font-display text-xl text-plum">All twelve signs</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-[0.95rem]">
              {SIGNS.map((s) => <li key={s}><Link href={`/zodiac/${s.toLowerCase()}`} aria-current={s === sign ? "page" : undefined} className={s === sign ? "font-semibold text-plum" : "link-underline"}><span aria-hidden className="mr-1">{SIGN_INFO[s].glyph}</span>{s}</Link></li>)}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { pairSlug, parsePairSlug, sunCompatibility } from "@/lib/astro/compat";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { CompatPicker } from "@/components/stars/CompatPicker";

type Props = { params: Promise<{ pair: string }> };

export function generateStaticParams() {
  return SIGNS.flatMap((a, i) => SIGNS.slice(i).map((b) => ({ pair: pairSlug(a, b) })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = parsePairSlug((await params).pair);
  if (!p) return { title: "Not found" };
  const c = sunCompatibility(p[0], p[1]);
  return pageMeta({
    title: `${c.a} and ${c.b} Compatibility in Love & Friendship | Witchy Portal`,
    absoluteTitle: true,
    description: `${c.a} and ${c.b} compatibility: ${c.scores.overall}/10. How ${c.a} and ${c.b} get on in love, friendship and conversation, where you clash, and Yulia's advice for making it work.`,
    path: `/compatibility/${pairSlug(c.a, c.b)}`,
  });
}

const BARS = [["love", "Love"], ["friendship", "Friendship"], ["communication", "Communication"], ["trust", "Trust"]] as const;

export default async function PairPage({ params }: Props) {
  const slug = (await params).pair;
  const p = parsePairSlug(slug);
  if (!p) notFound();
  if (pairSlug(p[0], p[1]) !== slug) permanentRedirect(`/compatibility/${pairSlug(p[0], p[1])}`);
  const c = sunCompatibility(p[0], p[1]);
  const sections = [["love", `${c.a} and ${c.b} in love`], ["friendship", "As friends"], ["challenge", "Where you may clash"], ["advice", "Yulia's advice"]] as const;

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: `${c.a} and ${c.b} compatibility`, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(`/compatibility/${slug}`), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([["Compatibility", "/compatibility"], [`${c.a} and ${c.b}`, `/compatibility/${slug}`]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32 lg:pb-20">
        <div className="container-page max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-ivory/70"><Link href="/compatibility" className="hover:text-ivory">Compatibility</Link> <span aria-hidden>/</span> {c.a} &amp; {c.b}</nav>
          <p className="mt-6 flex items-center gap-4 font-display text-5xl sm:text-6xl" aria-hidden><span>{SIGN_INFO[c.a].glyph}</span><span className="text-blush">♡</span><span>{SIGN_INFO[c.b].glyph}</span></p>
          <h1 className="display-lg mt-4 text-ivory">{c.a} &amp; {c.b} compatibility</h1>
          <p className="mt-3 max-w-2xl text-lg text-ivory/85">{c.text.summary.join(" ")}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="grid h-32 w-32 place-items-center rounded-full border-4 border-blush/70 text-center">
              <span><span className="block font-display text-5xl leading-none">{c.scores.overall}</span><span className="text-sm text-ivory/75">out of 10</span></span>
            </div>
            <dl className="grid gap-2">
              {BARS.map(([k, label]) => (
                <div key={k} className="grid grid-cols-[8.5rem_1fr_2rem] items-center gap-3 text-sm">
                  <dt>{label}</dt>
                  <dd className="h-2.5 overflow-hidden rounded-full bg-ivory/15" aria-hidden><span className="block h-full rounded-full bg-blush" style={{ width: `${c.scores[k] * 10}%` }} /></dd>
                  <dd className="text-right tabular-nums" aria-label={`${label}: ${c.scores[k]} out of 10`}>{c.scores[k]}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-6 text-sm text-ivory/70">{c.relationNote}</p>
        </div>
      </section>
      <div className="container-page grid max-w-4xl gap-6 py-12">
        {sections.map(([k, title]) => (
          <section key={k} className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-plum sm:text-3xl">{title}</h2>
            <div className="mt-3 grid gap-3 leading-relaxed text-ink/85">{c.text[k].map((t, i) => <p key={i}>{t}</p>)}</div>
          </section>
        ))}
        <div className="grid gap-5 md:grid-cols-2">
          <Link href="/compatibility/love" className="card p-6"><p className="eyebrow">Free</p><p className="mt-1 font-display text-2xl text-plum">Compare your love signs</p><p className="text-sm text-muted">Your Sun signs are only part of it — your Venus signs show how you each love.</p></Link>
          <Link href="/compatibility/birth-chart" className="rounded-[2rem] bg-plum-deep p-6 text-ivory"><p className="eyebrow text-blush">Full report</p><p className="mt-1 font-display text-2xl">Birth chart compatibility</p><p className="text-sm text-ivory/80">Every connection between your two charts.</p></Link>
        </div>
        <section aria-labelledby="again-h" className="mt-6">
          <h2 id="again-h" className="font-display text-2xl text-plum">Test another pairing</h2>
          <div className="mt-4"><CompatPicker /></div>
          <p className="mt-4 text-sm text-muted">Read more about <Link href={`/zodiac/${c.a.toLowerCase()}`} className="link-underline">{c.a}</Link>{c.a !== c.b && <> and <Link href={`/zodiac/${c.b.toLowerCase()}`} className="link-underline">{c.b}</Link></>}.</p>
        </section>
      </div>
    </>
  );
}

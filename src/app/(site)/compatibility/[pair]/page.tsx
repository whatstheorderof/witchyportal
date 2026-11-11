import Link from "@/i18n/client";
import { ShareImage } from "@/components/ShareImage";
import { notFound, permanentRedirect } from "next/navigation";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { pairSlug, parsePairSlug, sunCompatibility } from "@/lib/astro/compat";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { msg } from "@/i18n/config";
import { JsonLd } from "@/components/JsonLd";
import { CompatPicker } from "@/components/stars/CompatPicker";

type Props = { params: Promise<{ pair: string }> };

export function generateStaticParams() {
  return SIGNS.flatMap((a, i) => SIGNS.slice(i).map((b) => ({ pair: pairSlug(a, b) })));
}

export async function generateMetadata({ params }: Props) {
  const p = parsePairSlug((await params).pair);
  if (!p) return { title: "Not found" };
  const rx = await getReadings();
  const c = sunCompatibility(p[0], p[1], rx);
  const v = { a: rx.t(c.a), b: rx.t(c.b), score: c.scores.overall };
  return localeMeta({
    title: rx.t("{a} and {b} Compatibility in Love & Friendship | Witchy Portal", v),
    absoluteTitle: true,
    description: rx.t("{a} and {b} compatibility: {score}/10. How {a} and {b} get on in love, friendship and conversation, where you clash, and Yulia's advice for making it work.", v),
    path: `/compatibility/${pairSlug(c.a, c.b)}`,
  });
}

const BARS = [["love", msg("Love")], ["friendship", msg("Friendship")], ["communication", msg("Communication")], ["trust", msg("Trust")]] as const;

export default async function PairPage({ params }: Props) {
  const slug = (await params).pair;
  const p = parsePairSlug(slug);
  if (!p) notFound();
  if (pairSlug(p[0], p[1]) !== slug) permanentRedirect(`/compatibility/${pairSlug(p[0], p[1])}`);
  const rx = await getReadings();
  const t = rx.t;
  const c = sunCompatibility(p[0], p[1], rx);
  const A = t(c.a), B = t(c.b);
  const sections = [["love", t("{a} and {b} in love", { a: A, b: B })], ["friendship", t("As friends")], ["challenge", t("Where you may clash")], ["advice", t("Yulia's advice")]] as const;

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: t("{a} and {b} compatibility", { a: A, b: B }), inLanguage: rx.lang, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(`/compatibility/${slug}`), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([[t("Compatibility"), "/compatibility"], [t("{a} and {b}", { a: A, b: B }), `/compatibility/${slug}`]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32 lg:pb-20">
        <div className="container-page max-w-4xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/compatibility" className="hover:text-ivory">{t("Compatibility")}</Link> <span aria-hidden>/</span> {A} &amp; {B}</nav>
          <p className="mt-6 flex items-center gap-4 font-display text-5xl sm:text-6xl" aria-hidden><span>{SIGN_INFO[c.a].glyph}</span><span className="text-blush">♡</span><span>{SIGN_INFO[c.b].glyph}</span></p>
          <h1 className="display-lg mt-4 text-ivory">{t("{a} & {b} compatibility", { a: A, b: B })}</h1>
          <p lang={rx.lang} className="mt-3 max-w-2xl text-lg text-ivory/85">{c.text.summary.join(" ")}</p>
          <div className="mt-5"><ShareImage query={{ kind: "compat", a: c.a, b: c.b }} filename={`${c.a}-and-${c.b}`.toLowerCase()} className="btn-light" /></div>
          <div className="mt-8 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="grid h-32 w-32 place-items-center rounded-full border-4 border-blush/70 text-center">
              <span><span className="block font-display text-5xl leading-none">{c.scores.overall}</span><span className="text-sm text-ivory/75">{t("out of 10")}</span></span>
            </div>
            <dl className="grid gap-2">
              {BARS.map(([k, label]) => (
                <div key={k} className="grid grid-cols-[8.5rem_1fr_2rem] items-center gap-3 text-sm">
                  <dt>{t(label)}</dt>
                  <dd className="h-2.5 overflow-hidden rounded-full bg-ivory/15" aria-hidden><span className="block h-full rounded-full bg-blush" style={{ width: `${c.scores[k] * 10}%` }} /></dd>
                  <dd className="text-end tabular-nums"><span aria-hidden>{c.scores[k]}</span><span className="sr-only">{t("{label}: {n} out of 10", { label: t(label), n: c.scores[k] })}</span></dd>
                </div>
              ))}
            </dl>
          </div>
          <p lang={rx.lang} className="mt-6 text-sm text-ivory/70">{c.relationNote}</p>
        </div>
      </section>
      <div className="container-page grid max-w-4xl gap-6 py-12">
        {sections.map(([k, title]) => (
          <section key={k} className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-plum sm:text-3xl">{title}</h2>
            <div lang={rx.lang} className="mt-3 grid gap-3 leading-relaxed text-ink/85">{c.text[k].map((x, i) => <p key={i}>{x}</p>)}</div>
          </section>
        ))}
        <div className="grid gap-5 md:grid-cols-2">
          <Link href="/compatibility/love" className="card p-6"><p className="eyebrow">{t("Free")}</p><p className="mt-1 font-display text-2xl text-plum">{t("Compare your love signs")}</p><p className="text-sm text-muted">{t("Your Sun signs are only part of it — your Venus signs show how you each love.")}</p></Link>
          <Link href="/compatibility/birth-chart" className="rounded-[2rem] bg-plum-deep p-6 text-ivory"><p className="eyebrow text-blush">{t("Full report")}</p><p className="mt-1 font-display text-2xl">{t("Birth chart compatibility")}</p><p className="text-sm text-ivory/80">{t("Every connection between your two charts.")}</p></Link>
        </div>
        <section aria-labelledby="again-h" className="mt-6">
          <h2 id="again-h" className="font-display text-2xl text-plum">{t("Test another pairing")}</h2>
          <div className="mt-4"><CompatPicker /></div>
          <p className="mt-4 text-sm text-muted">{t("Read more about")} <Link href={`/zodiac/${c.a.toLowerCase()}`} className="link-underline">{A}</Link>{c.a !== c.b && <> {t("and")} <Link href={`/zodiac/${c.b.toLowerCase()}`} className="link-underline">{B}</Link></>}.</p>
        </section>
      </div>
    </>
  );
}

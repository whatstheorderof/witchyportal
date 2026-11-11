import Link from "@/i18n/client";
import { notFound } from "next/navigation";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/stars/Faqs";
import { absoluteUrl, breadcrumbLd, faqLd } from "@/lib/seo";
import { DREAMS, DREAM_NOTE } from "@/lib/astro/text/stars/dreams";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(DREAMS).map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  if (!DREAMS[slug]) return { title: "Not found" };
  const rx = await getReadings();
  const d = rx.deep(DREAMS[slug]);
  return localeMeta({
    title: rx.t("{dream}: dream meaning", { dream: d.title }),
    description: d.summary,
    path: `/dream-dictionary/${slug}`,
  });
}

export default async function DreamPage({ params }: Props) {
  const slug = (await params).slug;
  if (!DREAMS[slug]) notFound();
  const rx = await getReadings();
  const { t } = rx, L = rx.lang;
  const d = rx.deep(DREAMS[slug]);
  const slugs = Object.keys(DREAMS);
  const related = slugs.filter((s) => s !== slug && DREAMS[s].category === DREAMS[slug].category).slice(0, 4);
  const more = related.length >= 3 ? related : [...related, ...slugs.filter((s) => s !== slug && !related.includes(s)).slice(0, 4 - related.length)];
  const path = `/dream-dictionary/${slug}`;
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "Article", headline: d.title, description: d.summary, inLanguage: L, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(path) },
        faqLd([{ question: t("What does it mean to dream about this?"), answer: d.summary }]),
        breadcrumbLd([[t("Dream dictionary"), "/dream-dictionary"], [d.title, path]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/dream-dictionary" className="hover:text-ivory">{t("Dream dictionary")}</Link> <span aria-hidden>/</span> {d.title}</nav>
          <p className="eyebrow mt-6 text-blush">{t("Dream meaning")}</p>
          <h1 lang={L} className="display-lg mt-2 text-ivory">{d.title}</h1>
          <p lang={L} className="mt-3 text-sm uppercase tracking-[0.15em] text-blush">{d.keywords.join(" · ")}</p>
          <p lang={L} className="mt-5 max-w-2xl text-lg text-ivory/85">{d.summary}</p>
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">{t("What it means")}</h2><Prose text={d.meaning} className="mt-3" lang={L} /></section>
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">{t("If the dream felt frightening")}</h2><Prose text={d.shadow} className="mt-3" lang={L} /></section>
        <section className="rounded-[2rem] bg-blush/50 p-6 sm:p-8">
          <p className="eyebrow">{t("Ask yourself")}</p>
          <p lang={L} className="mt-2 font-display text-2xl italic text-plum sm:text-3xl">{d.ask}</p>
          <h2 className="mt-6 font-display text-2xl text-plum">{t("Yulia’s ritual")}</h2>
          <Prose text={d.ritual} className="mt-2" lang={L} />
        </section>
        <div className="flex flex-wrap gap-3">
          <Link href={`/journal?add=dream&title=${encodeURIComponent(d.title)}`} className="btn-primary">{t("Write this dream in my journal")}</Link>
          <Link href="/services" className="btn-outline">{t("Ask Yulia to interpret your dream")}</Link>
        </div>
        <nav aria-label={t("More dream meanings")} className="mt-4">
          <h2 className="font-display text-2xl text-plum">{t("More dream meanings")}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {more.map((s) => <li key={s}><Link href={`/dream-dictionary/${s}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-lavender/40">{rx(DREAMS[s].title)}</Link></li>)}
            <li><Link href="/dream-dictionary" className="rounded-full border border-plum px-3 py-1.5 text-sm text-plum">{t("All dreams")}</Link></li>
          </ul>
        </nav>
        <p lang={L} className="text-xs text-muted">{rx(DREAM_NOTE)}</p>
      </div>
    </>
  );
}

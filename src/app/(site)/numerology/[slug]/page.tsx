import Link from "@/i18n/client";
import { notFound } from "next/navigation";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/stars/Faqs";
import { absoluteUrl, breadcrumbLd, faqLd } from "@/lib/seo";
import { NUM_KEYS, numSlug, slugNum } from "@/lib/numerology";
import { NUMBERS, NUM_NOTE } from "@/lib/astro/text/stars/numerology";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => NUM_KEYS.map((n) => ({ slug: numSlug(n) }));

export async function generateMetadata({ params }: Props) {
  const n = slugNum((await params).slug);
  if (!n) return { title: "Not found" };
  const rx = await getReadings();
  const d = rx.deep(NUMBERS[n]);
  return localeMeta({
    title: rx.t("Life path number {n} meaning: {title}", { n, title: d.title }),
    description: d.summary,
    path: `/numerology/${numSlug(n)}`,
  });
}

export default async function NumberPage({ params }: Props) {
  const n = slugNum((await params).slug);
  if (!n) notFound();
  const rx = await getReadings();
  const { t } = rx, L = rx.lang;
  const d = rx.deep(NUMBERS[n]);
  const path = `/numerology/${numSlug(n)}`;
  const i = NUM_KEYS.indexOf(n);
  const prev = NUM_KEYS[(i + NUM_KEYS.length - 1) % NUM_KEYS.length], next = NUM_KEYS[(i + 1) % NUM_KEYS.length];
  const master = n.length === 2;
  const sections: [string, string][] = [[t("Your path"), d.path], [t("In love"), d.love], [t("In work and purpose"), d.work], [t("Your shadow side"), d.shadow]];
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "Article", headline: `${t("Life path {n}", { n })}: ${d.title}`, description: d.summary, inLanguage: L, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(path) },
        faqLd([{ question: t("What does life path number {n} mean?", { n }), answer: d.summary }]),
        breadcrumbLd([[t("Numerology"), "/numerology"], [t("Life path {n}", { n }), path]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/numerology" className="hover:text-ivory">{t("Numerology")}</Link> <span aria-hidden>/</span> {t("Life path {n}", { n })}</nav>
          <p className="eyebrow mt-6 text-blush">{master ? t("Master number {n}", { n }) : t("Life path {n}", { n })}</p>
          <h1 className="display-lg mt-2 flex items-baseline gap-4 text-ivory"><span aria-hidden className="text-blush">{n}</span><span lang={L}>{d.title}</span></h1>
          <p lang={L} className="mt-3 text-sm uppercase tracking-[0.15em] text-blush">{d.keywords.join(" · ")}</p>
          <p lang={L} className="mt-5 max-w-2xl text-lg text-ivory/85">{d.summary}</p>
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        {sections.map(([h, text]) => (
          <section key={h} className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">{h}</h2><Prose text={text} className="mt-3" lang={L} /></section>
        ))}
        <section className="rounded-[2rem] bg-blush/50 p-6 sm:p-8">
          <p className="eyebrow">{t("Yulia’s ritual")}</p>
          <Prose text={d.ritual} className="mt-2" lang={L} />
        </section>
        <div className="flex flex-wrap gap-3">
          <Link href="/numerology" className="btn-primary">{t("Calculate your numbers")}</Link>
          <Link href="/services" className="btn-outline">{t("Book a personal reading")}</Link>
        </div>
        <nav aria-label={t("More numbers")} className="mt-4">
          <ul className="flex flex-wrap gap-2">
            <li><Link href={`/numerology/${numSlug(prev)}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-lavender/40">← {t("Life path {n}", { n: prev })}</Link></li>
            <li><Link href={`/numerology/${numSlug(next)}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-lavender/40">{t("Life path {n}", { n: next })} →</Link></li>
            <li><Link href="/numerology" className="rounded-full border border-plum px-3 py-1.5 text-sm text-plum">{t("All numbers")}</Link></li>
          </ul>
        </nav>
        <p lang={L} className="text-xs text-muted">{rx(NUM_NOTE)}</p>
      </div>
    </>
  );
}

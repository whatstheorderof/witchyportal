import Link from "@/i18n/client";
import { notFound } from "next/navigation";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/stars/Faqs";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";
import { msg } from "@/i18n/config";
import { CORRESPONDENCES, CORR_NOTE, INTENTIONS, KIND_LABEL, type CorrKind } from "@/lib/astro/text/stars/correspondences";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(CORRESPONDENCES).map((slug) => ({ slug }));

const TITLE: Record<CorrKind, string> = { crystal: msg("{name} crystal meaning and uses"), herb: msg("{name}: magical uses of the herb"), candle: msg("{name} candle meaning in magic") };

export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const c = CORRESPONDENCES[slug];
  if (!c) return { title: "Not found" };
  const rx = await getReadings();
  return localeMeta({ title: rx.t(TITLE[c.kind], { name: rx.t(c.name) }), description: rx(c.summary), path: `/correspondences/${slug}` });
}

export default async function CorrespondencePage({ params }: Props) {
  const slug = (await params).slug;
  const base = CORRESPONDENCES[slug];
  if (!base) notFound();
  const rx = await getReadings();
  const { t } = rx, L = rx.lang;
  const c = rx.deep(base);
  const name = t(base.name);
  const path = `/correspondences/${slug}`;
  const main = base.intentions[0];
  const kit = (["crystal", "herb", "candle"] as const)
    .filter((k) => k !== base.kind)
    .map((k) => Object.entries(CORRESPONDENCES).find(([s, x]) => s !== slug && x.kind === k && x.intentions.includes(main)))
    .filter((x): x is [string, (typeof CORRESPONDENCES)[string]] => Boolean(x));
  const label = (key: string) => t(INTENTIONS.find((i) => i.key === key)!.label);
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "Article", headline: rx.t(TITLE[base.kind], { name }), description: c.summary, inLanguage: L, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(path) },
        breadcrumbLd([[t("Correspondences"), "/correspondences"], [name, path]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/correspondences" className="hover:text-ivory">{t("Correspondences")}</Link> <span aria-hidden>/</span> {name}</nav>
          <p className="eyebrow mt-6 text-blush">{t(KIND_LABEL[base.kind].one)}</p>
          <h1 className="display-lg mt-2 text-ivory">{name}</h1>
          <p lang={L} className="mt-3 text-sm uppercase tracking-[0.15em] text-blush">{c.keywords.join(" · ")}</p>
          <p lang={L} className="mt-5 max-w-2xl text-lg text-ivory/85">{c.summary}</p>
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        <section className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">{t("What it's used for")}</h2><Prose text={c.uses} className="mt-3" lang={L} /></section>
        <section className="rounded-[2rem] bg-blush/50 p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">{t("How Yulia uses it")}</h2><Prose text={c.how} className="mt-3" lang={L} />
          {c.care && <p lang={L} className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm text-ink/85"><strong className="font-medium text-plum">{t("Good to know:")}</strong> {c.care}</p>}
        </section>
        <section className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-plum-soft">{t("Use it for")}</h2>
            <ul className="mt-2 flex flex-wrap gap-2">{base.intentions.map((i) => <li key={i}><Link href={`/correspondences?need=${i}`} className="chip min-h-11">{label(i)}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-plum-soft">{t("Often paired with")}</h2>
            <p className="mt-2">{base.signs.length ? base.signs.map((s, n) => <span key={s}>{n > 0 && ", "}<Link href={`/zodiac/${s.toLowerCase()}`} className="link-underline">{t(s)}</Link></span>) : t("Every sign")}</p>
          </div>
        </section>
        {kit.length > 0 && (
          <section aria-labelledby="kit">
            <h2 id="kit" className="font-display text-2xl text-plum">{t("A little ritual kit for {need}", { need: label(main).toLowerCase() })}</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {kit.map(([s, x]) => (
                <li key={s}><Link href={`/correspondences/${s}`} className="card block p-4"><span className="text-xs uppercase tracking-[0.15em] text-plum-soft">{t(KIND_LABEL[x.kind].one)}</span><span className="block font-display text-xl text-plum">{t(x.name)}</span><span lang={L} className="block text-sm text-ink/80">{rx(x.summary)}</span></Link></li>
              ))}
            </ul>
          </section>
        )}
        <div className="flex flex-wrap gap-3">
          <Link href="/correspondences" className="btn-outline">{t("All correspondences")}</Link>
          <Link href="/moon" className="btn-outline">{t("Moon calendar")}</Link>
        </div>
        <p lang={L} className="text-xs text-muted">{rx(CORR_NOTE)}</p>
      </div>
    </>
  );
}

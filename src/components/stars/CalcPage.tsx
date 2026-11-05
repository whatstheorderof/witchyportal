import Link from "@/i18n/client";
import { CALCS, CALC_KINDS, type CalcKind } from "@/lib/astro/calc-meta";
import { CALC_GUIDE } from "@/lib/astro/text/stars/guides";
import { absoluteUrl, breadcrumbLd, faqLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { SignCalculator } from "./SignCalculator";
import { Faqs, Prose } from "./Faqs";

export async function calcMetadata(kind: CalcKind) {
  const rx = await getReadings();
  return localeMeta({ title: `${rx(CALCS[kind].metaTitle)} | Witchy Portal`, absoluteTitle: true, description: rx(CALCS[kind].metaDescription), path: CALCS[kind].path });
}

/** A single-purpose calculator landing page. */
export async function CalcPage({ kind }: { kind: CalcKind }) {
  const rx = await getReadings();
  const t = rx.t;
  const guide = rx.deep(CALC_GUIDE[kind]);
  const tr = (k: CalcKind) => ({ ...CALCS[k], title: t(CALCS[k].title), h1: t(CALCS[k].h1), blurb: rx(CALCS[k].blurb) });
  const meta = tr(kind);
  const lowerFirst = (x: string) => x.charAt(0).toLocaleLowerCase(rx.intl) + x.slice(1);
  return (
    <>
      <JsonLd data={[
        { "@type": "WebApplication", name: meta.h1, url: absoluteUrl(meta.path), applicationCategory: "LifestyleApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: 0, priceCurrency: "GBP" }, publisher: { "@id": absoluteUrl("/#organization") } },
        breadcrumbLd([[t("Calculators"), "/calculators"], [meta.title, meta.path]]),
        faqLd(guide.faqs),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/calculators" className="hover:text-ivory">{t("Calculators")}</Link> <span aria-hidden>/</span> {meta.title}</nav>
          <h1 className="display-lg mt-4 text-ivory">{meta.h1}</h1>
          <p lang={rx.lang} className="mt-4 max-w-2xl text-ivory/85">{guide.intro}</p>
        </div>
      </section>
      <div className="container-page grid max-w-4xl gap-10 py-12">
        <SignCalculator kind={kind} />
        <section className="card p-6 sm:p-8" aria-labelledby="explainer">
          <h2 id="explainer" className="font-display text-2xl text-plum sm:text-3xl">{t("What your {thing} means", { thing: lowerFirst(meta.title) })}</h2>
          <Prose text={guide.explainer} className="mt-3" lang={rx.lang} />
        </section>
        <Faqs items={guide.faqs} title={t("Questions people ask")} lang={rx.lang} />
        <nav aria-label={t("More calculators")} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CALC_KINDS.filter((k) => k !== kind).map(tr).map((c) => (
            <Link key={c.path} href={c.path} className="card block p-5 transition hover:-translate-y-0.5">
              <p className="font-display text-xl text-plum">{c.h1.split(":")[0]}</p>
              <p lang={rx.lang} className="mt-1 text-sm text-muted">{c.blurb}</p>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

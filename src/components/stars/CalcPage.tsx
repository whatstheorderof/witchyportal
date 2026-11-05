import type { Metadata } from "next";
import Link from "@/i18n/client";
import { CALCS, CALC_KINDS, type CalcKind } from "@/lib/astro/calc-meta";
import { CALC_GUIDE } from "@/lib/astro/text/stars/guides";
import { absoluteUrl, breadcrumbLd, faqLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { SignCalculator } from "./SignCalculator";
import { Faqs, Prose } from "./Faqs";

export const calcMetadata = (kind: CalcKind): Metadata =>
  pageMeta({ title: `${CALCS[kind].metaTitle} | Witchy Portal`, absoluteTitle: true, description: CALCS[kind].metaDescription, path: CALCS[kind].path });

/** A single-purpose calculator landing page. */
export function CalcPage({ kind }: { kind: CalcKind }) {
  const meta = CALCS[kind], guide = CALC_GUIDE[kind];
  return (
    <>
      <JsonLd data={[
        { "@type": "WebApplication", name: meta.h1, url: absoluteUrl(meta.path), applicationCategory: "LifestyleApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: 0, priceCurrency: "GBP" }, publisher: { "@id": absoluteUrl("/#organization") } },
        breadcrumbLd([["Calculators", "/calculators"], [meta.title, meta.path]]),
        faqLd(guide.faqs),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-ivory/70"><Link href="/calculators" className="hover:text-ivory">Calculators</Link> <span aria-hidden>/</span> {meta.title}</nav>
          <h1 className="display-lg mt-4 text-ivory">{meta.h1}</h1>
          <p className="mt-4 max-w-2xl text-ivory/85">{guide.intro}</p>
        </div>
      </section>
      <div className="container-page grid max-w-4xl gap-10 py-12">
        <SignCalculator kind={kind} />
        <section className="card p-6 sm:p-8" aria-labelledby="explainer">
          <h2 id="explainer" className="font-display text-2xl text-plum sm:text-3xl">What your {meta.title.toLowerCase()} means</h2>
          <Prose text={guide.explainer} className="mt-3" />
        </section>
        <Faqs items={guide.faqs} />
        <nav aria-label="More calculators" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CALC_KINDS.filter((k) => k !== kind).map((k) => (
            <Link key={k} href={CALCS[k].path} className="card block p-5 transition hover:-translate-y-0.5">
              <p className="font-display text-xl text-plum">{CALCS[k].h1.split(":")[0]}</p>
              <p className="mt-1 text-sm text-muted">{CALCS[k].blurb}</p>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

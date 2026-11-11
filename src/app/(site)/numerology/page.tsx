import Link from "@/i18n/client";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { PageHero } from "@/components/Section";
import { Prose } from "@/components/stars/Faqs";
import { JsonLd } from "@/components/JsonLd";
import { NumerologyCalc } from "@/components/numerology/NumerologyCalc";
import { breadcrumbLd, faqLd } from "@/lib/seo";
import { NUM_KEYS, numSlug } from "@/lib/numerology";
import { CORE_NUMBERS, NUMBERS, NUM_HOW, NUM_INTRO, NUM_NOTE, PERSONAL_YEARS } from "@/lib/astro/text/stars/numerology";

export async function generateMetadata() {
  const { t } = await getReadings();
  return localeMeta({
    title: t("Numerology calculator: find your life path number"),
    description: t("Free numerology calculator: find your life path, birthday, expression, soul urge and personality numbers and your personal year, with the meaning of every number in Yulia Moon's words."),
    path: "/numerology",
  });
}

export default async function NumerologyPage() {
  const rx = await getReadings();
  const { t } = rx, L = rx.lang;
  const numbers = rx.deep(NUMBERS);
  const core = Object.fromEntries(Object.entries(CORE_NUMBERS).map(([k, v]) => [k, { label: t(v.label), text: rx(v.text) }])) as Record<keyof typeof CORE_NUMBERS, { label: string; text: string }>;
  const years = rx.deep(PERSONAL_YEARS);
  return (
    <>
      <JsonLd data={[breadcrumbLd([[t("Numerology"), "/numerology"]]), faqLd([{ question: t("How do I calculate my life path number?"), answer: rx(NUM_HOW).split("\n\n")[0] }])]} />
      <PageHero image="redCandles" eyebrow={t("Numerology")} title={t("Your numbers and what they mean")} intro={t("Find your life path number from your birth date, and the numbers hidden in your name.")} />
      <div className="container-page py-14 lg:py-20">
        <div className="max-w-3xl"><Prose text={rx(NUM_INTRO)} lang={L} /></div>
        <div className="mt-10"><NumerologyCalc numbers={numbers} core={core} years={years} /></div>
        <section className="mt-14" aria-labelledby="nm-all">
          <h2 id="nm-all" className="font-display text-3xl text-plum">{t("The life path numbers")}</h2>
          <ul lang={L} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NUM_KEYS.map((n) => (
              <li key={n}>
                <Link href={`/numerology/${numSlug(n)}`} className="card flex h-full gap-4 p-5 transition hover:-translate-y-0.5">
                  <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lavender/60 font-display text-2xl text-plum">{n}</span>
                  <span>
                    <span className="block font-display text-2xl text-plum">{t("Life path {n}", { n })}: {numbers[n].title}</span>
                    <span className="mt-1 block text-[0.95rem] text-ink/80">{numbers[n].summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-14 max-w-3xl" aria-labelledby="nm-how">
          <h2 id="nm-how" className="font-display text-3xl text-plum">{t("How the numbers are calculated")}</h2>
          <Prose text={rx(NUM_HOW)} className="mt-3" lang={L} />
        </section>
        <div className="mt-14 grid gap-4 rounded-[2rem] bg-plum-deep p-6 text-ivory sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-display text-3xl">{t("Want to go deeper?")}</p>
            <p className="mt-2 text-ivory/80">{t("Your numbers are one piece of the picture. Yulia's personal readings bring together your chart, the cards and your questions.")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/services" className="btn-light">{t("Personal readings")}</Link>
            <Link href="/birth-chart" className="btn-outline border-ivory/40 text-ivory hover:bg-ivory/10">{t("Free birth chart")}</Link>
          </div>
        </div>
        <p lang={L} className="mt-8 max-w-3xl text-xs text-muted">{rx(NUM_NOTE)}</p>
      </div>
    </>
  );
}

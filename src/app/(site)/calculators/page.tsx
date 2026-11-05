import Link from "@/i18n/client";
import { CALCS, CALC_KINDS } from "@/lib/astro/calc-meta";
import { breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata() {
  const rx = await getReadings();
  return localeMeta({
    title: rx.t("Free Astrology Calculators — Rising, Moon, Venus, Mars and Saturn Return | Witchy Portal"),
    absoluteTitle: true,
    description: rx.t("Free astrology calculators from Witchy Portal: find your rising sign, Moon sign, big three, Venus and Mars signs and your Saturn return dates, with readings from Yulia Moon."),
    path: "/calculators",
  });
}

export default async function Calculators() {
  const rx = await getReadings();
  const t = rx.t;
  return (
    <>
      <JsonLd data={breadcrumbLd([[t("Calculators"), "/calculators"]])} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <p className="eyebrow text-blush">{t("Free tools")}</p>
          <h1 className="display-lg mt-3 text-ivory">{t("Astrology calculators")}</h1>
          <p className="mt-4 max-w-2xl text-ivory/85">{t("Quick answers to the questions everyone asks: what is my rising sign, my Moon sign, my Venus sign? Each calculator uses the real positions of the planets for your birth and explains what it means in Yulia’s words. Your birth details are never stored.")}</p>
        </div>
      </section>
      <div className="container-page grid max-w-5xl gap-8 py-12">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CALC_KINDS.map((k) => (
            <li key={k}>
              <Link href={CALCS[k].path} className="card block h-full p-6 transition hover:-translate-y-0.5">
                <p className="font-display text-2xl text-plum">{t(CALCS[k].h1).split(":")[0]}</p>
                <p lang={rx.lang} className="mt-2 text-ink/80">{rx(CALCS[k].blurb)}</p>
                <p className="mt-3 text-sm text-muted">{CALCS[k].time === "required" ? t("Needs your birth time") : CALCS[k].time === "helpful" ? t("Birth time helps") : t("Birth date and place")}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/birth-chart" className="rounded-[2rem] bg-plum-deep p-6 text-ivory"><p className="font-display text-2xl">{t("Full birth chart")}</p><p className="mt-1 text-ivory/80">{t("Every planet, house and aspect, free.")}</p></Link>
          <Link href="/chinese-zodiac" className="card p-6"><p className="font-display text-2xl text-plum">{t("Chinese zodiac")}</p><p className="mt-1 text-ink/80">{t("Find your animal and element.")}</p></Link>
          <Link href="/compatibility" className="card p-6"><p className="font-display text-2xl text-plum">{t("Compatibility")}</p><p className="mt-1 text-ink/80">{t("Signs, love signs and charts together.")}</p></Link>
        </div>
      </div>
    </>
  );
}

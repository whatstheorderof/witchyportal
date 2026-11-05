import Link from "@/i18n/client";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { breadcrumbLd } from "@/lib/seo";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Section";
import { CompatPicker } from "@/components/stars/CompatPicker";
import { SYNASTRY_PRICE } from "@/lib/astro/compat";

export async function generateMetadata() {
  const rx = await getReadings();
  return localeMeta({
    title: rx.t("Star Sign Compatibility Test: Love & Friendship | Witchy Portal"),
    absoluteTitle: true,
    description: rx.t("Free star sign compatibility test: choose two zodiac signs to see how you match in love and friendship — plus Venus love-sign compatibility and full birth chart compatibility."),
    path: "/compatibility",
  });
}

export default async function CompatibilityHub() {
  const { t } = await getReadings();
  return (
    <>
      <JsonLd data={[breadcrumbLd([[t("Compatibility"), "/compatibility"]])]} />
      <PageHero image="dance" eyebrow={t("Compatibility")} title={t("Star sign compatibility test")} intro={t("How do your signs get on — in love, in friendship, in conversation? Choose two signs, then go deeper with your love signs or your whole birth charts.")} />
      <div className="container-page grid gap-14 py-12 lg:py-16">
        <CompatPicker />
        <div className="grid gap-5 md:grid-cols-2">
          <Link href="/compatibility/love" className="card group p-7">
            <p className="eyebrow">{t("Free · birth dates only")}</p>
            <h2 className="mt-2 font-display text-3xl text-plum">{t("Love sign compatibility")}</h2>
            <p className="mt-2 text-ink/80">{t("Your Venus signs show how you each love, flirt and show affection. Enter two birth dates to see how your love styles meet.")}</p>
          </Link>
          <Link href="/compatibility/birth-chart" className="group rounded-[2rem] bg-plum-deep p-7 text-ivory">
            <p className="eyebrow text-blush">{t("Full report")} · {SYNASTRY_PRICE.label}</p>
            <h2 className="mt-2 font-display text-3xl text-ivory">{t("Birth chart compatibility")}</h2>
            <p className="mt-2 text-ivory/80">{t("Compare your whole charts: every connection between your planets, where you light up each other’s lives, and your scores for love, passion, communication, stability and growth.")}</p>
          </Link>
        </div>
        <section aria-labelledby="all-h">
          <h2 id="all-h" className="display-md">{t("Every pairing")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SIGNS.map((a, i) => (
              <div key={a} className="card p-5">
                <h3 className="font-display text-xl text-plum"><span aria-hidden className="me-1">{SIGN_INFO[a].glyph}</span>{t("{sign} with…", { sign: t(a) })}</h3>
                <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {SIGNS.map((b, j) => {
                    const [x, y] = i <= j ? [a, b] : [b, a];
                    return <li key={b}><Link className="link-underline" href={`/compatibility/${x.toLowerCase()}-and-${y.toLowerCase()}`}>{t(b)}</Link></li>;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

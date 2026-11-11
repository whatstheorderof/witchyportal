import Link from "@/i18n/client";
import { notFound } from "next/navigation";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/stars/Faqs";
import { breadcrumbLd } from "@/lib/seo";
import { WITCHES, WITCH_TYPES, type WitchType } from "@/lib/astro/text/stars/quizzes";
import { CORRESPONDENCES, KIND_LABEL } from "@/lib/astro/text/stars/correspondences";

type Props = { params: Promise<{ type: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => WITCH_TYPES.map((type) => ({ type }));
const isType = (s: string): s is WitchType => (WITCH_TYPES as string[]).includes(s);

export async function generateMetadata({ params }: Props) {
  const type = (await params).type;
  if (!isType(type)) return { title: "Not found" };
  const rx = await getReadings();
  const w = rx.deep(WITCHES[type]);
  return localeMeta({ title: rx.t("You are a {witch}", { witch: w.title }), description: w.summary, path: `/quizzes/which-witch/${type}` });
}

export default async function WitchResult({ params }: Props) {
  const type = (await params).type;
  if (!isType(type)) notFound();
  const rx = await getReadings();
  const { t } = rx, L = rx.lang;
  const w = rx.deep(WITCHES[type]);
  const sections: [string, string][] = [[t("Your magic"), w.about], [t("Your gifts"), w.gifts], [t("Watch out for"), w.watch]];
  return (
    <>
      <JsonLd data={breadcrumbLd([[t("Quizzes"), "/quizzes"], [t("Which witch are you?"), "/quizzes/which-witch"], [w.title, `/quizzes/which-witch/${type}`]])} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/quizzes" className="hover:text-ivory">{t("Quizzes")}</Link> <span aria-hidden>/</span> <Link href="/quizzes/which-witch" className="hover:text-ivory">{t("Which witch are you?")}</Link></nav>
          <p className="eyebrow mt-6 text-blush">{t("You are a…")}</p>
          <h1 lang={L} className="display-lg mt-2 text-ivory">{w.title}</h1>
          <p lang={L} className="mt-3 text-sm uppercase tracking-[0.15em] text-blush">{w.keywords.join(" · ")}</p>
          <p lang={L} className="mt-5 max-w-2xl text-lg text-ivory/85">{w.summary}</p>
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        {sections.map(([h, text]) => <section key={h} className="card p-6 sm:p-8"><h2 className="font-display text-2xl text-plum sm:text-3xl">{h}</h2><Prose text={text} className="mt-3" lang={L} /></section>)}
        <section className="rounded-[2rem] bg-blush/50 p-6 sm:p-8">
          <p className="eyebrow">{t("Yulia’s ritual")}</p>
          <Prose text={w.practice} className="mt-2" lang={L} />
        </section>
        <section aria-labelledby="kit">
          <h2 id="kit" className="font-display text-2xl text-plum sm:text-3xl">{t("Your witch’s kit")}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {WITCHES[type].kit.map((slug) => {
              const c = CORRESPONDENCES[slug];
              return (
                <li key={slug}>
                  <Link href={`/correspondences/${slug}`} className="card block h-full p-5 transition hover:-translate-y-0.5">
                    <span className="block text-xs uppercase tracking-[0.15em] text-plum-soft">{t(KIND_LABEL[c.kind].one)}</span>
                    <span className="mt-1 block font-display text-2xl text-plum">{t(c.name)}</span>
                    <span lang={L} className="mt-1 block text-sm text-ink/80">{rx(c.summary)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        <div className="flex flex-wrap gap-3">
          <Link href="/quizzes/which-witch" className="btn-primary">{t("Take the quiz again")}</Link>
          <Link href="/quizzes/feral-goddess-rising" className="btn-outline">{t("Is Feral Goddess Rising for me?")}</Link>
        </div>
        <nav aria-label={t("All the witches")}>
          <ul className="flex flex-wrap gap-2">
            {WITCH_TYPES.filter((x) => x !== type).map((x) => <li key={x}><Link href={`/quizzes/which-witch/${x}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-lavender/40">{rx(WITCHES[x].title)}</Link></li>)}
          </ul>
        </nav>
      </div>
    </>
  );
}

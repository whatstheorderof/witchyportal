import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { WitchQuiz } from "@/components/quiz/Quiz";
import { breadcrumbLd } from "@/lib/seo";
import Link from "@/i18n/client";
import { WITCHES, WITCH_QUIZ, WITCH_QUIZ_INTRO, WITCH_TYPES } from "@/lib/astro/text/stars/quizzes";

export async function generateMetadata() {
  const { t } = await getReadings();
  return localeMeta({
    title: t("Which witch are you? Take the quiz"),
    description: t("Are you a sea witch, green witch, moon witch, hearth witch, crystal witch or wild witch? Take Yulia Moon's seven-question quiz and find your magic."),
    path: "/quizzes/which-witch",
  });
}

export default async function WitchQuizPage() {
  const rx = await getReadings();
  const { t } = rx;
  return (
    <>
      <JsonLd data={breadcrumbLd([[t("Quizzes"), "/quizzes"], [t("Which witch are you?"), "/quizzes/which-witch"]])} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/quizzes" className="hover:text-ivory">{t("Quizzes")}</Link></nav>
          <h1 className="display-lg mt-6 text-ivory">{t("Which witch are you?")}</h1>
          <p lang={rx.lang} className="mt-4 max-w-2xl text-ivory/85">{rx(WITCH_QUIZ_INTRO)}</p>
        </div>
      </section>
      <div className="container-page max-w-3xl py-12">
        <WitchQuiz questions={rx.deep(WITCH_QUIZ)} />
        <nav aria-label={t("All the witches")} className="mt-12">
          <h2 className="font-display text-2xl text-plum">{t("All the witches")}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {WITCH_TYPES.map((w) => <li key={w}><Link href={`/quizzes/which-witch/${w}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-lavender/40">{rx(WITCHES[w].title)}</Link></li>)}
          </ul>
        </nav>
      </div>
    </>
  );
}

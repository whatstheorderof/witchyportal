import Link from "@/i18n/client";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { JsonLd } from "@/components/JsonLd";
import { RetreatQuiz } from "@/components/quiz/Quiz";
import { WaitlistForm } from "@/components/forms";
import { breadcrumbLd } from "@/lib/seo";
import { getRetreatBySlug } from "@/lib/queries";
import { RETREAT_QUIZ, RETREAT_QUIZ_INTRO, RETREAT_RESULTS } from "@/lib/astro/text/stars/quizzes";

const SLUG = "awaken-the-wild-goddess";

export async function generateMetadata() {
  const { t } = await getReadings();
  return localeMeta({
    title: t("Is Feral Goddess Rising for me? Take the quiz"),
    description: t("Six honest questions to see whether Feral Goddess Rising, Yulia Moon's seven-day witchy retreat for women by the sea, is right for you."),
    path: "/quizzes/feral-goddess-rising",
  });
}

export default async function RetreatQuizPage() {
  const rx = await getReadings();
  const { t } = rx;
  const retreat = await getRetreatBySlug(SLUG).catch(() => null);
  return (
    <>
      <JsonLd data={breadcrumbLd([[t("Quizzes"), "/quizzes"], [t("Is Feral Goddess Rising for me?"), "/quizzes/feral-goddess-rising"]])} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label={t("Breadcrumb")} className="text-sm text-ivory/70"><Link href="/quizzes" className="hover:text-ivory">{t("Quizzes")}</Link></nav>
          <h1 className="display-lg mt-6 text-ivory">{t("Is Feral Goddess Rising for me?")}</h1>
          <p lang={rx.lang} className="mt-4 max-w-2xl text-ivory/85">{rx(RETREAT_QUIZ_INTRO)}</p>
        </div>
      </section>
      <div className="container-page max-w-3xl py-12">
        <RetreatQuiz questions={rx.deep(RETREAT_QUIZ)} results={rx.deep(RETREAT_RESULTS)}>
          <section className="card p-6 sm:p-8" aria-labelledby="quiz-waitlist">
            <h2 id="quiz-waitlist" className="font-display text-3xl text-plum">{t("Join the waitlist")}</h2>
            <p className="mt-2 text-ink/80">{t("Be the first to hear when dates and prices for Feral Goddess Rising are announced. Joining the waitlist is not a booking and commits you to nothing.")}</p>
            <div className="mt-5">
              {retreat ? <WaitlistForm retreatId={retreat.id} departures={[]} /> : <Link href={`/retreats/${SLUG}#waitlist`} className="btn-primary">{t("Join the waitlist")}</Link>}
            </div>
            <p className="mt-5 text-sm"><Link href={`/retreats/${SLUG}`} className="text-plum link-underline">{t("Read everything about the retreat")}</Link></p>
          </section>
        </RetreatQuiz>
      </div>
    </>
  );
}

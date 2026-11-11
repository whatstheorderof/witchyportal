import Link from "@/i18n/client";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { PageHero } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export async function generateMetadata() {
  const { t } = await getReadings();
  return localeMeta({
    title: t("Witchy quizzes: which witch are you?"),
    description: t("Quick quizzes from Yulia Moon: find out which kind of witch you are, and whether the Feral Goddess Rising retreat is right for you."),
    path: "/quizzes",
  });
}

export default async function QuizzesPage() {
  const { t } = await getReadings();
  const quizzes = [
    { href: "/quizzes/which-witch", title: t("Which witch are you?"), text: t("Sea, green, moon, hearth, crystal or wild: seven questions to find your kind of magic."), time: t("{n} questions", { n: 7 }) },
    { href: "/quizzes/feral-goddess-rising", title: t("Is Feral Goddess Rising for me?"), text: t("Six honest questions to see whether Yulia's seven-day retreat for women is your next step."), time: t("{n} questions", { n: 6 }) },
  ];
  return (
    <>
      <JsonLd data={breadcrumbLd([[t("Quizzes"), "/quizzes"]])} />
      <PageHero image="wings" eyebrow={t("Quizzes")} title={t("A little witchy self-discovery")} intro={t("Quick, playful quizzes to learn something about yourself. Your answers stay in your browser.")} />
      <div className="container-page py-14 lg:py-20">
        <ul className="grid gap-5 md:grid-cols-2">
          {quizzes.map((q) => (
            <li key={q.href}>
              <Link href={q.href} className="card flex h-full flex-col p-6 transition hover:-translate-y-0.5 sm:p-8">
                <span className="text-sm uppercase tracking-[0.15em] text-plum-soft">{q.time}</span>
                <span className="mt-2 font-display text-3xl text-plum">{q.title}</span>
                <span className="mt-2 text-ink/80">{q.text}</span>
                <span className="btn-primary mt-6 self-start">{t("Start the quiz")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

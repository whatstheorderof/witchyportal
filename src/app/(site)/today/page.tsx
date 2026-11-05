import Link from "@/i18n/client";
import { getReadings } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import { msg } from "@/i18n/config";
import { YourDay } from "@/components/stars/YourDay";

export async function generateMetadata() {
  const rx = await getReadings();
  return localeMeta({
    title: rx.t("Your day in the stars"),
    description: rx("Your astrological day at a glance: today's Moon, your horoscope, love, work and energy ratings, and a small ritual from Yulia."),
    path: "/today",
  });
}

const MORE = [["/horoscope", msg("All horoscopes")], ["/this-week-in-astrology", msg("This week in astrology")], ["/compatibility", msg("Compatibility")], ["/tarot", msg("Card of the day")], ["/moon/phases", msg("Moon phases")]];

export default async function TodayPage() {
  const { t } = await getReadings();
  return (
    <div className="min-h-[100svh] bg-plum-deep pt-24 pb-28 lg:pt-32">
      <div className="container-page max-w-3xl">
        <h1 className="sr-only">{t("Your day in the stars")}</h1>
        <YourDay light full />
        <nav aria-label={t("More from the stars")} className="mt-8 flex flex-wrap gap-2">
          {MORE.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-full border border-ivory/30 px-4 py-2 text-sm text-ivory hover:bg-ivory/10">{t(label)}</Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

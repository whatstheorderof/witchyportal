import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { YourDay } from "@/components/stars/YourDay";

export const metadata: Metadata = pageMeta({
  title: "Your day in the stars",
  description: "Your astrological day at a glance: today's Moon, your horoscope, love, work and energy ratings, and a small ritual from Yulia.",
  path: "/today",
});

export default function TodayPage() {
  return (
    <div className="min-h-[100svh] bg-plum-deep pt-24 pb-28 lg:pt-32">
      <div className="container-page max-w-3xl">
        <h1 className="sr-only">Your day in the stars</h1>
        <YourDay light full />
        <nav aria-label="More from the stars" className="mt-8 flex flex-wrap gap-2">
          {[["/horoscope", "All horoscopes"], ["/this-week-in-astrology", "This week in astrology"], ["/compatibility", "Compatibility"], ["/tarot", "Card of the day"], ["/moon/phases", "Moon phases"]].map(([href, label]) => (
            <Link key={href} href={href} className="rounded-full border border-ivory/30 px-4 py-2 text-sm text-ivory hover:bg-ivory/10">{label}</Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

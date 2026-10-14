import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { listRetreats } from "@/lib/queries";
import { PageHero, EmptyState } from "@/components/Section";
import { RetreatCard } from "@/components/RetreatCard";
import Link from "next/link";
import { getSetting } from "@/lib/settings";
import { retreatEmailOf } from "@/lib/contact-links";
import { RetreatEmailNote } from "@/components/RetreatEmail";

export const metadata: Metadata = pageMeta({
  title: "Witchy retreats",
  description: "Small-group witchy retreats with Yulia Moon: seven days of tarot, crystal and candle rituals, sea ceremonies, island boat trips and dancing on the sand. See dates, prices and availability.",
  path: "/retreats",
});

export default async function RetreatsPage() {
  const [retreats, contact] = await Promise.all([listRetreats(), getSetting("contact")]);
  const email = retreatEmailOf(contact);
  return (
    <>
      <PageHero eyebrow="Retreats" title="Gatherings by the sea" intro="Small-group retreats woven with movement, ritual, rest and salt water. Choose your dates, see exactly what's included, and reserve your place." />
      <section className="container-page py-14 lg:py-20">
        {retreats.length === 0 ? (
          <EmptyState title="New retreats are being dreamed up" text="There are no retreats open right now. Join the newsletter to hear first when dates are released." action={<Link href="/contact" className="btn-outline mt-2">Ask about upcoming dates</Link>} />
        ) : (
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
            {retreats.map((r, i) => <RetreatCard key={r.id} retreat={r} priority={i < 2} />)}
          </div>
        )}
        <RetreatEmailNote email={email} subject="Retreat enquiry" lead="Questions about a retreat?" className="mt-16 border-t border-line pt-8 text-center" />
      </section>
    </>
  );
}

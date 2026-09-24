import type { Metadata } from "next";
import { listPosts } from "@/lib/queries";
import { PageHero, EmptyState } from "@/components/Section";
import { AstrologyCard } from "@/components/PostCards";
import Link from "next/link";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = { title: "Astrology", description: "Short weekly and seasonal astrology wisdom from Yulia Moon." };

export default async function AstrologyPage() {
  const posts = await listPosts("astrology");
  const [first, ...rest] = posts;
  return (
    <>
      <PageHero eyebrow="Astrology" title="Wisdom from the sky" intro="Short weekly and seasonal notes on what the planets are stirring — and a gentle ritual to meet it.">
        <Link href="/birth-chart" className="btn-outline mt-8">Calculate your birth chart <ArrowRight /></Link>
      </PageHero>
      <section className="container-page py-14 lg:py-20">
        {!first ? (
          <EmptyState title="The stars are still aligning" text="The first astrology post is on its way." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2"><AstrologyCard post={first} featured /></div>
            {rest.map((p) => <AstrologyCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Section";
import { LoveCompat } from "@/components/stars/LoveCompat";

export const metadata: Metadata = pageMeta({
  title: "Love Sign Compatibility: Compare Your Venus Signs | Witchy Portal",
  absoluteTitle: true,
  description: "Free love sign compatibility: enter two birth dates to find both Venus signs and see how your love styles, affection and attraction meet — with Yulia's advice.",
  path: "/compatibility/love",
});

export default function LovePage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([["Compatibility", "/compatibility"], ["Love signs", "/compatibility/love"]])]} />
      <PageHero image="red" eyebrow="Compatibility" title="Love sign compatibility" intro="Your Venus sign is your love sign: how you flirt, show affection and feel cherished. Enter two birth dates and see how your love styles meet." />
      <div className="container-page max-w-4xl py-12 lg:py-16"><LoveCompat /></div>
    </>
  );
}

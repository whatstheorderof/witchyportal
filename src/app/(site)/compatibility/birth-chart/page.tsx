import type { Metadata } from "next";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Section";
import { SynastryTool } from "@/components/stars/SynastryTool";
import { SYNASTRY_PRICE } from "@/lib/astro/compat";

export const metadata: Metadata = pageMeta({
  title: "Birth Chart Compatibility Report (Synastry) | Witchy Portal",
  absoluteTitle: true,
  description: "Compare two birth charts: love, passion, communication, stability and growth scores, your strongest connections free, and the full synastry report in Yulia's words.",
  path: "/compatibility/birth-chart",
});

export default function SynastryPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([["Compatibility", "/compatibility"], ["Birth chart compatibility", "/compatibility/birth-chart"]])]} />
      <PageHero image="wade" eyebrow={`Compatibility · full report ${SYNASTRY_PRICE.label}`} title="Birth chart compatibility" intro="Your whole charts, side by side: how your Suns, Moons, Venus and Mars meet, where you light up each other's lives, and what makes your bond work. See your scores and strongest connections free." />
      <div className="container-page max-w-5xl py-12 lg:py-16"><SynastryTool /></div>
    </>
  );
}

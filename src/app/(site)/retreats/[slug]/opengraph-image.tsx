import { getRetreatBySlug } from "@/lib/queries";
import { retreatFacts } from "@/lib/retreat-facts";
import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Retreat with Yulia Moon";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const r = await getRetreatBySlug((await params).slug).catch(() => null);
  if (!r) return ogCard({ eyebrow: "Retreats", title: "Retreats with Yulia Moon" });
  const f = retreatFacts(r);
  const bits = [f.destinationKnown ? f.destination : null, f.datesKnown ? f.dates : null, f.duration, f.priceKnown ? `from ${f.price}` : null].filter(Boolean);
  return ogCard({ eyebrow: "Retreat", title: r.title, subtitle: bits.join(" · ") || r.summary, image: r.hero?.url });
}

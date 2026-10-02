import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Witchy Portal — retreats and everyday magic with Yulia Moon";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({ eyebrow: "Retreats & rituals", title: "Witchy retreats & everyday magic", subtitle: "Seaside retreats, witchy tips, astrology and gentle rituals.", image: "/images/horned-dusk-beach.jpg" });
}

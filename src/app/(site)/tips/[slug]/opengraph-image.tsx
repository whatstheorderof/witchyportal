import { getTipLike } from "@/lib/queries";
import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "A witchy tip from Yulia Moon";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

const LABEL: Record<string, string> = { tip: "Witchy tip", affirmation: "Affirmation", motivation: "Motivation" };

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getTipLike((await params).slug).catch(() => null);
  if (!p) return ogCard({ eyebrow: "Witchy tips", title: "Small, doable magic" });
  const aff = p.type === "affirmation";
  return ogCard({ eyebrow: LABEL[p.type] ?? "Witchy tip", title: aff ? `“${p.title}”` : p.title, italic: aff, subtitle: aff ? null : p.excerpt, image: p.cover?.url ?? "/images/sea-joy.jpg" });
}

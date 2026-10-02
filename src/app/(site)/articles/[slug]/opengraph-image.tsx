import { getPost } from "@/lib/queries";
import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Article from Witchy Portal";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost("article", (await params).slug).catch(() => null);
  return ogCard({ eyebrow: p?.period || p?.topic || "Article", title: p?.title ?? "Witchy Portal", subtitle: p?.excerpt, image: p?.cover?.url ?? "/images/veiled-crown-shore.jpg" });
}

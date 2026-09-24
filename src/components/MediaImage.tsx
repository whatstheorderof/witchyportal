import Image from "next/image";
import type { Media } from "@/db/schema";

export const FALLBACK_IMAGES = {
  sea: { url: "/images/sea-joy.jpg", alt: "A woman with red hair raising her arms in joy, waist-deep in a calm blue sea", width: 2560, height: 1710 },
  veil: { url: "/images/veiled-crown-shore.jpg", alt: "A figure in a black star-flecked veil lifting a jewelled crown at the shoreline at dusk", width: 2560, height: 1710 },
  horns: { url: "/images/horned-dusk-beach.jpg", alt: "A figure with long red hair and horns walks towards the sea at dusk, black chiffon sleeves billowing", width: 2560, height: 1710 },
  sand: { url: "/images/sand-texture-golden.jpg", alt: "Close-up of wind-sculpted sand and a small shell in golden evening light", width: 2560, height: 1710 },
} as const;

type Img = Pick<Media, "url" | "alt"> & { width?: number | null; height?: number | null; kind?: Media["kind"] };

export function MediaImage({
  media, fallback = "sea", className = "", sizes = "100vw", priority, fill = true, alt,
}: {
  media?: Img | null; fallback?: keyof typeof FALLBACK_IMAGES; className?: string; sizes?: string; priority?: boolean; fill?: boolean; alt?: string;
}) {
  const m: Img = media && media.kind !== "video" ? media : FALLBACK_IMAGES[fallback];
  const altText = alt ?? m.alt ?? "";
  if (fill) {
    return <Image src={m.url} alt={altText} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} quality={75} />;
  }
  return <Image src={m.url} alt={altText} width={m.width ?? 1600} height={m.height ?? 1067} sizes={sizes} priority={priority} className={className} />;
}

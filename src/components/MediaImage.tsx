import Image from "next/image";
import type { Media } from "@/db/schema";

export const FALLBACK_IMAGES = {
  sea: { url: "/images/sea-joy.jpg", alt: "A woman with red hair raising her arms in joy, waist-deep in a calm blue sea", width: 2560, height: 1710 },
  veil: { url: "/images/veiled-crown-shore.jpg", alt: "A figure in a black star-flecked veil lifting a jewelled crown at the shoreline at dusk", width: 2560, height: 1710 },
  horns: { url: "/images/horned-dusk-beach.jpg", alt: "A figure with long red hair and horns walks towards the sea at dusk, black chiffon sleeves billowing", width: 2560, height: 1710 },
  sand: { url: "/images/sand-texture-golden.jpg", alt: "Close-up of wind-sculpted sand and a small shell in golden evening light", width: 2560, height: 1710 },
  golden: { url: "/images/yulia-golden-beach.jpg", alt: "Yulia with long red hair on a sunlit beach in a sheer mesh dress, the sea behind her", width: 1603, height: 2400 },
  dance: { url: "/images/beach-dance-sky.jpg", alt: "Yulia dancing on the beach, arms raised to a clear blue sky", width: 2400, height: 1603 },
  wade: { url: "/images/sea-arms-raised.jpg", alt: "Yulia standing waist-deep in a calm blue sea with her arms raised above her head", width: 2400, height: 1603 },
  horizon: { url: "/images/sea-arms-raised-back.jpg", alt: "Yulia seen from behind, waist-deep in the sea with both arms raised to the sky", width: 2400, height: 1603 },
  red: { url: "/images/horns-red-dress.jpg", alt: "A figure with horns and long hair in a red dress walking across the sand under a deep blue sky", width: 1603, height: 2400 },
  crownPortrait: { url: "/images/crown-portrait-dusk.jpg", alt: "Yulia in a jewelled crown at dusk, hands framing her face", width: 1603, height: 2400 },
  wings: { url: "/images/horns-veil-wings.jpg", alt: "A horned figure seen from behind on the beach, sheer black sleeves spread like wings", width: 2400, height: 1603 },
  veilWings: { url: "/images/veil-wings-back.jpg", alt: "A horned figure seen from behind, a sheer black veil billowing out like wings against a pale sky", width: 2400, height: 1603 },
  veiledSea: { url: "/images/veiled-crown-sea.jpg", alt: "A figure in a jewelled crown and star-flecked black veil, hands raised, in front of the sea", width: 2400, height: 1603 },
  hornsPortrait: { url: "/images/horns-portrait-beach.jpg", alt: "Yulia wearing horns and sheer black sleeves on the beach, one hand raised", width: 1603, height: 2400 },
  cape: { url: "/images/cape-walk-sea.jpg", alt: "A horned figure walking towards the sea in a long sheer black cape", width: 2400, height: 1603 },
  crown: { url: "/images/crown-dusk-shore.jpg", alt: "Yulia in a jewelled crown and sheer black sleeves on the shore at dusk", width: 2400, height: 1603 },
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

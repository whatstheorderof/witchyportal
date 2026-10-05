import type { Metadata } from "next";
import Link from "next/link";
import { socials } from "@content/socials";
import { MediaImage } from "@/components/MediaImage";
import { MoonMark } from "@/components/Logo";
import { ArrowRight, ExternalIcon, PlayIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Socials",
  description: "Follow Yulia Moon and Witchy Portal on Instagram, YouTube and Etsy.",
};

const iconBase = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", "aria-hidden": true, className: "h-6 w-6" };
const ICONS: Record<string, React.ReactNode> = {
  camera: (<svg {...iconBase}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".8" fill="currentColor" /></svg>),
  play: <PlayIcon className="ml-0.5 h-6 w-6" />,
  bag: (<svg {...iconBase}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>),
  star: (<svg {...iconBase}><path d="M12 3c.6 4.5 2.5 6.4 7 7-4.5.6-6.4 2.5-7 7-.6-4.5-2.5-6.4-7-7 4.5-.6 6.4-2.5 7-7Z" /></svg>),
};

export default function SocialsPage() {
  return (
    <section className="relative overflow-hidden bg-ivory-deep pt-24 pb-20 lg:pt-36 lg:pb-28">
      <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-blush/60 blur-3xl" />
      <div className="relative mx-auto w-full max-w-xl px-5">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-ivory shadow-(--shadow-lift)">
            <MediaImage fallback="golden" sizes="112px" priority className="object-[center_20%]" />
          </div>
          <p className="eyebrow mt-6 flex items-center gap-2"><MoonMark className="h-4 w-4" />Find Yulia online</p>
          <h1 className="display-lg mt-2">Socials</h1>
          <p className="mt-3 max-w-md text-muted">Follow along for rituals, readings, Ask a Witch answers and retreat news.</p>
        </div>

        <ul className="mt-10 grid gap-3">
          {socials.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-20 items-center gap-4 rounded-2xl bg-white/80 p-4 ring-1 ring-line transition hover:-translate-y-0.5 hover:bg-white hover:shadow-(--shadow-soft) sm:p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-plum text-ivory">{ICONS[s.icon] ?? ICONS.star}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-2xl leading-tight text-plum">{s.label}</span>
                  <span className="block text-sm text-plum-soft">{s.platform} · {s.handle}</span>
                  {s.description && <span className="mt-1 block text-sm text-muted">{s.description}</span>}
                </span>
                <ExternalIcon className="h-5 w-5 shrink-0 text-plum transition group-hover:translate-x-0.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link href="/retreats" className="btn-primary">See retreats <ArrowRight /></Link>
          <Link href="/ask-a-witch" className="btn-outline">Watch Ask a Witch</Link>
        </div>
      </div>
    </section>
  );
}

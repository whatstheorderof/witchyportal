import Link from "next/link";
import { ArrowRight } from "./Icons";

export function SectionHeading({
  eyebrow, title, intro, href, linkLabel, as: As = "h2", className = "",
}: { eyebrow?: string; title: string; intro?: string; href?: string; linkLabel?: string; as?: "h1" | "h2"; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <As className={`mt-3 ${As === "h1" ? "display-lg" : "display-md"}`}>{title}</As>
        {intro && <p className="mt-4 max-w-xl text-lg text-muted">{intro}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex items-center gap-2 text-plum link-underline shrink-0">
          {linkLabel ?? "View all"} <ArrowRight />
        </Link>
      )}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line/70 bg-ivory-deep pt-28 pb-12 lg:pt-40 lg:pb-16">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-blush/60 blur-3xl" />
      <div className="container-page relative">
        {eyebrow && <p className="eyebrow reveal">{eyebrow}</p>}
        <h1 className="display-lg reveal mt-3 max-w-3xl">{title}</h1>
        {intro && <p className="reveal mt-5 max-w-2xl text-lg text-muted">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span aria-hidden className="font-display text-5xl text-lavender-deep">☾</span>
      <h2 className="font-display text-2xl text-plum">{title}</h2>
      <p className="max-w-md text-muted">{text}</p>
      {action}
    </div>
  );
}

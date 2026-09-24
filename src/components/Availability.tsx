import type { Departure } from "@/db/schema";

export const AVAILABILITY_LABEL: Record<Departure["availability"], string> = {
  available: "Places available",
  limited: "Few places left",
  waitlist: "Waitlist open",
  sold_out: "Sold out",
  closed: "Bookings closed",
};

const STYLE: Record<Departure["availability"], string> = {
  available: "bg-success/10 text-success ring-success/20",
  limited: "bg-blush text-plum ring-blush-deep/30",
  waitlist: "bg-lavender/70 text-plum ring-lavender-deep/30",
  sold_out: "bg-ink/5 text-muted ring-ink/10",
  closed: "bg-ink/5 text-muted ring-ink/10",
};

export function AvailabilityBadge({ value, note, className = "", solid = false }: { value: Departure["availability"]; note?: string | null; className?: string; solid?: boolean }) {
  const style = solid ? `bg-ivory/95 ring-transparent ${STYLE[value].split(" ").filter((c) => c.startsWith("text-")).join(" ")}` : STYLE[value];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${style} ${className}`}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {note || AVAILABILITY_LABEL[value]}
    </span>
  );
}

export const isBookable = (a: Departure["availability"]) => a === "available" || a === "limited";

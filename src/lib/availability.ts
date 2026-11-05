import type { Departure } from "@/db/schema";
import { msg } from "@/i18n/config";

export const AVAILABILITY_LABEL: Record<Departure["availability"], string> = {
  available: msg("Places available"),
  limited: msg("Few places left"),
  waitlist: msg("Waitlist open"),
  sold_out: msg("Sold out"),
  closed: msg("Bookings closed"),
};

export const isBookable = (a: Departure["availability"]) => a === "available" || a === "limited";

import "server-only";
import { msg } from "@/i18n/config";
import { z } from "zod";
import { getPlace } from "./places";
import { getChartProvider } from "./provider";
import type { ChartResult } from "./types";

/**
 * Shared validation for endpoints that calculate a natal chart. Birth details
 * are used in memory only — never logged or stored. Place coordinates and time
 * zone come from our place index, not from the browser.
 */
export const birthSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
  placeId: z.number().int().positive(),
});

export async function chartFromBody(body: unknown): Promise<{ chart: ChartResult } | { error: string; status: number }> {
  const parsed = birthSchema.safeParse(body);
  if (!parsed.success) return { error: msg("Please check your birth date, time and place."), status: 400 };
  const { date, time, placeId } = parsed.data;
  const year = Number(date.slice(0, 4));
  if (year < 1800 || year > 2100) return { error: msg("Please enter a birth year between 1800 and 2100."), status: 400 };
  const d = new Date(date + "T00:00:00Z");
  if (Number.isNaN(+d) || d.toISOString().slice(0, 10) !== date) return { error: msg("That date doesn't exist."), status: 400 };
  const place = await getPlace(placeId);
  if (!place) return { error: msg("We couldn't find that birthplace. Please choose it from the list."), status: 400 };
  try {
    const chart = await getChartProvider().calculate({ date, time, latitude: place.latitude, longitude: place.longitude, timeZone: place.timeZone, placeLabel: place.label });
    return { chart };
  } catch (e) {
    console.error("chart calculation failed", e instanceof Error ? e.message : "unknown");
    return { error: msg("We couldn't calculate this right now. Please try again later."), status: 502 };
  }
}

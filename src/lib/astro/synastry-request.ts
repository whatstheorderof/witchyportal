import "server-only";
import { msg } from "@/i18n/config";
import { z } from "zod";
import { getPlace } from "./places";
import { getChartProvider } from "./provider";
import { synastry } from "./compat";
import { RX_EN, type Rx } from "@/i18n/readings";

/** Validates two people's birth details and builds the compatibility report (in memory only). */
const person = z.object({
  name: z.string().trim().max(40).optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
  placeId: z.number().int().positive(),
});
export const synastrySchema = z.object({ a: person, b: person, session: z.string().max(200).optional() });
export type SynastryInput = z.infer<typeof synastrySchema>;

export async function buildSynastry(body: unknown, rx: Rx = RX_EN) {
  const parsed = synastrySchema.safeParse(body);
  if (!parsed.success) return { error: msg("Please check both people's birth dates, times and places.") } as const;
  const charts = [];
  const labels: string[] = [];
  for (const p of [parsed.data.a, parsed.data.b]) {
    const year = Number(p.date.slice(0, 4));
    const d = new Date(p.date + "T00:00:00Z");
    if (year < 1800 || year > 2100 || Number.isNaN(+d) || d.toISOString().slice(0, 10) !== p.date) return { error: msg("Please enter real birth dates between 1800 and 2100.") } as const;
    const place = await getPlace(p.placeId);
    if (!place) return { error: msg("Please choose both birthplaces from the list.") } as const;
    labels.push(place.label);
    charts.push(await getChartProvider().calculate({ date: p.date, time: p.time, latitude: place.latitude, longitude: place.longitude, timeZone: place.timeZone, placeLabel: place.label }));
  }
  const nameA = parsed.data.a.name || rx.t("Person one");
  const nameB = parsed.data.b.name || rx.t("Person two");
  return { input: parsed.data, report: synastry(charts[0], charts[1], nameA, nameB, rx) } as const;
}

import "server-only";
/**
 * Site content (retreats, settings, policies…) in other languages. Content
 * stays English in the database; translations live in src/i18n/content/*.json,
 * keyed by the English text. When the English changes, that piece shows in
 * English until its translation is updated (`npm run i18n:missing` lists them).
 */
type Tc = <S extends string | null | undefined>(s: S) => S;

type RetreatText = {
  title: string; tagline: string; location: string; country: string; summary: string; concept: string; personalMessage: string;
  guestExperience: string; benefits: string[]; activities: { title: string; description: string }[];
  itinerary: { day: string; title: string; description: string }[]; inclusions: string[]; exclusions: string[];
  accommodation: string; duration: string; meals: string; travel: string; forMe: { question: string; answer: string }[]; terms: string;
};

/** Every text field of a retreat, translated (structure and everything else unchanged). */
export function translateRetreat<R extends object>(input: R, tc: Tc): R {
  const r = input as Partial<RetreatText> & { faqs?: { question: string; answer: string }[]; gallery?: unknown[]; departures?: { label?: string | null; availabilityNote?: string | null; options: { label: string; description: string; balanceNote: string | null }[] }[] };
  const s = <K extends keyof RetreatText>(k: K) => (typeof r[k] === "string" ? { [k]: tc(r[k] as string) } : {});
  return {
    ...r,
    ...s("title"), ...s("tagline"), ...s("location"), ...s("country"), ...s("summary"), ...s("concept"), ...s("personalMessage"),
    ...s("guestExperience"), ...s("accommodation"), ...s("duration"), ...s("meals"), ...s("travel"), ...s("terms"),
    ...(r.benefits ? { benefits: r.benefits.map(tc) } : {}),
    ...(r.inclusions ? { inclusions: r.inclusions.map(tc) } : {}),
    ...(r.exclusions ? { exclusions: r.exclusions.map(tc) } : {}),
    ...(r.activities ? { activities: r.activities.map((a) => ({ ...a, title: tc(a.title), description: tc(a.description) })) } : {}),
    ...(r.itinerary ? { itinerary: r.itinerary.map((d) => ({ ...d, day: tc(d.day), title: tc(d.title), description: tc(d.description) })) } : {}),
    ...(r.forMe ? { forMe: r.forMe.map((q) => ({ ...q, question: tc(q.question), answer: tc(q.answer) })) } : {}),
    ...(r.faqs ? { faqs: r.faqs.map((q) => ({ ...q, question: tc(q.question), answer: tc(q.answer) })) } : {}),
    ...(Array.isArray(r.gallery) ? { gallery: r.gallery.map((m) => (m && typeof m === "object" ? { ...m, alt: tc((m as { alt?: string | null }).alt), caption: tc((m as { caption?: string | null }).caption) } : m)) } : {}),
    ...(Array.isArray(r.departures) ? { departures: r.departures.map((d) => ({ ...d, label: tc(d.label), availabilityNote: tc(d.availabilityNote), options: (d.options ?? []).map((o) => ({ ...o, label: tc(o.label), description: tc(o.description), balanceNote: tc(o.balanceNote) })) })) } : {}),
  } as R;
}

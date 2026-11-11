/**
 * The visitor's own daily tarot pull and journal, kept only in this browser
 * (localStorage). Nothing here is sent to the server.
 */

/** Today's date in the UK (YYYY-MM-DD) — the site's day boundary. */
export const ukToday = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(d);

const read = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, v: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* private mode or storage full */
  }
};

/* ---------------- Daily pull ---------------- */

export type DailyPull = { n: number; reversed: boolean };
const PULLS = "wp:daily-pulls";

export const loadPulls = () => read<Record<string, DailyPull>>(PULLS, {});

/** Today's pull, drawing (and remembering) one the first time it's asked for. */
export function pullForToday(deckSize: number, draw = false): DailyPull | null {
  const pulls = loadPulls();
  const today = ukToday();
  if (pulls[today]) return pulls[today];
  if (!draw) return null;
  const r = new Uint32Array(2);
  crypto.getRandomValues(r);
  const pull = { n: r[0] % deckSize, reversed: r[1] % 4 === 0 };
  // Keep the last 400 days only.
  const keys = Object.keys(pulls).sort().slice(-399);
  write(PULLS, { ...Object.fromEntries(keys.map((k) => [k, pulls[k]])), [today]: pull });
  return pull;
}

/** Days in a row with a pull, counting back from today. */
export function streak(pulls = loadPulls()): number {
  let n = 0;
  const d = new Date();
  while (pulls[ukToday(d)]) {
    n++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return n;
}

/* ---------------- Journal ---------------- */

export type JournalKind = "tarot" | "dream" | "moon" | "note";
export type JournalEntry = { id: string; date: string; kind: JournalKind; title: string; text: string; card?: DailyPull };
const JOURNAL = "wp:journal";

export const loadJournal = () => read<JournalEntry[]>(JOURNAL, []).sort((a, b) => (a.date === b.date ? b.id.localeCompare(a.id) : b.date.localeCompare(a.date)));
export const saveJournal = (entries: JournalEntry[]) => write(JOURNAL, entries);
export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

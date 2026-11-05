"use client";

import Link, { useI18n } from "@/i18n/client";
import { msg } from "@/i18n/config";
import type { AspectFactor, ChartResult } from "@/lib/astro/types";
import { formatDegree } from "@/lib/astro/types";
import type { FactorSection, NatalReport, Reading } from "@/lib/astro/report-types";
import { ASPECT_INFO, BODY_INFO, SIGN_INFO } from "@/lib/astro/interpretations";
import { ASPECT_COLOUR, ChartWheel } from "./ChartWheel";
import { MoonGlyph } from "@/components/MoonGlyph";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const signHref = (s: string) => `/zodiac/${s.toLowerCase()}`;
/** "1st" in English; translations place the number with {n}. */
const ordinalT = (t: (s: string, v?: Record<string, string | number>) => string, n: number) => t("{n}th", { n }) === `${n}th` ? `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}` : t("{n}th", { n });
const ASPECT_NAME = { conjunction: msg("Conjunction"), sextile: msg("Sextile"), square: msg("Square"), trine: msg("Trine"), opposition: msg("Opposition") } as const;
/** Composed labels used above, listed for the translation extractor. */
export const REPORT_UI = [msg("{a} conjunct {b}, orb {orb}"), msg("{a} sextile {b}, orb {orb}"), msg("{a} square {b}, orb {orb}"), msg("{a} trine {b}, orb {orb}"), msg("{a} opposite {b}, orb {orb}"), msg("Rising"), msg("North Node (true)"), msg("South Node (true)"), msg("Part of Fortune")];
const glyphOf = (f: string) => (f === "Ascendant" ? "AC" : f === "Midheaven" ? "MC" : f === "Part of Fortune" ? "⊗" : f === "South Node" ? "☋︎" : BODY_INFO[f as keyof typeof BODY_INFO]?.glyph ?? "");

export function offsetLabel(m: number | null) {
  if (m == null) return "";
  const sign = m >= 0 ? "+" : "−";
  const a = Math.abs(m);
  return `UTC${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(Math.round(a % 60)).padStart(2, "0")}`;
}

function Paragraphs({ items, className = "" }: { items: string[]; className?: string }) {
  const { rlang } = useI18n();
  return <div lang={rlang} className={`grid gap-3 leading-relaxed text-ink/85 ${className}`}>{items.map((p, i) => <p key={i}>{p}</p>)}</div>;
}

function ReadingBlock({ r, level = 3 }: { r: Reading; level?: 3 | 4 }) {
  const H = `h${level}` as "h3" | "h4";
  const { rlang } = useI18n();
  return (
    <div>
      <H className={level === 3 ? "font-display text-2xl text-plum" : "font-display text-xl text-plum"}>{r.heading}</H>
      {r.short && <p lang={rlang} className="mt-1 font-display text-lg italic text-plum-soft">{r.short}</p>}
      <Paragraphs items={r.paragraphs} className="mt-3" />
    </div>
  );
}

function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-40 border-t border-line pt-12 print:break-before-page">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={`${id}-h`} className="display-md mt-2">{title}</h2>
      {intro && <div className="mt-3 max-w-3xl text-ink/80">{intro}</div>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Table({ caption, head, children, minWidth = 420 }: { caption: string; head: string[]; children: React.ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-line" tabIndex={0} aria-label={caption}>
      <table className="w-full text-left text-[0.95rem]" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-ivory-deep text-xs uppercase tracking-wider text-muted">
          <tr>{head.map((h) => <th key={h} scope="col" className="px-3 py-3 sm:px-4">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line bg-white/70">{children}</tbody>
      </table>
    </div>
  );
}

/* ---------------- Charts ---------------- */

const GRID_FACTORS: AspectFactor[] = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "North Node", "Lilith", "Ascendant", "Midheaven"];

function AspectGrid({ chart }: { chart: ChartResult }) {
  const { t } = useI18n();
  const factors = GRID_FACTORS.filter((f) => chart.timeKnown || (f !== "Ascendant" && f !== "Midheaven"));
  const find = (a: AspectFactor, b: AspectFactor) => chart.aspects.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
  return (
    <div className="overflow-x-auto" tabIndex={0} aria-label={t("Aspect grid — scroll sideways")}>
      <table className="border-collapse text-center text-sm" aria-describedby="grid-note">
        <caption className="sr-only">{t("Aspect grid: each cell shows the aspect between the planet in that row and the planet in that column")}</caption>
        <tbody>
          {factors.map((row, i) => (
            <tr key={row}>
              {factors.slice(0, i).map((col) => {
                const a = find(row, col);
                return (
                  <td key={col} className="h-9 w-9 border border-line bg-white/80 p-0 sm:h-10 sm:w-10" title={a ? t(`{a} ${ASPECT_INFO[a.type].label} {b}, orb {orb}`, { a: t(row), b: t(col), orb: formatDegree(a.orb) }) : undefined}>
                    {a ? <span style={{ color: ASPECT_COLOUR[a.type] }} className="block leading-tight"><span aria-hidden className="text-base">{ASPECT_INFO[a.type].symbol}</span><span className="block text-[0.6rem] text-muted">{Math.floor(a.orb)}°</span><span className="sr-only">{t(`{a} ${ASPECT_INFO[a.type].label} {b}`, { a: t(row), b: t(col) })}</span></span> : null}
                  </td>
                );
              })}
              <th scope="row" className="h-9 w-9 border border-line bg-ivory-deep p-0 font-normal text-plum sm:h-10 sm:w-10" title={t(row)}><span aria-hidden>{glyphOf(row)}</span><span className="sr-only">{t(row)}</span></th>
            </tr>
          ))}
        </tbody>
      </table>
      <p id="grid-note" className="mt-3 text-xs text-muted">
        {(["conjunction", "sextile", "square", "trine", "opposition"] as const).map((k) => (
          <span key={k} className="me-4 inline-flex items-center gap-1"><span aria-hidden style={{ color: ASPECT_COLOUR[k] }}>{ASPECT_INFO[k].symbol}</span>{t(ASPECT_INFO[k].label)}</span>
        ))}
        <span className="inline-block">{t("Numbers are the orb in degrees.")}</span>
      </p>
    </div>
  );
}

function Bars({ title, rows, total }: { title: string; rows: { name: string; count: number; colour: string }[]; total: number }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-plum-soft">{title}</h3>
      <ul className="mt-3 grid gap-2">
        {rows.map((r) => (
          <li key={r.name} className="grid grid-cols-[5.5rem_1fr_1.5rem] items-center gap-3 text-sm">
            <span>{r.name}</span>
            <span className="h-3 overflow-hidden rounded-full bg-ivory-deep" aria-hidden><span className="block h-full rounded-full" style={{ width: `${(r.count / total) * 100}%`, background: r.colour }} /></span>
            <span className="text-end tabular-nums">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Planet sections ---------------- */

function FactorBlock({ s, chart }: { s: FactorSection; chart: ChartResult }) {
  const { t, rlang } = useI18n();
  const p = chart.placements.find((x) => x.body === s.factor)!;
  const name = t(s.factor === "North Node" ? "The Moon's Nodes" : s.factor === "Lilith" ? "Black Moon Lilith" : s.factor);
  return (
    <article id={s.id} className="card scroll-mt-40 p-6 sm:p-10" aria-labelledby={`${s.id}-title`}>
      <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 id={`${s.id}-title`} className="flex items-baseline gap-3 font-display text-3xl text-plum sm:text-4xl"><span aria-hidden>{BODY_INFO[s.factor].glyph}</span>{name}</h3>
        <p className="text-sm text-muted">
          {p.signUncertain && p.possibleSigns ? p.possibleSigns.map((x) => t(x)).join(t(" or ")) : <><Link href={signHref(p.sign)} className="link-underline">{t(p.sign)}</Link> {formatDegree(p.degree)}</>}
          {p.house ? ` · ${t("{ord} house", { ord: ordinalT(t, p.house), n: p.house })}` : ""}{p.retrograde && s.factor !== "North Node" ? ` · ${t("retrograde")}` : ""}
        </p>
      </header>
      <p lang={rlang} className="mt-3 text-[0.95rem] text-muted">{s.intro}</p>
      <div className="mt-8 grid gap-10">
        {s.sign.map((r) => <ReadingBlock key={r.heading} r={r} level={4} />)}
        {p.signUncertain && <p className="rounded-xl bg-lavender/40 px-4 py-3 text-sm text-plum">{t("The Moon changed sign on your birth day. Both readings are shown — the one that fits better is probably yours. A birth time would settle it.")}</p>}
        {s.house && <ReadingBlock r={s.house} level={4} />}
        {s.aspects.length > 0 && (
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-plum-soft">{t("Aspects")}</h4>
            <div className="mt-4 grid gap-6">
              {s.aspects.map((a) => (
                <div key={a.heading} className="rounded-2xl bg-ivory-deep/60 p-5">
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-xl text-plum"><span aria-hidden className="me-2" style={{ color: ASPECT_COLOUR[a.type] }}>{ASPECT_INFO[a.type].symbol}</span>{a.heading}</span>
                    <span className="text-xs text-muted">{t("orb {orb} · strength {n}%", { orb: formatDegree(a.orb), n: a.strength })}</span>
                  </p>
                  <Paragraphs items={a.paragraphs} className="mt-2 text-[0.97rem]" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------------- Report ---------------- */

export interface ContactLinks {
  whatsapp: string | null;
  email: string | null;
}

export function Report({ chart, report, name, contact }: { chart: ChartResult; report: NatalReport; name: string; contact: ContactLinks }) {
  const { t, rlang } = useI18n();
  const S = (x: string) => t(x);
  const asc = chart.angles.find((a) => a.name === "Ascendant");
  const moon = chart.placements.find((p) => p.body === "Moon")!;
  const south = chart.points.find((p) => p.name === "South Node");
  const fortune = chart.points.find((p) => p.name === "Part of Fortune");
  const title = name.trim() ? t("{name}’s birth chart", { name: name.trim() }) : t("Your birth chart");
  const day = chart.input.date.split("-").reverse().join("/");
  const when = chart.timeKnown ? t("{date} at {time} ({offset})", { date: day, time: chart.input.time ?? "", offset: offsetLabel(chart.utcOffsetMinutes) }) : t("{date} · birth time unknown", { date: day });

  const nav = [
    ["overview", t("Overview")], ["positions", t("Positions")], ["aspects", t("Aspects")], ["points", t("Fortune & Nodes")], ["moon-phase", t("Moon")],
    ["planets", t("Planets")], ...(chart.timeKnown ? [["houses", t("Houses")]] : []), ["balance", t("Balance")], ["reading", t("Reading with Yulia")],
  ] as [string, string][];

  const enquiry = t("Hi Yulia, I've just made my free birth chart on Witchy Portal and I'd love a full birth chart reading with you.");
  const waLink = contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(enquiry)}` : null;

  return (
    <div className="grid min-w-0 gap-16 [&>*]:min-w-0">
      {chart.isFixture && (
        <p role="alert" className="rounded-2xl border-2 border-dashed border-warning bg-warning/10 p-4 font-medium text-warning">
          {t("DEVELOPMENT FIXTURE — these placements are sample data, not your real chart.")}
        </p>
      )}

      <nav aria-label={t("Report contents")} className="no-scrollbar sticky top-[4.5rem] z-10 -mx-5 flex gap-2 overflow-x-auto border-y border-line bg-ivory/95 px-5 py-3 backdrop-blur print:hidden lg:top-20">
        {nav.map(([id, label]) => <a key={id} href={`#${id}`} className="chip min-h-10 shrink-0 whitespace-nowrap">{label}</a>)}
        <button type="button" onClick={() => window.print()} className="chip min-h-10 shrink-0 whitespace-nowrap">{t("Print / save PDF")}</button>
      </nav>

      {/* OVERVIEW */}
      <section id="overview" aria-labelledby="chart-result" className="scroll-mt-40 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid place-items-center rounded-[2rem] bg-ivory-deep p-3 sm:p-8"><ChartWheel chart={chart} /></div>
        <div>
          <p className="eyebrow">{t("Natal chart report")}</p>
          <h2 id="chart-result" tabIndex={-1} className="display-md mt-3 outline-none">{title}</h2>
          <p className="mt-2 text-sm text-muted">{chart.input.placeLabel} · {when}</p>
          <ul className="mt-6 grid gap-4">
            {report.bigThree.map((b) => (
              <li key={b.factor} className="rounded-2xl bg-white/70 p-5 ring-1 ring-line">
                <p className="flex items-baseline gap-2 font-display text-2xl text-plum">
                  {b.factor !== "Ascendant" && <span aria-hidden>{glyphOf(b.factor)}</span>}{t("{body} in {sign}", { body: t(b.factor === "Ascendant" ? "Rising" : b.factor), sign: t(b.sign) })}
                </p>
                <p lang={rlang} className="mt-1 text-[0.95rem] text-ink/80">{b.short}</p>
              </li>
            ))}
            {!asc && (
              <li className="rounded-2xl bg-white/70 p-5 ring-1 ring-line">
                <p className="font-display text-2xl text-plum">{t("Rising sign unknown")}</p>
                <p className="mt-1 text-[0.95rem] text-ink/80">{t("Your Ascendant changes about every two hours, so it needs an accurate birth time — as do the houses and the Part of Fortune.")}</p>
              </li>
            )}
          </ul>
        </div>
      </section>

      {chart.notes.length > 0 && (
        <div className="rounded-2xl bg-lavender/35 p-5 text-sm text-plum">
          <p className="font-medium">{t("Notes about this chart")}</p>
          <ul className="mt-2 list-disc space-y-1 ps-5">{chart.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
        </div>
      )}

      {/* POSITIONS */}
      <Section id="positions" eyebrow={t("The technical chart")} title={t("Planet positions, Ascendant & houses")} intro={<p>{t("Where each planet sat, by sign and degree, and which house of your chart it falls in. Signs link to their full guide. ℞ means the planet appeared to move backwards (retrograde) at your birth.")}</p>}>
        <div className={`grid gap-8 ${chart.houseCusps ? "xl:grid-cols-[1.4fr_1fr]" : ""}`}>
          <Table caption={t("Planet positions")} head={[t("Planet"), t("Sign"), t("Degree"), t("House")]}>
            {chart.placements.map((p) => (
              <tr key={p.body}>
                <th scope="row" className="px-3 py-2.5 font-medium sm:px-4"><span aria-hidden className="me-2 text-plum">{BODY_INFO[p.body].glyph}</span>{t(p.body)}</th>
                <td className="px-3 py-2.5 sm:px-4">{p.signUncertain && p.possibleSigns ? p.possibleSigns.map(S).join(" / ") : <Link href={signHref(p.sign)} className="hover:underline"><span aria-hidden>{SIGN_INFO[p.sign].glyph} </span>{t(p.sign)}</Link>}</td>
                <td className="px-3 py-2.5 tabular-nums sm:px-4">{p.signUncertain ? "—" : formatDegree(p.degree)}{p.retrograde && p.body !== "North Node" && <span className="ms-1 text-muted" title={t("Retrograde")}>℞</span>}</td>
                <td className="px-3 py-2.5 sm:px-4">{p.house ? ROMAN[p.house - 1] : "—"}</td>
              </tr>
            ))}
            {chart.angles.filter((a) => a.name === "Ascendant" || a.name === "Midheaven").map((a) => (
              <tr key={a.name} className="bg-ivory-deep/40">
                <th scope="row" className="px-3 py-2.5 font-medium sm:px-4"><span aria-hidden className="me-2 text-plum">{glyphOf(a.name)}</span>{t(a.name)}</th>
                <td className="px-3 py-2.5 sm:px-4"><Link href={signHref(a.sign)} className="hover:underline"><span aria-hidden>{SIGN_INFO[a.sign].glyph} </span>{t(a.sign)}</Link></td>
                <td className="px-3 py-2.5 tabular-nums sm:px-4">{formatDegree(a.degree)}</td>
                <td className="px-3 py-2.5 sm:px-4">{a.name === "Ascendant" ? "I" : "X"}</td>
              </tr>
            ))}
          </Table>
          {chart.houseCusps && (
            <Table caption={t("House cusps ({system})", { system: chart.houseSystem === "placidus" ? "Placidus" : t("Whole Sign") })} head={[t("House"), t("Sign on cusp"), t("Degree")]} minWidth={300}>
              {chart.houseCusps.map((c, i) => {
                const sign = (Object.keys(SIGN_INFO) as (keyof typeof SIGN_INFO)[])[Math.floor(c / 30)];
                return (
                  <tr key={i}>
                    <th scope="row" className="px-3 py-2.5 font-medium sm:px-4">{ROMAN[i]}{i === 0 ? " · ASC" : i === 9 ? " · MC" : ""}</th>
                    <td className="px-3 py-2.5 sm:px-4"><span aria-hidden>{SIGN_INFO[sign].glyph} </span>{t(sign)}</td>
                    <td className="px-3 py-2.5 tabular-nums sm:px-4">{formatDegree(c % 30)}</td>
                  </tr>
                );
              })}
            </Table>
          )}
        </div>
        <div className="mt-10 grid gap-8 rounded-[2rem] bg-white/70 p-6 ring-1 ring-line sm:grid-cols-3 sm:p-8">
          <Bars title={t("Elements")} total={10} rows={report.balance.elements.map((e) => ({ name: t(e.name), count: e.count, colour: { Fire: "#d98c7c", Earth: "#b99a6b", Air: "#9d8cc4", Water: "#6f7fb3" }[e.name] }))} />
          <Bars title={t("Modalities")} total={10} rows={report.balance.modalities.map((m) => ({ name: t(m.name), count: m.count, colour: "#7d67a6" }))} />
          <Bars title={t("Polarity")} total={10} rows={[{ name: t("Masculine"), count: chart.balance.polarity.masculine, colour: "#c97f73" }, { name: t("Feminine"), count: chart.balance.polarity.feminine, colour: "#4a1f40" }]} />
          <p className="text-xs text-muted sm:col-span-3">{t("Counted over the ten planets, Sun to Pluto. Masculine = fire and air signs (outward, active); feminine = earth and water signs (inward, receptive).")}</p>
        </div>
      </Section>

      {/* ASPECTS */}
      <Section id="aspects" eyebrow={t("How your planets talk to each other")} title={t("Aspects")} intro={<p>{t("Aspects are the angles between planets. Conjunctions blend two energies; trines and sextiles flow easily; squares and oppositions create the friction that drives growth. The orb is how far from exact the aspect is — the smaller, the stronger. Each aspect is read in full under the first planet involved, below.")}</p>}>
        <div className="grid gap-10 xl:grid-cols-[auto_1fr]">
          <AspectGrid chart={chart} />
          <Table caption={t("All aspects")} head={[t("Planet"), t("Aspect"), t("Planet"), t("Orb"), t("Strength")]}>
            {chart.aspects.map((a, i) => (
              <tr key={i}>
                <td className="px-3 py-2 sm:px-4">{t(a.a)}</td>
                <td className="px-3 py-2 sm:px-4" style={{ color: ASPECT_COLOUR[a.type] }}><span aria-hidden>{ASPECT_INFO[a.type].symbol} </span>{t(ASPECT_NAME[a.type])}</td>
                <td className="px-3 py-2 sm:px-4">{t(a.b)}</td>
                <td className="px-3 py-2 tabular-nums sm:px-4">{formatDegree(a.orb)}{a.applying != null && <span className="ms-1 text-xs text-muted">{a.applying ? t("a") : t("s")}</span>}</td>
                <td className="px-3 py-2 sm:px-4"><span className="inline-block h-2 rounded-full bg-plum/70 align-middle" style={{ width: `${Math.max(4, a.strength * 0.6)}px` }} aria-hidden /> <span className="text-xs text-muted">{a.strength}%</span></td>
              </tr>
            ))}
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted">{t("a = applying (getting closer to exact), s = separating.")}</p>
      </Section>

      {/* FORTUNE & NODES */}
      <Section id="points" eyebrow={t("Sensitive points")} title={t("Part of Fortune & South Node")} intro={<p>{t("The Part of Fortune is calculated from your Ascendant, Sun and Moon (classic formula: Ascendant + Moon − Sun) and shows where joy and ease flow. The South Node sits exactly opposite the true North Node.")}</p>}>
        <Table caption={t("Part of Fortune and the Nodes")} head={[t("Point"), t("Sign"), t("Degree"), t("House")]} minWidth={360}>
          {[...(fortune ? [fortune] : []), ...chart.placements.filter((p) => p.body === "North Node").map((p) => ({ name: "North Node (true)", sign: p.sign, degree: p.degree, house: p.house })), ...(south ? [{ ...south, name: "South Node (true)" }] : [])].map((p) => (
            <tr key={p.name}>
              <th scope="row" className="px-3 py-2.5 font-medium sm:px-4"><span aria-hidden className="me-2 text-plum">{glyphOf(p.name.startsWith("North") ? "North Node" : p.name.startsWith("South") ? "South Node" : p.name)}</span>{t(p.name)}</th>
              <td className="px-3 py-2.5 sm:px-4"><span aria-hidden>{SIGN_INFO[p.sign].glyph} </span>{t(p.sign)}</td>
              <td className="px-3 py-2.5 tabular-nums sm:px-4">{formatDegree(p.degree)}</td>
              <td className="px-3 py-2.5 sm:px-4">{p.house ? ROMAN[p.house - 1] : "—"}</td>
            </tr>
          ))}
        </Table>
        {!fortune && <p className="mt-3 text-sm text-muted">{t("The Part of Fortune needs your Ascendant, so it can’t be calculated without a birth time.")}</p>}
        {report.fortune && (
          <div className="card mt-8 grid gap-8 p-6 sm:p-10">
            <ReadingBlock r={report.fortune.sign} />
            {report.fortune.house && <ReadingBlock r={report.fortune.house} />}
          </div>
        )}
      </Section>

      {/* MOON */}
      <Section id="moon-phase" eyebrow={t("Your Moon")} title={t("Moon position & the phase you were born under")}>
        <div className="grid items-start gap-8 lg:grid-cols-[18rem_1fr]">
          <div className="grid justify-items-center gap-4 rounded-[2rem] bg-plum-deep p-8 text-center text-ivory">
            {chart.moonPhase ? <MoonGlyph angle={chart.moonPhase.elongation} size={120} /> : <span aria-hidden className="text-6xl">☽</span>}
            <div>
              <p className="font-display text-2xl">{t(chart.moonPhase?.name ?? "Phase uncertain")}</p>
              <dl className="mt-3 grid gap-1 text-sm text-ivory/85">
                <div><dt className="inline">{t("Sign:")} </dt><dd className="inline">{moon.signUncertain && moon.possibleSigns ? moon.possibleSigns.map(S).join(t(" or ")) : `${t(moon.sign)} ${formatDegree(moon.degree)}`}</dd></div>
                {moon.house && <div><dt className="inline">{t("House:")} </dt><dd className="inline">{ordinalT(t, moon.house)}</dd></div>}
                {chart.moonPhase && <div><dt className="inline">{t("Lit:")} </dt><dd className="inline">{Math.round(chart.moonPhase.illumination * 100)}%</dd></div>}
                {chart.moonPhase && <div><dt className="inline">{t("Ahead of the Sun:")} </dt><dd className="inline">{Math.round(chart.moonPhase.elongation)}°</dd></div>}
              </dl>
            </div>
          </div>
          {report.moonPhase ? <div className="card p-6 sm:p-10"><ReadingBlock r={report.moonPhase} /></div> : <p className="text-muted">{t("Without a birth time the Moon’s exact position — and so its phase — can’t be fixed for this day.")}</p>}
        </div>
      </Section>

      {/* PLANETS */}
      <Section id="planets" eyebrow={t("Your report")} title={t("The planets in your chart")} intro={<p>{t("Each planet in its sign and house, and the aspects it makes. These are the parts that make up the whole of you — some will contradict each other, just as people do. Read them as a conversation, not a verdict.")}</p>}>
        <div className="grid gap-8">
          {[...report.planets, ...report.points].map((s) => <FactorBlock key={s.id} s={s} chart={chart} />)}
          {south && <p className="-mt-4 px-2 text-sm text-muted">{south.house ? t("Your South Node is in {sign}, in the {ord} house — the familiar pattern the North Node reading above describes moving beyond.", { sign: t(south.sign), ord: ordinalT(t, south.house), n: south.house }) : t("Your South Node is in {sign} — the familiar pattern the North Node reading above describes moving beyond.", { sign: t(south.sign) })}</p>}
        </div>
      </Section>

      {/* HOUSES */}
      {chart.timeKnown && report.houses.length > 0 && (
        <Section id="houses" eyebrow={t("Where life happens")} title={t("The houses")} intro={<p>{t("The houses divide your chart into twelve areas of life. The sign on each house’s cusp (its starting edge) colours how you approach that area; planets inside a house bring it into focus.")}</p>}>
          <div className="grid gap-8">
            {report.ascendant && <div className="card p-6 sm:p-10"><ReadingBlock r={report.ascendant} /></div>}
            {report.midheaven && <div className="card p-6 sm:p-10"><ReadingBlock r={report.midheaven} /></div>}
            <div className="grid gap-3">
              {report.houses.map((h) => (
                <details key={h.house} className="card group p-5 sm:p-6" open={h.house === 1}>
                  <summary className="flex min-h-11 cursor-pointer list-none items-baseline gap-3 [&::-webkit-details-marker]:hidden">
                    <span className="eyebrow shrink-0">{t("House {n}", { n: ROMAN[h.house - 1] })}</span>
                    <span className="font-display text-xl text-plum">{t(h.cuspSign)} {formatDegree(h.cuspDegree)}</span>
                    {h.planets.length > 0 && <span className="text-sm text-muted">· {h.planets.map(S).join(", ")}</span>}
                    <span aria-hidden className="ms-auto text-plum transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-4 grid gap-5">
                    <p lang={rlang} className="text-[0.95rem] text-muted">{h.intro}</p>
                    {h.cusp ? <ReadingBlock r={h.cusp} level={4} /> : <p className="text-[0.95rem] text-ink/80">{h.house === 1 ? t("The 1st house cusp is your Ascendant — see its reading above.") : t("The 10th house cusp is your Midheaven — see its reading above.")}</p>}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* BALANCE */}
      <Section id="balance" eyebrow={t("The shape of your chart")} title={t("Elements & modalities")} intro={<p>{t("How your ten planets are spread across the four elements and three modalities. A dominant or missing element says a lot about your natural temperament.")}</p>}>
        <div className="grid gap-6 md:grid-cols-2">
          {[...report.balance.elements, ...report.balance.modalities].filter((b) => b.text).map((b) => (
            <div key={b.name} className="card p-6">
              <h3 className="font-display text-2xl text-plum">{t(b.note === "strong" ? "Strong {name}" : "Little or no {name}", { name: t(b.name) })} <span className="text-base text-muted">{t("({n} of 10)", { n: b.count })}</span></h3>
              <p lang={rlang} className="mt-3 leading-relaxed text-ink/85">{b.text}</p>
            </div>
          ))}
          {[...report.balance.elements, ...report.balance.modalities].every((b) => !b.text) && <p className="text-ink/80">{t("Your chart is evenly balanced — no element or modality dominates or is missing.")}</p>}
        </div>
      </Section>

      {/* CTA */}
      <section id="reading" aria-labelledby="reading-h" className="scroll-mt-40 overflow-hidden rounded-[2rem] bg-plum-deep p-8 text-ivory sm:p-12 print:hidden">
        <p className="eyebrow text-blush">{t("A full birth chart assessment")}</p>
        <h2 id="reading-h" className="display-md mt-3 text-ivory">{t("Go deeper with Yulia")}</h2>
        <p className="mt-4 max-w-2xl text-lg text-ivory/85">{t("This report reads each placement on its own. In a personal birth chart reading, Yulia brings it all together — the patterns, the blocks and the gifts — and gives you recommendations for your life right now.")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {waLink && <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary bg-ivory text-plum hover:bg-blush">{t("Message Yulia on WhatsApp")}</a>}
          {contact.email && <a href={`mailto:${contact.email}?subject=${encodeURIComponent(t("Full birth chart reading"))}&body=${encodeURIComponent(enquiry)}`} className="btn-outline border-ivory/40 text-ivory hover:bg-ivory/10">{t("Email Yulia")}</a>}
          <Link href="/services#astrology-reports" className="btn-outline border-ivory/40 text-ivory hover:bg-ivory/10">{t("Astrology readings")}</Link>
        </div>
        <p className="mt-4 text-sm text-ivory/70">{t("Your birth details aren’t sent anywhere — include them in your message if you’d like Yulia to use them.")}</p>
      </section>

      {/* TECHNICAL */}
      <details className="card p-6 text-sm">
        <summary className="cursor-pointer font-display text-xl text-plum">{t("Full birth data & how this chart is calculated")}</summary>
        <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {[
            [t("Place"), chart.input.placeLabel],
            [t("Latitude, longitude"), `${chart.input.latitude.toFixed(4)}°, ${chart.input.longitude.toFixed(4)}°`],
            [t("Local date and time"), `${chart.input.date}${chart.timeKnown ? ` ${chart.input.time}` : ` ${t("(time unknown — noon used)")}`}`],
            [t("Time zone"), `${chart.input.timeZone}${chart.timeKnown ? `, ${offsetLabel(chart.utcOffsetMinutes)}` : ""}`],
            [t("Universal Time"), chart.utc.replace("T", " ").slice(0, 16)],
            [t("Julian Day"), chart.technical.julianDay.toFixed(4)],
            ...(chart.technical.localSiderealTime != null ? [[t("Local sidereal time"), `${Math.floor(chart.technical.localSiderealTime)}h ${String(Math.floor((chart.technical.localSiderealTime % 1) * 60)).padStart(2, "0")}m`]] : []),
            [t("Zodiac"), t("Tropical (Western)")],
            [t("Houses"), chart.houseSystem === "placidus" ? "Placidus" : chart.houseSystem === "whole-sign" ? t("Whole Sign") : t("Not calculated (birth time unknown)")],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2"><dt className="text-muted">{k}:</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <ul className="mt-5 list-disc space-y-1.5 ps-5 text-ink/80">
          <li>{t("Planet positions from {provider}, an open-source astronomy library (VSOP87 / NOVAS models): apparent geocentric positions on the true ecliptic of date, accurate to well under an arcminute.", { provider: chart.provider.name })}</li>
          <li>{t("North Node: true (osculating) node. Lilith: mean Black Moon (mean lunar apogee). Part of Fortune: Ascendant + Moon − Sun.")}</li>
          <li>{t("Aspect orbs: 10° for conjunctions and oppositions, 8° for squares and trines, 5° for sextiles (60% of that between two outer planets); 6°/4°/3° for the North Node and Lilith.")}</li>
          <li>{t("Birth time converted to Universal Time with the IANA time-zone database, including historical daylight-saving and wartime rules. Your details are used once to calculate this page and are never stored.")}</li>
          <li>{t("The written report is original Witchy Portal text, for reflection and entertainment.")}</li>
        </ul>
      </details>
    </div>
  );
}

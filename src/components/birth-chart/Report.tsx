"use client";

import Link from "next/link";
import type { AspectFactor, ChartResult } from "@/lib/astro/types";
import { formatDegree } from "@/lib/astro/types";
import type { FactorSection, NatalReport, Reading } from "@/lib/astro/report-types";
import { ASPECT_INFO, BODY_INFO, SIGN_INFO } from "@/lib/astro/interpretations";
import { ASPECT_COLOUR, ChartWheel } from "./ChartWheel";
import { MoonGlyph } from "@/components/MoonGlyph";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const ordinal = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;
const signHref = (s: string) => `/zodiac/${s.toLowerCase()}`;
const glyphOf = (f: string) => (f === "Ascendant" ? "AC" : f === "Midheaven" ? "MC" : f === "Part of Fortune" ? "⊗" : f === "South Node" ? "☋︎" : BODY_INFO[f as keyof typeof BODY_INFO]?.glyph ?? "");

export function offsetLabel(m: number | null) {
  if (m == null) return "";
  const sign = m >= 0 ? "+" : "−";
  const a = Math.abs(m);
  return `UTC${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(Math.round(a % 60)).padStart(2, "0")}`;
}

function Paragraphs({ items, className = "" }: { items: string[]; className?: string }) {
  return <div className={`grid gap-3 leading-relaxed text-ink/85 ${className}`}>{items.map((p, i) => <p key={i}>{p}</p>)}</div>;
}

function ReadingBlock({ r, level = 3 }: { r: Reading; level?: 3 | 4 }) {
  const H = `h${level}` as "h3" | "h4";
  return (
    <div>
      <H className={level === 3 ? "font-display text-2xl text-plum" : "font-display text-xl text-plum"}>{r.heading}</H>
      {r.short && <p className="mt-1 font-display text-lg italic text-plum-soft">{r.short}</p>}
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
  const factors = GRID_FACTORS.filter((f) => chart.timeKnown || (f !== "Ascendant" && f !== "Midheaven"));
  const find = (a: AspectFactor, b: AspectFactor) => chart.aspects.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
  return (
    <div className="overflow-x-auto" tabIndex={0} aria-label="Aspect grid — scroll sideways">
      <table className="border-collapse text-center text-sm" aria-describedby="grid-note">
        <caption className="sr-only">Aspect grid: each cell shows the aspect between the planet in that row and the planet in that column</caption>
        <tbody>
          {factors.map((row, i) => (
            <tr key={row}>
              {factors.slice(0, i).map((col) => {
                const a = find(row, col);
                return (
                  <td key={col} className="h-9 w-9 border border-line bg-white/80 p-0 sm:h-10 sm:w-10" title={a ? `${row} ${ASPECT_INFO[a.type].label} ${col}, orb ${formatDegree(a.orb)}` : undefined}>
                    {a ? <span style={{ color: ASPECT_COLOUR[a.type] }} className="block leading-tight"><span aria-hidden className="text-base">{ASPECT_INFO[a.type].symbol}</span><span className="block text-[0.6rem] text-muted">{Math.floor(a.orb)}°</span><span className="sr-only">{row} {ASPECT_INFO[a.type].label} {col}</span></span> : null}
                  </td>
                );
              })}
              <th scope="row" className="h-9 w-9 border border-line bg-ivory-deep p-0 font-normal text-plum sm:h-10 sm:w-10" title={row}><span aria-hidden>{glyphOf(row)}</span><span className="sr-only">{row}</span></th>
            </tr>
          ))}
        </tbody>
      </table>
      <p id="grid-note" className="mt-3 text-xs text-muted">
        {(["conjunction", "sextile", "square", "trine", "opposition"] as const).map((t) => (
          <span key={t} className="mr-4 inline-flex items-center gap-1"><span aria-hidden style={{ color: ASPECT_COLOUR[t] }}>{ASPECT_INFO[t].symbol}</span>{ASPECT_INFO[t].label}</span>
        ))}
        <span className="inline-block">Numbers are the orb in degrees.</span>
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
            <span className="text-right tabular-nums">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Planet sections ---------------- */

function FactorBlock({ s, chart }: { s: FactorSection; chart: ChartResult }) {
  const p = chart.placements.find((x) => x.body === s.factor)!;
  const name = s.factor === "North Node" ? "The Moon's Nodes" : s.factor === "Lilith" ? "Black Moon Lilith" : s.factor;
  return (
    <article id={s.id} className="card scroll-mt-40 p-6 sm:p-10" aria-labelledby={`${s.id}-title`}>
      <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 id={`${s.id}-title`} className="flex items-baseline gap-3 font-display text-3xl text-plum sm:text-4xl"><span aria-hidden>{BODY_INFO[s.factor].glyph}</span>{name}</h3>
        <p className="text-sm text-muted">
          {p.signUncertain && p.possibleSigns ? p.possibleSigns.join(" or ") : <><Link href={signHref(p.sign)} className="link-underline">{p.sign}</Link> {formatDegree(p.degree)}</>}
          {p.house ? ` · ${ordinal(p.house)} house` : ""}{p.retrograde && s.factor !== "North Node" ? " · retrograde" : ""}
        </p>
      </header>
      <p className="mt-3 text-[0.95rem] text-muted">{s.intro}</p>
      <div className="mt-8 grid gap-10">
        {s.sign.map((r) => <ReadingBlock key={r.heading} r={r} level={4} />)}
        {p.signUncertain && <p className="rounded-xl bg-lavender/40 px-4 py-3 text-sm text-plum">The Moon changed sign on your birth day. Both readings are shown — the one that fits better is probably yours. A birth time would settle it.</p>}
        {s.house && <ReadingBlock r={s.house} level={4} />}
        {s.aspects.length > 0 && (
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-plum-soft">Aspects</h4>
            <div className="mt-4 grid gap-6">
              {s.aspects.map((a) => (
                <div key={a.heading} className="rounded-2xl bg-ivory-deep/60 p-5">
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-xl text-plum"><span aria-hidden className="mr-2" style={{ color: ASPECT_COLOUR[a.type] }}>{ASPECT_INFO[a.type].symbol}</span>{a.heading}</span>
                    <span className="text-xs text-muted">orb {formatDegree(a.orb)} · strength {a.strength}%</span>
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
  const asc = chart.angles.find((a) => a.name === "Ascendant");
  const moon = chart.placements.find((p) => p.body === "Moon")!;
  const south = chart.points.find((p) => p.name === "South Node");
  const fortune = chart.points.find((p) => p.name === "Part of Fortune");
  const owner = name.trim() ? `${name.trim()}’s` : "Your";
  const when = `${chart.input.date.split("-").reverse().join("/")}${chart.timeKnown ? ` at ${chart.input.time} (${offsetLabel(chart.utcOffsetMinutes)})` : " · birth time unknown"}`;

  const nav = [
    ["overview", "Overview"], ["positions", "Positions"], ["aspects", "Aspects"], ["points", "Fortune & Nodes"], ["moon-phase", "Moon"],
    ["planets", "Planets"], ...(chart.timeKnown ? [["houses", "Houses"]] : []), ["balance", "Balance"], ["reading", "Reading with Yulia"],
  ] as [string, string][];

  const enquiry = `Hi Yulia, I've just made my free birth chart on Witchy Portal and I'd love a full birth chart reading with you.`;
  const waLink = contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(enquiry)}` : null;

  return (
    <div className="grid min-w-0 gap-16 [&>*]:min-w-0">
      {chart.isFixture && (
        <p role="alert" className="rounded-2xl border-2 border-dashed border-warning bg-warning/10 p-4 font-medium text-warning">
          DEVELOPMENT FIXTURE — these placements are sample data, not your real chart.
        </p>
      )}

      <nav aria-label="Report contents" className="no-scrollbar sticky top-[4.5rem] z-10 -mx-5 flex gap-2 overflow-x-auto border-y border-line bg-ivory/95 px-5 py-3 backdrop-blur print:hidden lg:top-20">
        {nav.map(([id, label]) => <a key={id} href={`#${id}`} className="chip min-h-10 shrink-0 whitespace-nowrap">{label}</a>)}
        <button type="button" onClick={() => window.print()} className="chip min-h-10 shrink-0 whitespace-nowrap">Print / save PDF</button>
      </nav>

      {/* OVERVIEW */}
      <section id="overview" aria-labelledby="chart-result" className="scroll-mt-40 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid place-items-center rounded-[2rem] bg-ivory-deep p-3 sm:p-8"><ChartWheel chart={chart} /></div>
        <div>
          <p className="eyebrow">Natal chart report</p>
          <h2 id="chart-result" tabIndex={-1} className="display-md mt-3 outline-none">{owner} birth chart</h2>
          <p className="mt-2 text-sm text-muted">{chart.input.placeLabel} · {when}</p>
          <ul className="mt-6 grid gap-4">
            {report.bigThree.map((b) => (
              <li key={b.factor} className="rounded-2xl bg-white/70 p-5 ring-1 ring-line">
                <p className="flex items-baseline gap-2 font-display text-2xl text-plum">
                  {b.factor !== "Ascendant" && <span aria-hidden>{glyphOf(b.factor)}</span>}{b.factor === "Ascendant" ? "Rising" : b.factor} in {b.sign}
                </p>
                <p className="mt-1 text-[0.95rem] text-ink/80">{b.short}</p>
              </li>
            ))}
            {!asc && (
              <li className="rounded-2xl bg-white/70 p-5 ring-1 ring-line">
                <p className="font-display text-2xl text-plum">Rising sign unknown</p>
                <p className="mt-1 text-[0.95rem] text-ink/80">Your Ascendant changes about every two hours, so it needs an accurate birth time — as do the houses and the Part of Fortune.</p>
              </li>
            )}
          </ul>
        </div>
      </section>

      {chart.notes.length > 0 && (
        <div className="rounded-2xl bg-lavender/35 p-5 text-sm text-plum">
          <p className="font-medium">Notes about this chart</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">{chart.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
        </div>
      )}

      {/* POSITIONS */}
      <Section id="positions" eyebrow="The technical chart" title="Planet positions, Ascendant & houses" intro={<p>Where each planet sat, by sign and degree, and which house of your chart it falls in. Signs link to their full guide. ℞ means the planet appeared to move backwards (retrograde) at your birth.</p>}>
        <div className={`grid gap-8 ${chart.houseCusps ? "xl:grid-cols-[1.4fr_1fr]" : ""}`}>
          <Table caption="Planet positions" head={["Planet", "Sign", "Degree", "House"]}>
            {chart.placements.map((p) => (
              <tr key={p.body}>
                <th scope="row" className="px-3 py-2.5 font-medium sm:px-4"><span aria-hidden className="mr-2 text-plum">{BODY_INFO[p.body].glyph}</span>{p.body}</th>
                <td className="px-3 py-2.5 sm:px-4">{p.signUncertain && p.possibleSigns ? p.possibleSigns.join(" / ") : <Link href={signHref(p.sign)} className="hover:underline"><span aria-hidden>{SIGN_INFO[p.sign].glyph} </span>{p.sign}</Link>}</td>
                <td className="px-3 py-2.5 tabular-nums sm:px-4">{p.signUncertain ? "—" : formatDegree(p.degree)}{p.retrograde && p.body !== "North Node" && <span className="ml-1 text-muted" title="Retrograde">℞</span>}</td>
                <td className="px-3 py-2.5 sm:px-4">{p.house ? ROMAN[p.house - 1] : "—"}</td>
              </tr>
            ))}
            {chart.angles.filter((a) => a.name === "Ascendant" || a.name === "Midheaven").map((a) => (
              <tr key={a.name} className="bg-ivory-deep/40">
                <th scope="row" className="px-3 py-2.5 font-medium sm:px-4"><span aria-hidden className="mr-2 text-plum">{glyphOf(a.name)}</span>{a.name}</th>
                <td className="px-3 py-2.5 sm:px-4"><Link href={signHref(a.sign)} className="hover:underline"><span aria-hidden>{SIGN_INFO[a.sign].glyph} </span>{a.sign}</Link></td>
                <td className="px-3 py-2.5 tabular-nums sm:px-4">{formatDegree(a.degree)}</td>
                <td className="px-3 py-2.5 sm:px-4">{a.name === "Ascendant" ? "I" : "X"}</td>
              </tr>
            ))}
          </Table>
          {chart.houseCusps && (
            <Table caption={`House cusps (${chart.houseSystem === "placidus" ? "Placidus" : "Whole Sign"})`} head={["House", "Sign on cusp", "Degree"]} minWidth={300}>
              {chart.houseCusps.map((c, i) => {
                const sign = (Object.keys(SIGN_INFO) as (keyof typeof SIGN_INFO)[])[Math.floor(c / 30)];
                return (
                  <tr key={i}>
                    <th scope="row" className="px-3 py-2.5 font-medium sm:px-4">{ROMAN[i]}{i === 0 ? " · ASC" : i === 9 ? " · MC" : ""}</th>
                    <td className="px-3 py-2.5 sm:px-4"><span aria-hidden>{SIGN_INFO[sign].glyph} </span>{sign}</td>
                    <td className="px-3 py-2.5 tabular-nums sm:px-4">{formatDegree(c % 30)}</td>
                  </tr>
                );
              })}
            </Table>
          )}
        </div>
        <div className="mt-10 grid gap-8 rounded-[2rem] bg-white/70 p-6 ring-1 ring-line sm:grid-cols-3 sm:p-8">
          <Bars title="Elements" total={10} rows={report.balance.elements.map((e) => ({ name: e.name, count: e.count, colour: { Fire: "#d98c7c", Earth: "#b99a6b", Air: "#9d8cc4", Water: "#6f7fb3" }[e.name] }))} />
          <Bars title="Modalities" total={10} rows={report.balance.modalities.map((m) => ({ name: m.name, count: m.count, colour: "#7d67a6" }))} />
          <Bars title="Polarity" total={10} rows={[{ name: "Masculine", count: chart.balance.polarity.masculine, colour: "#c97f73" }, { name: "Feminine", count: chart.balance.polarity.feminine, colour: "#4a1f40" }]} />
          <p className="text-xs text-muted sm:col-span-3">Counted over the ten planets, Sun to Pluto. Masculine = fire and air signs (outward, active); feminine = earth and water signs (inward, receptive).</p>
        </div>
      </Section>

      {/* ASPECTS */}
      <Section id="aspects" eyebrow="How your planets talk to each other" title="Aspects" intro={<p>Aspects are the angles between planets. Conjunctions blend two energies; trines and sextiles flow easily; squares and oppositions create the friction that drives growth. The orb is how far from exact the aspect is — the smaller, the stronger. Each aspect is read in full under the first planet involved, below.</p>}>
        <div className="grid gap-10 xl:grid-cols-[auto_1fr]">
          <AspectGrid chart={chart} />
          <Table caption="All aspects" head={["Planet", "Aspect", "Planet", "Orb", "Strength"]}>
            {chart.aspects.map((a, i) => (
              <tr key={i}>
                <td className="px-3 py-2 sm:px-4">{a.a}</td>
                <td className="px-3 py-2 sm:px-4" style={{ color: ASPECT_COLOUR[a.type] }}><span aria-hidden>{ASPECT_INFO[a.type].symbol} </span>{a.type.charAt(0).toUpperCase() + a.type.slice(1)}</td>
                <td className="px-3 py-2 sm:px-4">{a.b}</td>
                <td className="px-3 py-2 tabular-nums sm:px-4">{formatDegree(a.orb)}{a.applying != null && <span className="ml-1 text-xs text-muted">{a.applying ? "a" : "s"}</span>}</td>
                <td className="px-3 py-2 sm:px-4"><span className="inline-block h-2 rounded-full bg-plum/70 align-middle" style={{ width: `${Math.max(4, a.strength * 0.6)}px` }} aria-hidden /> <span className="text-xs text-muted">{a.strength}%</span></td>
              </tr>
            ))}
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted">a = applying (getting closer to exact), s = separating.</p>
      </Section>

      {/* FORTUNE & NODES */}
      <Section id="points" eyebrow="Sensitive points" title="Part of Fortune & South Node" intro={<p>The Part of Fortune is calculated from your Ascendant, Sun and Moon (classic formula: Ascendant + Moon − Sun) and shows where joy and ease flow. The South Node sits exactly opposite the true North Node.</p>}>
        <Table caption="Part of Fortune and the Nodes" head={["Point", "Sign", "Degree", "House"]} minWidth={360}>
          {[...(fortune ? [fortune] : []), ...chart.placements.filter((p) => p.body === "North Node").map((p) => ({ name: "North Node (true)", sign: p.sign, degree: p.degree, house: p.house })), ...(south ? [{ ...south, name: "South Node (true)" }] : [])].map((p) => (
            <tr key={p.name}>
              <th scope="row" className="px-3 py-2.5 font-medium sm:px-4"><span aria-hidden className="mr-2 text-plum">{glyphOf(p.name.startsWith("North") ? "North Node" : p.name.startsWith("South") ? "South Node" : p.name)}</span>{p.name}</th>
              <td className="px-3 py-2.5 sm:px-4"><span aria-hidden>{SIGN_INFO[p.sign].glyph} </span>{p.sign}</td>
              <td className="px-3 py-2.5 tabular-nums sm:px-4">{formatDegree(p.degree)}</td>
              <td className="px-3 py-2.5 sm:px-4">{p.house ? ROMAN[p.house - 1] : "—"}</td>
            </tr>
          ))}
        </Table>
        {!fortune && <p className="mt-3 text-sm text-muted">The Part of Fortune needs your Ascendant, so it can&rsquo;t be calculated without a birth time.</p>}
        {report.fortune && (
          <div className="card mt-8 grid gap-8 p-6 sm:p-10">
            <ReadingBlock r={report.fortune.sign} />
            {report.fortune.house && <ReadingBlock r={report.fortune.house} />}
          </div>
        )}
      </Section>

      {/* MOON */}
      <Section id="moon-phase" eyebrow="Your Moon" title="Moon position & the phase you were born under">
        <div className="grid items-start gap-8 lg:grid-cols-[18rem_1fr]">
          <div className="grid justify-items-center gap-4 rounded-[2rem] bg-plum-deep p-8 text-center text-ivory">
            {chart.moonPhase ? <MoonGlyph angle={chart.moonPhase.elongation} size={120} /> : <span aria-hidden className="text-6xl">☽</span>}
            <div>
              <p className="font-display text-2xl">{chart.moonPhase?.name ?? "Phase uncertain"}</p>
              <dl className="mt-3 grid gap-1 text-sm text-ivory/85">
                <div><dt className="inline">Sign: </dt><dd className="inline">{moon.signUncertain && moon.possibleSigns ? moon.possibleSigns.join(" or ") : `${moon.sign} ${formatDegree(moon.degree)}`}</dd></div>
                {moon.house && <div><dt className="inline">House: </dt><dd className="inline">{ordinal(moon.house)}</dd></div>}
                {chart.moonPhase && <div><dt className="inline">Lit: </dt><dd className="inline">{Math.round(chart.moonPhase.illumination * 100)}%</dd></div>}
                {chart.moonPhase && <div><dt className="inline">Ahead of the Sun: </dt><dd className="inline">{Math.round(chart.moonPhase.elongation)}°</dd></div>}
              </dl>
            </div>
          </div>
          {report.moonPhase ? <div className="card p-6 sm:p-10"><ReadingBlock r={report.moonPhase} /></div> : <p className="text-muted">Without a birth time the Moon&rsquo;s exact position — and so its phase — can&rsquo;t be fixed for this day.</p>}
        </div>
      </Section>

      {/* PLANETS */}
      <Section id="planets" eyebrow="Your report" title="The planets in your chart" intro={<p>Each planet in its sign and house, and the aspects it makes. These are the parts that make up the whole of you — some will contradict each other, just as people do. Read them as a conversation, not a verdict.</p>}>
        <div className="grid gap-8">
          {[...report.planets, ...report.points].map((s) => <FactorBlock key={s.id} s={s} chart={chart} />)}
          {south && <p className="-mt-4 px-2 text-sm text-muted">Your South Node is in {south.sign}{south.house ? `, in the ${ordinal(south.house)} house` : ""} — the familiar pattern the North Node reading above describes moving beyond.</p>}
        </div>
      </Section>

      {/* HOUSES */}
      {chart.timeKnown && report.houses.length > 0 && (
        <Section id="houses" eyebrow="Where life happens" title="The houses" intro={<p>The houses divide your chart into twelve areas of life. The sign on each house&rsquo;s cusp (its starting edge) colours how you approach that area; planets inside a house bring it into focus.</p>}>
          <div className="grid gap-8">
            {report.ascendant && <div className="card p-6 sm:p-10"><ReadingBlock r={report.ascendant} /></div>}
            {report.midheaven && <div className="card p-6 sm:p-10"><ReadingBlock r={report.midheaven} /></div>}
            <div className="grid gap-3">
              {report.houses.map((h) => (
                <details key={h.house} className="card group p-5 sm:p-6" open={h.house === 1}>
                  <summary className="flex min-h-11 cursor-pointer list-none items-baseline gap-3 [&::-webkit-details-marker]:hidden">
                    <span className="eyebrow shrink-0">House {ROMAN[h.house - 1]}</span>
                    <span className="font-display text-xl text-plum">{h.cuspSign} {formatDegree(h.cuspDegree)}</span>
                    {h.planets.length > 0 && <span className="text-sm text-muted">· {h.planets.join(", ")}</span>}
                    <span aria-hidden className="ml-auto text-plum transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-4 grid gap-5">
                    <p className="text-[0.95rem] text-muted">{h.intro}</p>
                    {h.cusp ? <ReadingBlock r={h.cusp} level={4} /> : <p className="text-[0.95rem] text-ink/80">{h.house === 1 ? "The 1st house cusp is your Ascendant — see its reading above." : "The 10th house cusp is your Midheaven — see its reading above."}</p>}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* BALANCE */}
      <Section id="balance" eyebrow="The shape of your chart" title="Elements & modalities" intro={<p>How your ten planets are spread across the four elements and three modalities. A dominant or missing element says a lot about your natural temperament.</p>}>
        <div className="grid gap-6 md:grid-cols-2">
          {[...report.balance.elements, ...report.balance.modalities].filter((b) => b.text).map((b) => (
            <div key={b.name} className="card p-6">
              <h3 className="font-display text-2xl text-plum">{b.note === "strong" ? `Strong ${b.name}` : `Little or no ${b.name}`} <span className="text-base text-muted">({b.count} of 10)</span></h3>
              <p className="mt-3 leading-relaxed text-ink/85">{b.text}</p>
            </div>
          ))}
          {[...report.balance.elements, ...report.balance.modalities].every((b) => !b.text) && <p className="text-ink/80">Your chart is evenly balanced — no element or modality dominates or is missing.</p>}
        </div>
      </Section>

      {/* CTA */}
      <section id="reading" aria-labelledby="reading-h" className="scroll-mt-40 overflow-hidden rounded-[2rem] bg-plum-deep p-8 text-ivory sm:p-12 print:hidden">
        <p className="eyebrow text-blush">A full birth chart assessment</p>
        <h2 id="reading-h" className="display-md mt-3 text-ivory">Go deeper with Yulia</h2>
        <p className="mt-4 max-w-2xl text-lg text-ivory/85">This report reads each placement on its own. In a personal birth chart reading, Yulia brings it all together — the patterns, the blocks and the gifts — and gives you recommendations for your life right now.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {waLink && <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary bg-ivory text-plum hover:bg-blush">Message Yulia on WhatsApp</a>}
          {contact.email && <a href={`mailto:${contact.email}?subject=${encodeURIComponent("Full birth chart reading")}&body=${encodeURIComponent(enquiry)}`} className="btn-outline border-ivory/40 text-ivory hover:bg-ivory/10">Email Yulia</a>}
          <Link href="/services#astrology-reports" className="btn-outline border-ivory/40 text-ivory hover:bg-ivory/10">Astrology readings</Link>
        </div>
        <p className="mt-4 text-sm text-ivory/70">Your birth details aren&rsquo;t sent anywhere — include them in your message if you&rsquo;d like Yulia to use them.</p>
      </section>

      {/* TECHNICAL */}
      <details className="card p-6 text-sm">
        <summary className="cursor-pointer font-display text-xl text-plum">Full birth data &amp; how this chart is calculated</summary>
        <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {[
            ["Place", chart.input.placeLabel],
            ["Latitude, longitude", `${chart.input.latitude.toFixed(4)}°, ${chart.input.longitude.toFixed(4)}°`],
            ["Local date and time", `${chart.input.date}${chart.timeKnown ? ` ${chart.input.time}` : " (time unknown — noon used)"}`],
            ["Time zone", `${chart.input.timeZone}${chart.timeKnown ? `, ${offsetLabel(chart.utcOffsetMinutes)}` : ""}`],
            ["Universal Time", chart.utc.replace("T", " ").slice(0, 16)],
            ["Julian Day", chart.technical.julianDay.toFixed(4)],
            ...(chart.technical.localSiderealTime != null ? [["Local sidereal time", `${Math.floor(chart.technical.localSiderealTime)}h ${String(Math.floor((chart.technical.localSiderealTime % 1) * 60)).padStart(2, "0")}m`]] : []),
            ["Zodiac", "Tropical (Western)"],
            ["Houses", chart.houseSystem === "placidus" ? "Placidus" : chart.houseSystem === "whole-sign" ? "Whole Sign" : "Not calculated (birth time unknown)"],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2"><dt className="text-muted">{k}:</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <ul className="mt-5 list-disc space-y-1.5 pl-5 text-ink/80">
          <li>Planet positions from <strong>{chart.provider.name}</strong>, an open-source astronomy library (VSOP87 / NOVAS models): apparent geocentric positions on the true ecliptic of date, accurate to well under an arcminute.</li>
          <li>North Node: true (osculating) node. Lilith: mean Black Moon (mean lunar apogee). Part of Fortune: Ascendant + Moon − Sun.</li>
          <li>Aspect orbs: 10° for conjunctions and oppositions, 8° for squares and trines, 5° for sextiles (60% of that between two outer planets); 6°/4°/3° for the North Node and Lilith.</li>
          <li>Birth time converted to Universal Time with the IANA time-zone database, including historical daylight-saving and wartime rules. Your details are used once to calculate this page and are never stored.</li>
          <li>The written report is original Witchy Portal text, for reflection and entertainment.</li>
        </ul>
      </details>
    </div>
  );
}

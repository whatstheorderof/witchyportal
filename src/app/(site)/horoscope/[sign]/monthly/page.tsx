import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { monthlyHoroscope, signFromSlug, todayKey } from "@/lib/astro/horoscope";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ sign: string }>; searchParams: Promise<{ m?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sign = signFromSlug((await params).sign);
  if (!sign) return { title: "Not found" };
  return pageMeta({
    title: `${sign} Monthly Horoscope | Witchy Portal`,
    absoluteTitle: true,
    description: `Your ${sign} horoscope for the month from Yulia Moon: your month's theme, the New and Full Moon, love, work and drive, and the key dates to know.`,
    path: `/horoscope/${sign.toLowerCase()}/monthly`,
  });
}

export default async function MonthlyPage({ params, searchParams }: Props) {
  const sign = signFromSlug((await params).sign);
  if (!sign) notFound();
  await connection();
  const now = todayKey();
  const asked = (await searchParams).m;
  let [y, m] = [Number(now.slice(0, 4)), Number(now.slice(5, 7))];
  if (asked && /^\d{4}-\d{2}$/.test(asked)) {
    const [ay, am] = asked.split("-").map(Number);
    const diff = (ay - y) * 12 + (am - m);
    if (diff >= -1 && diff <= 2 && am >= 1 && am <= 12) [y, m] = [ay, am];
  }
  const h = monthlyHoroscope(sign, y, m);
  const shift = (n: number) => { const d = new Date(Date.UTC(y, m - 1 + n, 1)); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`; };
  const nowYm = now.slice(0, 7);
  const delta = (ym: string) => (Number(ym.slice(0, 4)) - Number(nowYm.slice(0, 4))) * 12 + Number(ym.slice(5)) - Number(nowYm.slice(5));

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: `${sign} horoscope for ${h.label}`, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl(`/horoscope/${sign.toLowerCase()}/monthly`), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([["Horoscopes", "/horoscope"], [`${sign} horoscope`, `/horoscope/${sign.toLowerCase()}`], ["Monthly", `/horoscope/${sign.toLowerCase()}/monthly`]]),
      ]} />
      <section className="bg-plum-deep pt-24 pb-14 text-ivory lg:pt-32">
        <div className="container-page max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-ivory/70"><Link href="/horoscope" className="hover:text-ivory">Horoscopes</Link> <span aria-hidden>/</span> <Link href={`/horoscope/${sign.toLowerCase()}`} className="hover:text-ivory">{sign}</Link> <span aria-hidden>/</span> Monthly</nav>
          <h1 className="display-lg mt-4 text-ivory"><span aria-hidden className="mr-3">{SIGN_INFO[sign].glyph}</span>{sign} · {h.label}</h1>
          <p className="mt-3 max-w-2xl text-ivory/80">{h.intro}</p>
          <nav aria-label="Choose a month" className="mt-6 flex flex-wrap gap-2">
            {delta(shift(-1)) >= -1 && <Link href={`?m=${shift(-1)}`} className="rounded-full border border-ivory/30 px-4 py-2 text-sm hover:bg-ivory/10">← Previous month</Link>}
            <Link href={`/horoscope/${sign.toLowerCase()}`} className="rounded-full border border-ivory/30 px-4 py-2 text-sm hover:bg-ivory/10">Today</Link>
            {delta(shift(1)) <= 2 && <Link href={`?m=${shift(1)}`} className="rounded-full border border-ivory/30 px-4 py-2 text-sm hover:bg-ivory/10">Next month →</Link>}
          </nav>
        </div>
      </section>
      <div className="container-page grid max-w-3xl gap-6 py-12">
        {h.sections.map((s) => (
          <section key={s.title} className="card p-6 sm:p-8">
            {s.when && <p className="eyebrow">{s.when}</p>}
            <h2 className="mt-1 font-display text-2xl text-plum sm:text-3xl">{s.title}</h2>
            <div className="mt-3 grid gap-3 leading-relaxed text-ink/85">{s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
          </section>
        ))}
        {h.keyDates.length > 0 && (
          <section className="card p-6 sm:p-8" aria-labelledby="dates-h">
            <h2 id="dates-h" className="font-display text-2xl text-plum">Key dates in {h.label.split(" ")[0]}</h2>
            <ul className="mt-4 divide-y divide-line">{h.keyDates.map((d, i) => <li key={i} className="grid grid-cols-[7rem_1fr] gap-3 py-2 text-[0.95rem]"><span className="text-muted">{d.when}</span><span>{d.text}</span></li>)}</ul>
          </section>
        )}
        <p className="text-sm text-muted">Read from your Sun sign with whole-sign houses, using the real positions of the planets (UK time). See the whole sky in <Link href="/this-week-in-astrology" className="link-underline">this week in astrology</Link>.</p>
      </div>
    </>
  );
}

import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import * as s from "@/db/schema";
import { AdminHeader, Notice, Panel } from "@/components/admin/ui";

export const metadata = { title: "Insights" };

const since = (days: number) => new Date(Date.now() - days * 86400000);

async function countEvents(name: string, from: Date) {
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(s.events).where(and(eq(s.events.name, name), gte(s.events.createdAt, from)));
  return n;
}
async function countSince(table: "checkout_clicks" | "waitlist" | "enquiries" | "subscribers", from: Date) {
  const rows = await db.execute<{ n: number }>(sql`select count(*)::int as n from ${sql.identifier(table)} where created_at >= ${from}`);
  return rows[0]?.n ?? 0;
}

export default async function Insights({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const days = [7, 30, 90].includes(Number((await searchParams).days)) ? Number((await searchParams).days) : 30;
  const from = since(days);
  const [views, selects, reviews, checkouts, waitlist, enquiries, subs] = await Promise.all([
    countEvents("retreat_view", from),
    countEvents("option_select", from),
    countEvents("review_view", from),
    countSince("checkout_clicks", from),
    countSince("waitlist", from),
    countSince("enquiries", from),
    countSince("subscribers", from),
  ]);
  const steps = [
    { label: "Retreat page views", n: views },
    { label: "Booking option chosen", n: selects },
    { label: "Booking summary viewed", n: reviews },
    { label: "Sent to payment page", n: checkouts },
  ];
  const max = Math.max(1, ...steps.map((x) => x.n));
  const byRetreat = await db.execute<{ retreat: string; n: number }>(
    sql`select props->>'retreat' as retreat, count(*)::int as n from events where name = 'retreat_view' and created_at >= ${from} group by 1 order by 2 desc limit 10`,
  );

  return (
    <>
      <AdminHeader title="Insights" intro="Where visitors are in the booking journey. Anonymous counts only — no personal details, IP addresses or birth details are recorded." />
      <nav className="mb-6 flex gap-2">
        {[7, 30, 90].map((d) => <a key={d} href={`/admin/insights?days=${d}`} className="chip min-h-9" aria-current={d === days ? "true" : undefined}>Last {d} days</a>)}
      </nav>
      <div className="grid gap-6">
        <Panel title="Booking journey">
          <ol className="grid gap-3">
            {steps.map((st, i) => (
              <li key={st.label}>
                <div className="flex justify-between text-sm"><span>{i + 1}. {st.label}</span><span className="font-medium tabular-nums">{st.n}</span></div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-sand/60"><div className="h-full rounded-full bg-plum" style={{ width: `${(st.n / max) * 100}%` }} /></div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">Sent-to-payment is not the same as paid — confirm payments in your payment provider.</p>
        </Panel>
        <div className="grid gap-6 sm:grid-cols-3">
          {[{ l: "Waitlist sign-ups", n: waitlist }, { l: "Enquiries", n: enquiries }, { l: "Newsletter sign-ups", n: subs }].map((c) => (
            <div key={c.l} className="card p-5"><p className="font-display text-4xl text-plum">{c.n}</p><p className="text-sm text-muted">{c.l}</p></div>
          ))}
        </div>
        <Panel title="Views by retreat">
          {byRetreat.length === 0 ? <p className="text-sm text-muted">No views recorded yet.</p> : (
            <ul className="grid gap-1 text-sm">{byRetreat.map((r) => <li key={r.retreat} className="flex justify-between"><span>/{r.retreat}</span><span className="tabular-nums">{r.n}</span></li>)}</ul>
          )}
        </Panel>
        <Notice>Counts exclude obvious bots. Visitors who block scripts aren&rsquo;t counted, so treat these as trends rather than exact numbers.</Notice>
      </div>
    </>
  );
}

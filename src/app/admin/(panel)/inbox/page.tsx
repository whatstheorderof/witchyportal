import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import * as s from "@/db/schema";
import { AdminHeader, Empty } from "@/components/admin/ui";
import { setInboxStatus, unsubscribe } from "../../actions";
import { formatDate } from "@/lib/dates";

export const metadata = { title: "Inbox" };

function StatusButtons({ table, id, status }: { table: string; id: string; status: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(["new", "handled", "archived"] as const).filter((x) => x !== status).map((st) => (
        <form key={st} action={setInboxStatus}>
          <input type="hidden" name="table" value={table} /><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={st} />
          <button className="btn-outline min-h-9 px-3 text-xs capitalize">Mark {st}</button>
        </form>
      ))}
    </div>
  );
}

async function Enquiries({ rt, departures }: { rt: (id: string | null) => string; departures: { id: string; startDate: string }[] }) {
        const rows = await db.select().from(s.enquiries).orderBy(desc(s.enquiries.createdAt)).limit(500);
        return rows.length === 0 ? <Empty>No enquiries yet.</Empty> : (
          <ul className="grid gap-3">{rows.map((e) => (
            <li key={e.id} className={`card p-5 ${e.status === "new" ? "ring-2 ring-lavender-deep/40" : ""}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><p className="font-medium">{e.name} · <a className="text-plum link-underline" href={`mailto:${e.email}`}>{e.email}</a></p><p className="text-xs text-muted">{formatDate(e.createdAt, { hour: "2-digit", minute: "2-digit" })} · {e.topic}{e.retreatId ? ` · ${rt(e.retreatId)}` : ""} · <span className="capitalize">{e.status}</span></p></div>
              <p className="mt-3 whitespace-pre-line text-[0.95rem]">{e.message}</p>
              <div className="mt-4"><StatusButtons table="enquiries" id={e.id} status={e.status} /></div>
            </li>))}</ul>
        );
      }

async function Waitlist({ rt, departures }: { rt: (id: string | null) => string; departures: { id: string; startDate: string }[] }) {
        const rows = await db.select().from(s.waitlist).orderBy(desc(s.waitlist.createdAt)).limit(500);
        return rows.length === 0 ? <Empty>No one on the waitlist yet.</Empty> : (
          <ul className="grid gap-3">{rows.map((w) => (
            <li key={w.id} className="card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2"><p className="font-medium">{w.name} · <a className="text-plum link-underline" href={`mailto:${w.email}`}>{w.email}</a></p><p className="text-xs text-muted">{formatDate(w.createdAt)} · <span className="capitalize">{w.status}</span></p></div>
              <p className="mt-2 text-sm">{rt(w.retreatId)}{w.departureId ? ` · ${departures.find((d) => d.id === w.departureId)?.startDate ?? ""}` : " · any dates"}</p>
              {w.note && <p className="mt-2 whitespace-pre-line text-sm text-muted">{w.note}</p>}
              <div className="mt-4"><StatusButtons table="waitlist" id={w.id} status={w.status} /></div>
            </li>))}</ul>
        );
      }

async function Subscribers({ rt, departures }: { rt: (id: string | null) => string; departures: { id: string; startDate: string }[] }) {
        const rows = await db.select().from(s.subscribers).orderBy(desc(s.subscribers.createdAt)).limit(2000);
        return rows.length === 0 ? <Empty>No subscribers yet.</Empty> : (
          <div className="overflow-x-auto rounded-2xl ring-1 ring-line">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-ivory-deep text-xs uppercase tracking-wider text-muted"><tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Consented</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y divide-line bg-white/70">{rows.map((r) => (
                <tr key={r.id}><td className="px-4 py-3">{r.email}</td><td className="px-4 py-3">{r.source}</td><td className="px-4 py-3">{formatDate(r.consentAt)}</td><td className="px-4 py-3">{r.unsubscribedAt ? "Unsubscribed" : "Active"}</td>
                  <td className="px-4 py-3">{!r.unsubscribedAt && <form action={unsubscribe}><input type="hidden" name="id" value={r.id} /><button className="text-xs text-danger underline">Unsubscribe</button></form>}</td></tr>))}</tbody>
            </table>
          </div>
        );
      }

export default async function Inbox({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = "enquiries" } = await searchParams;
  const retreats = await db.select({ id: s.retreats.id, title: s.retreats.title }).from(s.retreats);
  const departures = await db.select({ id: s.departures.id, startDate: s.departures.startDate }).from(s.departures);
  const rt = (id: string | null) => retreats.find((r) => r.id === id)?.title ?? "—";
  const tabs = [["enquiries", "Enquiries"], ["waitlist", "Waitlist"], ["subscribers", "Subscribers"]];
  return (
    <>
      <AdminHeader title="Inbox" intro="Reply from your own email. Personal data here is covered by your privacy policy — delete what you no longer need." actions={<a href={`/api/admin/export?type=${tab}`} className="btn-outline min-h-10 text-sm">Export CSV</a>} />
      <nav className="mb-6 flex flex-wrap gap-2">{tabs.map(([k, l]) => <Link key={k} href={`/admin/inbox?tab=${k}`} className="chip min-h-10" aria-current={tab === k ? "true" : undefined}>{l}</Link>)}</nav>

      {tab === "enquiries" && <Enquiries rt={rt} departures={departures} />}

      {tab === "waitlist" && <Waitlist rt={rt} departures={departures} />}

      {tab === "subscribers" && <Subscribers rt={rt} departures={departures} />}
    </>
  );
}

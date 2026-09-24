import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { departures, retreats } from "@/db/schema";
import { AdminHeader, Empty, Notice, StatusPill } from "@/components/admin/ui";
import { AdminForm, F } from "@/components/admin/AdminForm";
import { createRetreat } from "../../actions";
import { formatDateRange } from "@/lib/dates";
import { AvailabilityBadge } from "@/components/Availability";

export const metadata = { title: "Retreats" };

export default async function RetreatsAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const { deleted } = await searchParams;
  const [rows, deps] = await Promise.all([
    db.select().from(retreats).orderBy(asc(retreats.sortOrder), desc(retreats.createdAt)),
    db.select().from(departures).orderBy(asc(departures.startDate)),
  ]);
  return (
    <>
      <AdminHeader title="Retreats & dates" intro="Each retreat has one or more date ranges (departures), and each departure has booking options with their own price and payment link." />
      {deleted && <div className="mb-6"><Notice tone="ok">Retreat deleted.</Notice></div>}
      {rows.length === 0 ? <Empty>No retreats yet — create your first below.</Empty> : (
        <ul className="grid gap-3">
          {rows.map((r) => {
            const ds = deps.filter((d) => d.retreatId === r.id);
            return (
              <li key={r.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2"><Link href={`/admin/retreats/${r.id}`} className="font-display text-2xl text-plum link-underline">{r.title}</Link><StatusPill status={r.status} publishAt={r.publishAt} />{r.isPlaceholder && <span className="placeholder-flag">Placeholder</span>}</p>
                  <p className="mt-1 text-sm text-muted">/{r.slug} · {r.location || "No location"}</p>
                  <ul className="mt-2 flex flex-wrap gap-2 text-xs">
                    {ds.length === 0 ? <li className="text-muted">No dates yet</li> : ds.map((d) => <li key={d.id} className="flex items-center gap-1.5 rounded-full bg-white px-2 py-1 ring-1 ring-line">{formatDateRange(d.startDate, d.endDate)} <AvailabilityBadge value={d.availability} /></li>)}
                  </ul>
                </div>
                <Link href={`/admin/retreats/${r.id}`} className="btn-outline min-h-10 text-sm">Edit</Link>
              </li>
            );
          })}
        </ul>
      )}
      <section className="card mt-8 p-5 sm:p-7">
        <h2 className="font-display text-2xl text-plum">New retreat</h2>
        <p className="mt-1 text-sm text-muted">Starts as a draft — nothing appears on the site until you publish it.</p>
        <div className="mt-4"><AdminForm action={createRetreat} submitLabel="Create draft"><F label="Retreat title" name="title" required /></AdminForm></div>
      </section>
    </>
  );
}

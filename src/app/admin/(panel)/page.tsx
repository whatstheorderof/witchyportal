import Link from "next/link";
import { and, desc, eq, gt, sql, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "@/db";
import * as s from "@/db/schema";
import { AdminHeader, Notice, Panel } from "@/components/admin/ui";
import { paymentMode, deploymentEnv } from "@/lib/env";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

export const metadata = { title: "Dashboard" };

const count = async (t: PgTable, where?: SQL) =>
  (await db.select({ n: sql<number>`count(*)::int` }).from(t).where(where))[0].n;

export default async function Dashboard() {
  const [enq, wait, subs, clicks, scheduled, placeholders, missingAlt] = await Promise.all([
    count(s.enquiries, eq(s.enquiries.status, "new")),
    count(s.waitlist, eq(s.waitlist.status, "new")),
    count(s.subscribers, sql`${s.subscribers.unsubscribedAt} is null`),
    db.select().from(s.checkoutClicks).orderBy(desc(s.checkoutClicks.createdAt)).limit(5),
    db.select().from(s.posts).where(and(eq(s.posts.status, "scheduled"), gt(s.posts.publishAt, sql`now()`))).orderBy(s.posts.publishAt).limit(5),
    count(s.retreats, eq(s.retreats.isPlaceholder, true)),
    count(s.media, and(eq(s.media.kind, "image"), eq(s.media.alt, ""))),
  ]);
  const mode = paymentMode();

  return (
    <>
      <AdminHeader title="Welcome back" intro="Everything you publish here goes live without a code deployment." />
      <div className="grid gap-4">
        <Notice>
          <strong>Booking mode: manually managed payment links.</strong> Each booking option sends guests to the payment link you paste in. The site does
          not receive payment confirmations — check your payment provider, then email the guest and update availability here by hand.
          This environment ({deploymentEnv()}) uses <strong>{mode === "live" ? "LIVE" : "TEST"}</strong> payment links.
        </Notice>
        {placeholders > 0 && <Notice tone="warn">{placeholders} retreat{placeholders > 1 ? "s are" : " is"} marked as placeholder content. Replace the details before launch.</Notice>}
        {missingAlt > 0 && <Notice tone="warn">{missingAlt} image{missingAlt > 1 ? "s are" : " is"} missing alt text. <Link href="/admin/media" className="underline">Fix in Media</Link>.</Notice>}
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "New enquiries", n: enq, href: "/admin/inbox?tab=enquiries" },
          { label: "New waitlist entries", n: wait, href: "/admin/inbox?tab=waitlist" },
          { label: "Newsletter subscribers", n: subs, href: "/admin/inbox?tab=subscribers" },
        ].map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="card block p-5 hover:shadow-(--shadow-lift)">
              <p className="font-display text-5xl text-plum">{c.n}</p>
              <p className="mt-1 text-sm text-muted">{c.label}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Quick actions">
          <ul className="grid gap-2">
            <li><Link className="link-underline text-plum" href="/admin/content?type=tip">Add this week&rsquo;s tip</Link></li>
            <li><Link className="link-underline text-plum" href="/admin/content?type=astrology">Write an astrology post</Link></li>
            <li><Link className="link-underline text-plum" href="/admin/videos">Add an Ask a Witch video</Link></li>
            <li><Link className="link-underline text-plum" href="/admin/retreats">Update retreat availability</Link></li>
            <li><Link className="link-underline text-plum" href="/admin/settings">Edit homepage &amp; About page</Link></li>
          </ul>
        </Panel>
        <Panel title="Coming up" intro="Scheduled posts go live automatically.">
          {scheduled.length === 0 ? <p className="text-sm text-muted">Nothing scheduled.</p> : (
            <ul className="grid gap-2 text-sm">
              {scheduled.map((p) => <li key={p.id}><Link href={`/admin/content/${p.id}`} className="text-plum link-underline">{p.title}</Link> <span className="text-muted">· {p.type} · {formatDate(p.publishAt!, { hour: "2-digit", minute: "2-digit" })}</span></li>)}
            </ul>
          )}
        </Panel>
        <Panel title="Recent payment redirects" intro="Visitors sent to a payment page. Not confirmed bookings.">
          {clicks.length === 0 ? <p className="text-sm text-muted">None yet.</p> : (
            <ul className="grid gap-2 text-sm">
              {clicks.map((c) => <li key={c.id}>{c.retreatTitle} — {c.optionLabel} · {formatMoney(c.amount, c.currency)} <span className="text-muted">· {formatDate(c.createdAt, { hour: "2-digit", minute: "2-digit" })} · {c.environment}</span></li>)}
            </ul>
          )}
          <Link href="/admin/checkouts" className="mt-3 inline-block text-sm text-plum link-underline">View all</Link>
        </Panel>
      </div>
    </>
  );
}

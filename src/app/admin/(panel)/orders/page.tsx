import Link from "next/link";
import { desc, eq, max } from "drizzle-orm";
import { db } from "@/db";
import { orders, stripeEvents } from "@/db/schema";
import { AdminHeader, Empty, Notice } from "@/components/admin/ui";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { stripeMode, stripeProblem } from "@/lib/stripe";

export const metadata = { title: "Orders" };

const STATUS: Record<string, [string, string]> = {
  paid: ["Paid", "bg-success/15 text-success"],
  pending: ["Waiting for payment", "bg-ink/5 text-muted"],
  expired: ["Not paid (expired)", "bg-ink/5 text-muted"],
  cancelled: ["Cancelled / failed", "bg-ink/5 text-muted"],
  refunded: ["Refunded", "bg-lavender/60 text-plum"],
  needs_attention: ["Needs attention", "bg-warning/15 text-warning"],
};

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const { show } = await searchParams;
  const all = show === "all";
  const [rows, [last]] = await Promise.all([
    db.select().from(orders).where(all ? undefined : eq(orders.status, "paid")).orderBy(desc(orders.createdAt)).limit(500),
    db.select({ at: max(stripeEvents.createdAt) }).from(stripeEvents),
  ]);
  const attention = all ? [] : await db.select().from(orders).where(eq(orders.status, "needs_attention")).orderBy(desc(orders.createdAt));
  const problem = stripeProblem();
  const dash = (o: { stripePaymentIntent: string | null; mode: string }) => o.stripePaymentIntent ? `https://dashboard.stripe.com/${o.mode === "test" ? "test/" : ""}payments/${o.stripePaymentIntent}` : null;

  return (
    <>
      <AdminHeader title="Orders" intro="Payments taken on the site with Stripe: retreat places and compatibility reports. Only payments Stripe has confirmed are marked Paid." />
      {problem ? <Notice tone="warn">Stripe isn&rsquo;t connected yet ({problem}). See <Link href="/admin/settings#payments" className="underline">Settings → Payments</Link>.</Notice>
        : <Notice tone="ok">Stripe is connected in <strong>{stripeMode()}</strong> mode.{last?.at ? ` Last message from Stripe: ${formatDate(last.at, { hour: "2-digit", minute: "2-digit" })}.` : " No messages from Stripe yet."}</Notice>}
      {attention.length > 0 && <div className="mt-4"><Notice tone="warn"><strong>{attention.length} payment{attention.length === 1 ? "" : "s"} need attention</strong> — for example, paid after the last place was taken. Contact the guest and refund or move them in Stripe if needed.</Notice></div>}
      <nav className="mt-6 flex gap-2 text-sm">
        <Link href="/admin/orders" aria-current={!all ? "page" : undefined} className={`chip min-h-9 ${!all ? "bg-plum text-ivory" : ""}`}>Paid</Link>
        <Link href="/admin/orders?show=all" aria-current={all ? "page" : undefined} className={`chip min-h-9 ${all ? "bg-plum text-ivory" : ""}`}>Everything (incl. unfinished)</Link>
      </nav>
      <div className="mt-4">
        {[...attention, ...rows].length === 0 ? <Empty>No {all ? "" : "paid "}orders yet.</Empty> : (
          <div className="overflow-x-auto rounded-2xl ring-1 ring-line">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-ivory-deep text-xs uppercase tracking-wider text-muted"><tr><th className="px-4 py-3">When</th><th className="px-4 py-3">What</th><th className="px-4 py-3">Who</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th></tr></thead>
              <tbody className="divide-y divide-line bg-white/70">
                {[...attention, ...rows].map((o) => {
                  const [label, cls] = STATUS[o.status];
                  const href = dash(o);
                  return (
                    <tr key={o.id + o.status}>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(o.paidAt ?? o.createdAt, { hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="px-4 py-3">{o.description}{o.note && <span className="mt-1 block text-xs text-warning">{o.note}</span>}</td>
                      <td className="px-4 py-3">{o.name ?? "—"}{o.email && <a href={`mailto:${o.email}`} className="block text-xs underline">{o.email}</a>}{o.phone && <span className="block text-xs text-muted">{o.phone}</span>}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatMoney(o.amount, o.currency)}{o.mode === "test" && <span className="ml-1 rounded bg-warning/15 px-1 text-xs text-warning">test</span>}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${cls}`}>{label}</span>{href && <a href={href} target="_blank" rel="noreferrer" className="mt-1 block text-xs underline">Open in Stripe ↗</a>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-muted">Refunds are made in Stripe and show here automatically. After a refund, set the option&rsquo;s availability back by hand if you want to sell the place again.</p>
    </>
  );
}

import { desc } from "drizzle-orm";
import { db } from "@/db";
import { checkoutClicks } from "@/db/schema";
import { AdminHeader, Empty, Notice } from "@/components/admin/ui";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

export const metadata = { title: "Payment redirects" };

export default async function CheckoutsPage() {
  const rows = await db.select().from(checkoutClicks).orderBy(desc(checkoutClicks.createdAt)).limit(300);
  return (
    <>
      <AdminHeader title="Payment redirects" intro="Each row is a visitor who pressed “Continue to secure payment”." />
      <Notice tone="warn">These are <strong>not</strong> confirmed bookings — the visitor may not have finished paying. Always confirm payment in your payment provider&rsquo;s dashboard before emailing a guest or reducing availability.</Notice>
      <div className="mt-6">
        {rows.length === 0 ? <Empty>No redirects yet.</Empty> : (
          <div className="overflow-x-auto rounded-2xl ring-1 ring-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-ivory-deep text-xs uppercase tracking-wider text-muted"><tr><th className="px-4 py-3">When</th><th className="px-4 py-3">Retreat</th><th className="px-4 py-3">Option</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Env / mode</th></tr></thead>
              <tbody className="divide-y divide-line bg-white/70">
                {rows.map((r) => (
                  <tr key={r.id}><td className="px-4 py-3 whitespace-nowrap">{formatDate(r.createdAt, { hour: "2-digit", minute: "2-digit" })}</td><td className="px-4 py-3">{r.retreatTitle}</td><td className="px-4 py-3">{r.optionLabel}</td><td className="px-4 py-3">{formatMoney(r.amount, r.currency)}</td><td className="px-4 py-3 text-muted">{r.environment}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

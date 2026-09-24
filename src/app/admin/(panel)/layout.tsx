import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { paymentMode } from "@/lib/env";
import { AdminNav } from "@/components/admin/AdminNav";
import { MoonMark } from "@/components/Logo";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const mode = paymentMode();
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-line bg-plum-deep text-ivory lg:border-b-0 lg:border-r">
        <div className="sticky top-0 flex flex-col lg:h-dvh">
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <Link href="/admin" className="flex items-center gap-2 font-display text-xl"><MoonMark className="h-6 w-6 text-blush" />Portal admin</Link>
            <Link href="/" target="_blank" className="text-xs text-ivory/70 underline underline-offset-2">View site ↗</Link>
          </div>
          <AdminNav />
          <div className="mt-auto hidden border-t border-ivory/10 px-5 py-4 text-xs text-ivory/70 lg:block">
            <p className="truncate">{admin.email}</p>
            <p className="mt-1">Payments: <strong className={mode === "live" ? "text-blush" : "text-lavender"}>{mode === "live" ? "LIVE links" : "TEST links"}</strong></p>
            <form action={logout} className="mt-3"><button className="underline underline-offset-2">Sign out</button></form>
          </div>
        </div>
      </aside>
      <main id="main" className="min-w-0 px-4 pb-24 pt-6 sm:px-8 lg:pt-10">
        <div className="mx-auto max-w-5xl">{children}</div>
        <form action={logout} className="mt-12 lg:hidden"><button className="text-sm text-muted underline">Sign out ({admin.email})</button></form>
      </main>
    </div>
  );
}

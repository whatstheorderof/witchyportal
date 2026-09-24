import Link from "next/link";

export function AdminHeader({ title, intro, actions, back }: { title: string; intro?: React.ReactNode; actions?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <header className="mb-8">
      {back && <Link href={back.href} className="text-sm text-plum link-underline">← {back.label}</Link>}
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-plum">{title}</h1>
          {intro && <div className="mt-2 max-w-2xl text-muted">{intro}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-sand text-ink",
  scheduled: "bg-lavender text-plum",
  published: "bg-success/15 text-success",
  archived: "bg-ink/10 text-muted",
};

export function StatusPill({ status, publishAt }: { status: string; publishAt?: Date | null }) {
  const live = status === "published" || (status === "scheduled" && publishAt && publishAt <= new Date());
  const label = status === "scheduled" && live ? "live (scheduled)" : status;
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${live && status === "scheduled" ? STATUS_STYLE.published : STATUS_STYLE[status]}`}>{label}</span>;
}

export function Panel({ title, children, intro, id }: { title: string; children: React.ReactNode; intro?: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="card scroll-mt-6 p-5 sm:p-7">
      <h2 className="font-display text-2xl text-plum">{title}</h2>
      {intro && <div className="mt-1 text-sm text-muted">{intro}</div>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "ok"; children: React.ReactNode }) {
  const cls = tone === "warn" ? "bg-warning/10 text-warning ring-warning/20" : tone === "ok" ? "bg-success/10 text-success ring-success/20" : "bg-lavender/40 text-plum ring-lavender";
  return <div className={`rounded-2xl px-4 py-3 text-sm ring-1 ${cls}`}>{children}</div>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-muted">{children}</p>;
}

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const groups = [
  { title: "", items: [{ href: "/admin", label: "Dashboard" }] },
  { title: "Bookings", items: [{ href: "/admin/retreats", label: "Retreats & dates" }, { href: "/admin/checkouts", label: "Payment redirects" }, { href: "/admin/inbox", label: "Inbox" }] },
  {
    title: "Content",
    items: [
      { href: "/admin/content?type=article", label: "Articles" },
      { href: "/admin/content?type=tip", label: "Tips" },
      { href: "/admin/content?type=affirmation", label: "Affirmations" },
      { href: "/admin/content?type=astrology", label: "Astrology" },
      { href: "/admin/videos", label: "Ask a Witch videos" },
      { href: "/admin/faqs", label: "FAQs" },
    ],
  },
  { title: "Site", items: [{ href: "/admin/highlights", label: "Homepage features" }, { href: "/admin/media", label: "Media library" }, { href: "/admin/pages", label: "Policy pages" }, { href: "/admin/settings", label: "Settings" }] },
];

function Nav() {
  const pathname = usePathname();
  const params = useSearchParams();
  const isActive = (href: string) => {
    const [p, q] = href.split("?");
    if (q) return pathname.startsWith(p) && params.get("type") === new URLSearchParams(q).get("type");
    return p === "/admin" ? pathname === p : pathname.startsWith(p);
  };
  return (
    <nav aria-label="Admin" className="no-scrollbar overflow-x-auto px-3 pb-3 lg:overflow-y-auto lg:pb-6">
      <ul className="flex gap-1 lg:flex-col lg:gap-5">
        {groups.map((g) => (
          <li key={g.title || "top"} className="flex gap-1 lg:block">
            {g.title && <p className="hidden px-3 pb-1 text-[0.65rem] uppercase tracking-[0.2em] text-ivory/50 lg:block">{g.title}</p>}
            <ul className="flex gap-1 lg:flex-col lg:gap-0.5">
              {g.items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} aria-current={isActive(i.href) ? "page" : undefined} className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm text-ivory/80 hover:bg-ivory/10 hover:text-ivory aria-[current=page]:bg-ivory aria-[current=page]:text-plum">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AdminNav() {
  return <Suspense fallback={<div className="h-10" />}><Nav /></Suspense>;
}

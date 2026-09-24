import Link from "next/link";

export function TopicFilter({ base, topics, active, extra }: { base: string; topics: string[]; active?: string; extra?: { label: string; value: string; param: string; active: boolean }[] }) {
  if (topics.length === 0 && !extra?.length) return null;
  return (
    <nav aria-label="Filter by topic" className="no-scrollbar -mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 sm:flex-wrap">
        <li><Link href={base} className="chip whitespace-nowrap" aria-current={!active && !extra?.some((e) => e.active) ? "true" : undefined}>All</Link></li>
        {extra?.map((e) => (
          <li key={e.value}><Link href={`${base}?${e.param}=${encodeURIComponent(e.value)}`} className="chip whitespace-nowrap" aria-current={e.active ? "true" : undefined}>{e.label}</Link></li>
        ))}
        {topics.map((t) => (
          <li key={t}><Link href={`${base}?topic=${encodeURIComponent(t)}`} className="chip whitespace-nowrap" aria-current={active === t ? "true" : undefined}>{t}</Link></li>
        ))}
      </ul>
    </nav>
  );
}

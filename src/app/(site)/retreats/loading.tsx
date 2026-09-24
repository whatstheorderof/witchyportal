export default function Loading() {
  return (
    <div className="container-page pt-32 pb-20" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading retreats…</span>
      <div className="h-10 w-2/3 max-w-lg animate-pulse rounded-full bg-sand" />
      <div className="mt-12 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="aspect-[4/5] animate-pulse rounded-(--radius-card) bg-sand/70" />
            <div className="mt-5 h-6 w-3/4 animate-pulse rounded-full bg-sand/70" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-sand/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

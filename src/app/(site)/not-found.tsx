import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-prose flex min-h-[70vh] flex-col items-center justify-center pt-24 pb-16 text-center">
      <span aria-hidden className="font-display text-6xl text-lavender-deep">✦</span>
      <h1 className="display-md mt-4">This path has washed away</h1>
      <p className="mt-4 text-muted">We couldn&rsquo;t find that page. It may have moved, or the tide took it.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/retreats" className="btn-primary">See retreats</Link>
        <Link href="/" className="btn-outline">Go home</Link>
      </div>
    </div>
  );
}

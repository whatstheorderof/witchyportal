import Link from "next/link";

export function PreviewBanner({ status, editHref }: { status: string; editHref: string }) {
  return (
    <div className="fixed inset-x-0 top-16 z-50 flex justify-center px-4 lg:top-20" role="status">
      <div className="mt-2 flex items-center gap-3 rounded-full bg-lavender-deep px-5 py-2 text-sm text-white shadow-(--shadow-lift)">
        <span>Preview · status: <strong className="uppercase tracking-wide">{status}</strong></span>
        <Link href={editHref} className="underline underline-offset-2">Back to editor</Link>
      </div>
    </div>
  );
}

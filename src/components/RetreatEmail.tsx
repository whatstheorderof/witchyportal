import { mailto } from "@/lib/contact-links";

/** "Questions about the retreat? Email …" — used on retreat, booking and listing pages. */
export function RetreatEmailNote({ email, subject, className = "", lead = "Questions about the retreat?" }: { email: string; subject?: string; className?: string; lead?: string }) {
  if (!email) return null;
  return (
    <p className={`text-ink/80 ${className}`}>
      {lead} Email Yulia at{" "}
      <a href={mailto(email, subject)} className="break-all font-medium text-plum link-underline">{email}</a>
    </p>
  );
}

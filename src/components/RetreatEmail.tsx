import { mailto } from "@/lib/contact-links";
import { getI18n } from "@/i18n/server";

/** "Questions about the retreat? Email …" — used on retreat, booking and listing pages. */
export async function RetreatEmailNote({ email, subject, className = "", lead }: { email: string; subject?: string; className?: string; lead?: string }) {
  if (!email) return null;
  const { t } = await getI18n();
  return (
    <p className={`text-ink/80 ${className}`}>
      {lead ?? t("Questions about the retreat?")} {t("Email Yulia at")}{" "}
      <a href={mailto(email, subject)} className="break-all font-medium text-plum link-underline">{email}</a>
    </p>
  );
}

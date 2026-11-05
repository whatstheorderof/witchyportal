"use client";

import Link, { useI18n } from "@/i18n/client";
import { useState } from "react";
import { ExternalIcon } from "./Icons";

export function ConfirmAndPay({ optionId, testMode }: { optionId: string; testMode: boolean }) {
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { t, locale } = useI18n();
  return (
    <form method="post" action="/api/checkout" className="mt-8 grid gap-5" onSubmit={() => setSubmitting(true)}>
      <input type="hidden" name="optionId" value={optionId} />
      <input type="hidden" name="lang" value={locale} />
      {testMode && (
        <p className="rounded-xl bg-lavender/50 px-4 py-3 text-sm text-plum">
          <strong>{t("Test mode:")}</strong> {t("you’ll be sent to a test payment page. No real money will be taken.")}
        </p>
      )}
      <label className="flex items-start gap-3 rounded-2xl border border-line bg-white/70 p-4">
        <input type="checkbox" name="accept" required checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-plum" />
        <span className="text-[0.95rem]">
          {t("I’ve read the retreat details and the booking terms, and I understand what I’m paying for.")} <Link href="/policies/booking-terms" target="_blank" className="link-underline text-plum">{t("Read the booking terms")}</Link>
        </span>
      </label>
      <button className="btn-primary w-full sm:w-auto" disabled={!accepted || submitting}>
        {submitting ? t("Opening secure payment…") : <>{t("Continue to secure payment")} <ExternalIcon /></>}
      </button>
    </form>
  );
}

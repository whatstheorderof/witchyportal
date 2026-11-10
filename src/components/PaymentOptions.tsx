import QRCode from "qrcode";
import Link from "@/i18n/client";
import type { ContactSettings } from "@/lib/settings";
import { revolutLink } from "@/lib/contact-links";
import { ExternalIcon } from "@/components/Icons";
import { CopyText } from "@/components/CopyText";

type T = (s: string, vars?: Record<string, string | number>) => string;

/** Revolut QR code as inline SVG (dark modules on a light tile). */
async function qrSvg(url: string) {
  return QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 1, color: { dark: "#2b1328", light: "#fdf8f3" } });
}

export function hasPayment(contact: ContactSettings) {
  return Boolean(contact.paypalEmail || contact.revolut);
}

/** "How to pay" for services: PayPal and Revolut, as set in Admin → Settings → Contact. */
export async function PaymentOptions({ contact, t, compact = false }: { contact: ContactSettings; t: T; compact?: boolean }) {
  if (!hasPayment(contact)) return null;
  const revolut = contact.revolut ? revolutLink(contact.revolut) : null;
  const handle = contact.revolut ? `@${contact.revolut.replace(/^@/, "")}` : "";
  const svg = revolut && !compact ? await qrSvg(revolut) : null;

  if (compact) {
    return (
      <div>
        <p className="eyebrow">{t("How to pay")}</p>
        <p className="mt-2 text-sm text-muted">{t("For readings, spells and consultations, once you and Yulia have agreed the work and the price.")}</p>
        <ul className="mt-4 grid gap-4">
          {contact.paypalEmail && (
            <li>
              <p className="text-sm font-semibold text-ink">PayPal</p>
              <p className="mt-1 break-all font-display text-2xl text-plum">{contact.paypalEmail}</p>
            </li>
          )}
          {revolut && (
            <li>
              <p className="text-sm font-semibold text-ink">Revolut</p>
              <a href={revolut} target="_blank" rel="noopener noreferrer" className="mt-1 block font-display text-2xl text-plum link-underline">{handle}</a>
            </li>
          )}
        </ul>
        <Link href="/services#pay" className="mt-3 inline-block text-sm text-plum link-underline">{t("Payment details and QR code")}</Link>
      </div>
    );
  }

  return (
    <section id="pay" className="container-page scroll-mt-24 py-14 lg:py-20" aria-labelledby="pay-title">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <p className="eyebrow">{t("How to pay")}</p>
          <h2 id="pay-title" className="display-md mt-2">{t("Pay Yulia directly")}</h2>
          <p className="mt-4 text-ink/80">{t("Once you and Yulia have agreed the work and the price, you can pay by PayPal or Revolut.")}</p>
          <p className="mt-3 text-ink/80">{t("Add your name and what the payment is for, then send Yulia a quick message so she can match it to your booking.")}</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {contact.paypalEmail && (
            <li className="card flex flex-col gap-4 p-6">
              <p className="font-display text-2xl text-plum">PayPal</p>
              <div>
                <p className="text-sm text-muted">{t("Send to")}</p>
                <p className="break-all font-display text-xl text-plum">{contact.paypalEmail}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {contact.paypalMe && <a href={contact.paypalMe} target="_blank" rel="noopener noreferrer" className="btn-primary">{t("Pay with PayPal")} <ExternalIcon /></a>}
                <CopyText text={contact.paypalEmail} label={t("Copy email")} copiedLabel={t("Copied")} />
              </div>
              <p className="text-sm text-muted">{t("In PayPal, choose Send and paste this email.")}</p>
            </li>
          )}
          {revolut && (
            <li className="card flex flex-col gap-4 p-6">
              <p className="font-display text-2xl text-plum">Revolut</p>
              <p className="font-display text-xl text-plum">{handle}</p>
              {svg && (
                <div
                  role="img"
                  aria-label={t("QR code to pay {handle} on Revolut", { handle })}
                  className="mx-auto w-40 overflow-hidden rounded-xl ring-1 ring-line [&_svg]:h-auto [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              )}
              <p className="text-center text-sm text-muted">{t("Scan to pay, even if you're not on Revolut.")}</p>
              <a href={revolut} target="_blank" rel="noopener noreferrer" className="btn-primary mt-auto self-start">{t("Pay with Revolut")} <ExternalIcon /></a>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

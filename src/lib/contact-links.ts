/** wa.me link for a number like +447899034140, with an optional prefilled message. */
export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** +447899034140 → +44 7899 034140 (UK numbers), otherwise unchanged */
export function prettyPhone(number: string) {
  const m = number.replace(/\s/g, "").match(/^\+44(\d{4})(\d{6})$/);
  return m ? `+44 ${m[1]} ${m[2]}` : number;
}

/** The address for retreat questions and bookings — the retreat email if set, otherwise the public email. */
export function retreatEmailOf(contact: { email: string; retreatEmail?: string }) {
  return (contact.retreatEmail || contact.email || "").trim();
}

/** mailto: link with an optional subject line. */
export function mailto(email: string, subject?: string) {
  return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}

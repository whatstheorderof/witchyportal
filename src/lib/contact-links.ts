/** wa.me link for a number like +447830960050, with an optional prefilled message. */
export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** +447830960050 → +44 7830 960050 (UK numbers), otherwise unchanged */
export function prettyPhone(number: string) {
  const m = number.replace(/\s/g, "").match(/^\+44(\d{4})(\d{6})$/);
  return m ? `+44 ${m[1]} ${m[2]}` : number;
}

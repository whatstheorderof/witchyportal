export const CURRENCIES = ["GBP", "EUR", "USD", "AUD", "CAD", "CHF", "SEK", "NOK", "DKK"] as const;

export function formatMoney(minor: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      minimumFractionDigits: minor % 100 === 0 ? 0 : 2,
    }).format(minor / 100);
  } catch {
    return `${(minor / 100).toFixed(2)} ${currency}`;
  }
}

/** Parse "1,250.50" → 125050 minor units. Returns null when invalid. */
export function parseMoney(input: string): number | null {
  const cleaned = input.replace(/[,\s£€$]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(parseFloat(cleaned) * 100);
}

export function minorToInput(minor: number | null | undefined): string {
  if (minor == null) return "";
  return (minor / 100).toFixed(minor % 100 === 0 ? 0 : 2);
}

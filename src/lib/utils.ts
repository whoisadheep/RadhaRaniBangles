export function formatPrice(price: number): string {
  return "₹" + price.toLocaleString("en-IN");
}

export function cn(
  ...classes: (string | undefined | false | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function getDiscountPercentage(
  original: number,
  current: number
): number {
  return Math.round(((original - current) / original) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

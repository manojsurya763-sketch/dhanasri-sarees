export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPct(mrp: number, price: number) {
  if (mrp <= 0) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

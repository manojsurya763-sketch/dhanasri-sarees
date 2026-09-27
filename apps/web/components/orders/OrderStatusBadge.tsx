const STYLES: Record<string, string> = {
  created: "bg-cream-100 text-maroon-900/60",
  paid: "bg-cream-200 text-gold-600",
  failed: "bg-red-100 text-red-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-slate-100 text-slate-600",
  refunded: "bg-slate-100 text-slate-600",
};

const LABELS: Record<string, string> = {
  created: "Awaiting payment",
  paid: "Confirmed",
  failed: "Payment failed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${STYLES[status] ?? "bg-cream-100 text-maroon-900/60"}`}>
      {LABELS[status] ?? status}
    </span>
  );
}

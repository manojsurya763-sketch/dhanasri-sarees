import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  created: "bg-slate-100 text-slate-600",
  paid: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
  shipped: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-slate-200 text-slate-500 line-through",
  refunded: "bg-purple-100 text-purple-700",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STYLES[status]}`}>{status}</span>
  );
}

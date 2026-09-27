import clsx from "clsx";
import type { OrderStats, OrderStatus } from "@/lib/types";

const TABS: { label: string; value: OrderStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Created", value: "created" },
  { label: "Paid", value: "paid" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
  { label: "Failed", value: "failed" },
];

export function OrderStatusTabs({
  stats,
  active,
  onChange,
}: {
  stats: OrderStats;
  active: OrderStatus | "";
  onChange: (status: OrderStatus | "") => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200">
      {TABS.map((tab) => {
        const count = tab.value === "" ? stats.totalOrders : stats.statusCounts[tab.value];
        return (
          <button
            key={tab.label}
            onClick={() => onChange(tab.value)}
            className={clsx(
              "border-b-2 px-3 py-2 text-sm font-medium",
              active === tab.value
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            {tab.label} <span className="text-slate-400">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

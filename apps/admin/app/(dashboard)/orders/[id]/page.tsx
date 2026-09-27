"use client";

import { use, useEffect, useState } from "react";
import { getOrder, updateOrderStatus } from "@/lib/api";
import type { OrderDetail, OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

// Mirrors orders.admin.controller.ts's STAFF_ALLOWED/SUPER_ADMIN_ALLOWED —
// cancel/refund move money, so they're Super-Admin-only.
const STAFF_ALLOWED: Record<OrderStatus, OrderStatus[]> = {
  created: [],
  paid: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  failed: [],
  cancelled: [],
  refunded: [],
};
const SUPER_ADMIN_ALLOWED: Record<OrderStatus, OrderStatus[]> = {
  created: ["cancelled"],
  paid: ["shipped", "cancelled", "refunded"],
  shipped: ["delivered"],
  delivered: [],
  failed: [],
  cancelled: [],
  refunded: [],
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const role = useAdminAuthStore((s) => s.role);
  const isSuperAdmin = role === "super_admin";
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");

  function load() {
    getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load order"));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(next: OrderStatus) {
    setUpdating(true);
    setError(null);
    try {
      const updated = await updateOrderStatus(
        id,
        next,
        next === "shipped" ? { trackingNumber: trackingNumber || undefined, carrier: carrier || undefined } : undefined
      );
      setOrder(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    } finally {
      setUpdating(false);
    }
  }

  if (error && !order) return <ErrorState message={error} />;
  if (!order) return <LoadingState />;

  const nextOptions = (isSuperAdmin ? SUPER_ADMIN_ALLOWED : STAFF_ALLOWED)[order.status];

  return (
    <div className="max-w-3xl">
      <PageHeader title={`Order ${order.id}`} backHref="/orders" action={<StatusBadge status={order.status} />} />

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mb-6 grid grid-cols-2 gap-6 rounded-md border border-slate-200 bg-white p-4 text-sm">
        <div>
          <p className="font-medium text-slate-900">Customer</p>
          <p className="text-slate-600">{order.user.name ?? "—"}</p>
          <p className="text-slate-600">{order.user.phone}</p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Payment</p>
          <p className="text-slate-600">Total: ₹{order.totalAmount}</p>
          <p className="truncate text-slate-500">Razorpay order: {order.razorpayOrderId ?? "—"}</p>
          <p className="truncate text-slate-500">Razorpay payment: {order.razorpayPaymentId ?? "—"}</p>
          {(order.trackingNumber || order.carrier) && (
            <p className="text-slate-500">
              Tracking: {order.trackingNumber ?? "—"} {order.carrier && `(${order.carrier})`}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6 rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Item</th>
              <th className="px-4 py-2 font-medium">Qty</th>
              <th className="px-4 py-2 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2 text-slate-900">{item.product.title}</td>
                <td className="px-4 py-2 text-slate-600">{item.qty}</td>
                <td className="px-4 py-2 text-slate-600">₹{item.priceAtPurchase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {nextOptions.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Update status:</span>
            {nextOptions.map((option) => (
              <button
                key={option}
                disabled={updating}
                onClick={() => handleStatusChange(option)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm capitalize hover:bg-slate-100 disabled:opacity-50"
              >
                Mark {option}
              </button>
            ))}
          </div>
          {nextOptions.includes("shipped") && (
            <div className="flex items-center gap-2">
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking number (optional)"
                className="rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
              <input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Carrier (optional)"
                className="rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>
      )}

      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-slate-700">Returns</p>
        {order.returns.length === 0 ? (
          <p className="text-sm text-slate-400">No returns logged against this order.</p>
        ) : (
          <ul className="space-y-2">
            {order.returns.map((ret) => (
              <li key={ret.id} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm">
                <span className="text-slate-900">
                  {ret.orderItem ? ret.orderItem.product.title : "Whole order"} · qty {ret.qty}
                </span>
                <span className="ml-2 capitalize text-slate-500">{ret.status}</span>
                {ret.refundAmount && <span className="ml-2 text-slate-500">₹{ret.refundAmount}</span>}
                <p className="text-slate-500">{ret.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">History</p>
        {order.history.length === 0 ? (
          <p className="text-sm text-slate-400">No status changes recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {order.history.map((entry) => (
              <li key={entry.id} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm">
                <span className="capitalize text-slate-900">
                  {entry.fromStatus} → {entry.toStatus}
                </span>
                <span className="text-slate-500">
                  {" "}
                  by {entry.changedByStaff ? (entry.changedByStaff.name ?? entry.changedByStaff.email) : "system"} ·{" "}
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReturn, getOrder } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import type { OrderDetail } from "@/lib/types";

export default function NewReturnPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [orderItemId, setOrderItemId] = useState<string>("whole");
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLoadOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setLoadingOrder(true);
    try {
      const data = await getOrder(orderId.trim());
      setOrder(data);
      setOrderItemId("whole");
      setQty("1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order not found");
    } finally {
      setLoadingOrder(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!order) return;
    setError(null);
    setSubmitting(true);
    try {
      const ret = await createReturn({
        orderId: order.id,
        orderItemId: orderItemId === "whole" ? null : orderItemId,
        qty: Number(qty),
        reason,
      });
      router.push(`/returns/${ret.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log return");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Log a return" backHref="/returns" />

      <form onSubmit={handleLoadOrder} className="mb-6 flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-700">Order ID</label>
          <input
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Paste the order ID from the Orders page"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loadingOrder}
          className="rounded-md border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {loadingOrder ? "Loading…" : "Load order"}
        </button>
      </form>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {order && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">
            Order for {order.user.name ?? order.user.phone} — {order.status}, ₹{order.totalAmount}
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-700">What's being returned</label>
            <select
              value={orderItemId}
              onChange={(e) => setOrderItemId(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            >
              <option value="whole">Whole order</option>
              {order.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.product.title} (qty {item.qty})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Quantity</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="mt-1 w-32 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Reason</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? "Logging…" : "Log return"}
          </button>
        </form>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listOrders } from "@/lib/api";
import type { OrderListItem, OrderStats, OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { OrderStatCards } from "@/components/orders/OrderStatCards";
import { OrderStatusTabs } from "@/components/orders/OrderStatusTabs";

function isOrderStatus(value: string | null): value is OrderStatus {
  return !!value && ["created", "paid", "failed", "shipped", "delivered", "cancelled", "refunded"].includes(value);
}

export function OrderTable() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status");

  const [items, setItems] = useState<OrderListItem[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "">(isOrderStatus(initialStatus) ? initialStatus : "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
    if (status) params.set("status", status);
    if (phone) params.set("phone", phone);
    try {
      const data = await listOrders(params.toString());
      setItems(data.items);
      setTotal(data.pagination.total);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, status, phone]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div>
      {stats && <OrderStatCards stats={stats} />}
      {stats && (
        <OrderStatusTabs
          stats={stats}
          active={status}
          onChange={(next) => {
            setPage(1);
            setStatus(next);
          }}
        />
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Search by phone"
          value={phone}
          onChange={(e) => {
            setPage(1);
            setPhone(e.target.value);
          }}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Order</th>
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Total</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              items.map((order) => {
                const thumbnail = order.items[0]?.product.images[0];
                return (
                  <tr key={order.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2">
                      <Link href={`/orders/${order.id}`} className="flex items-center gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-slate-100">
                          {thumbnail && <Image src={thumbnail} alt="" fill sizes="36px" className="object-cover" />}
                        </div>
                        <span>
                          <span className="block font-medium text-slate-900 hover:underline">
                            {order.id.slice(0, 8)}…
                          </span>
                          <span className="block text-xs text-slate-400">
                            {order._count.items} item{order._count.items !== 1 ? "s" : ""}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-slate-600">{order.user.name ?? order.user.phone}</td>
                    <td className="px-4 py-2 text-slate-700">₹{order.totalAmount}</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-2 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {total > pageSize && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {page} of {Math.ceil(total / pageSize)}
          </span>
          <div className="space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

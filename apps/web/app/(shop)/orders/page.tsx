"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { getIdToken } from "@/lib/firebase";
import { listMyOrders, type OrderDetail } from "@/lib/orders";
import { formatCurrency } from "@/lib/formatCurrency";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default function MyOrdersPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);

  const [orders, setOrders] = useState<OrderDetail[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    async function load() {
      try {
        const token = await getIdToken();
        if (!token) return;
        const data = await listMyOrders(token);
        if (!cancelled) setOrders(data.items);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load your orders");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500">My Orders</h1>
        <p className="mt-3 text-sm text-maroon-900/60">Log in to see your order history and track deliveries.</p>
        <Button className="mt-6" onClick={openAuthModal}>
          Log in
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500">My Orders</h1>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!orders && !error ? (
        <p className="mt-8 text-sm text-maroon-900/60">Loading…</p>
      ) : orders && orders.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-sm text-maroon-900/60">You haven&apos;t placed any orders yet.</p>
          <Link href="/">
            <Button className="mt-6">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders?.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-2xl border border-maroon-500/10 bg-cream-50 p-5 transition hover:border-maroon-500/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-maroon-900">Order #{order.id.slice(0, 8)}</p>
                  <p className="mt-0.5 text-xs text-maroon-900/50">
                    Placed {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-cream-50 bg-cream-100"
                    >
                      <Image src={item.product.images[0]} alt={item.product.title} fill sizes="48px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-maroon-900/60">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
                <p className="ml-auto text-sm font-semibold text-maroon-900">{formatCurrency(Number(order.totalAmount))}</p>
              </div>

              {(order.trackingNumber || order.returns.length > 0) && (
                <div className="mt-3 border-t border-maroon-500/10 pt-3 text-xs text-maroon-900/60">
                  {order.trackingNumber && (
                    <p>
                      Tracking: {order.trackingNumber} {order.carrier && `(${order.carrier})`}
                    </p>
                  )}
                  {order.returns.length > 0 && <p>Return {order.returns[0].status}</p>}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

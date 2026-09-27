"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getOrder, type OrderDetail } from "@/lib/orders";
import { formatCurrency } from "@/lib/formatCurrency";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Order not found"));
  }, [id]);

  if (error) {
    return <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-maroon-900/60">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href="/orders" className="text-xs font-medium text-maroon-500 hover:underline">
        ← Back to My Orders
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-serif-display)] text-2xl italic text-maroon-500">
          Order #{order.id.slice(0, 8)}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-xs text-maroon-900/50">Placed {new Date(order.createdAt).toLocaleDateString()}</p>

      {(order.trackingNumber || order.carrier) && (
        <div className="mt-5 rounded-2xl border border-maroon-500/10 bg-cream-50 p-4 text-sm text-maroon-900">
          <p className="font-medium">Shipment tracking</p>
          <p className="mt-1 text-maroon-900/70">
            {order.trackingNumber ?? "—"} {order.carrier && `· ${order.carrier}`}
          </p>
        </div>
      )}

      <div className="mt-5 space-y-3 rounded-2xl border border-maroon-500/10 bg-cream-50 p-5">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-100">
              <Image src={item.product.images[0]} alt={item.product.title} fill sizes="56px" className="object-cover" />
            </div>
            <div className="flex-1 text-sm">
              <p className="text-maroon-900">{item.product.title}</p>
              <p className="text-maroon-900/50">Qty {item.qty}</p>
            </div>
            <p className="text-sm font-medium text-maroon-900">{formatCurrency(Number(item.priceAtPurchase) * item.qty)}</p>
          </div>
        ))}
        <div className="flex justify-between border-t border-maroon-500/10 pt-3 text-base font-semibold text-maroon-900">
          <span>Total</span>
          <span>{formatCurrency(Number(order.totalAmount))}</span>
        </div>
      </div>

      {order.returns.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-sm font-semibold text-maroon-900">Returns</p>
          {order.returns.map((ret) => (
            <div key={ret.id} className="rounded-2xl border border-maroon-500/10 bg-cream-50 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="capitalize text-maroon-900">{ret.status}</span>
                {ret.refundAmount && <span className="text-maroon-900/70">{formatCurrency(Number(ret.refundAmount))}</span>}
              </div>
              <p className="mt-1 text-maroon-900/60">{ret.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/formatCurrency";
import { getOrder, type OrderDetail } from "@/lib/orders";

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const data = await getOrder(id);
        if (cancelled) return;
        setOrder(data);
        // Payment confirmation lands via the Razorpay webhook a moment after redirect — poll briefly until it does.
        if (data.status === "created") {
          setTimeout(poll, 2000);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Order not found");
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 font-[family-name:var(--font-serif-display)] text-2xl text-maroon-500">
          {error}
        </h1>
        <Link href="/">
          <Button className="mt-6">Back to Home</Button>
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="mx-auto max-w-lg px-4 py-16 text-center text-maroon-900/60">Loading order…</div>;
  }

  const isPaid = order.status === "paid";

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-12 text-center sm:px-6">
      {isPaid ? (
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
      ) : (
        <div className="mx-auto h-14 w-14 animate-pulse rounded-full border-4 border-maroon-500/30 border-t-maroon-500" />
      )}

      <h1 className="mt-5 font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500">
        {isPaid ? "Order Confirmed!" : "Confirming your payment…"}
      </h1>
      <p className="mt-2 text-sm text-maroon-900/60">
        Order ID: <span className="font-mono">{order.id}</span>
      </p>

      <div className="mt-8 space-y-3 rounded-2xl border border-maroon-500/10 bg-cream-50 p-5 text-left">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-maroon-900">
              {item.product.title} <span className="text-maroon-900/50">× {item.qty}</span>
            </span>
            <span className="font-medium text-maroon-900">
              {formatCurrency(Number(item.priceAtPurchase) * item.qty)}
            </span>
          </div>
        ))}
        <div className="flex justify-between border-t border-maroon-500/10 pt-3 text-base font-semibold text-maroon-900">
          <span>Total Paid</span>
          <span>{formatCurrency(Number(order.totalAmount))}</span>
        </div>
      </div>

      <Link href="/">
        <Button className="mt-8">Continue Shopping</Button>
      </Link>
    </div>
  );
}

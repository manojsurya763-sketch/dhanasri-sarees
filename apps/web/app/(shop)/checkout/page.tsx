"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { Button } from "@/components/ui/Button";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { formatCurrency } from "@/lib/formatCurrency";
import { computeCouponDiscount, findCoupon } from "@/lib/coupons";
import { createOrder } from "@/lib/orders";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { getIdToken } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, couponCode, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-[family-name:var(--font-serif-display)] text-2xl text-maroon-500">
          Your bag is empty
        </h1>
        <p className="mt-2 text-sm text-maroon-900/60">Add a few sarees before checking out.</p>
        <Link href="/category/all">
          <Button className="mt-6">Discover Sarees</Button>
        </Link>
      </div>
    );
  }

  const totalMrp = items.reduce((sum, i) => sum + i.mrp * i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const couponDiscount = computeCouponDiscount(couponCode ? findCoupon(couponCode) : undefined, totalPrice);
  const payable = totalPrice - couponDiscount;
  const shipping = payable >= 5000 ? 0 : 99;
  const total = payable + shipping;

  async function handlePay() {
    if (!isAuthenticated || !user) {
      openAuthModal();
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Your session expired, please log in again");

      const order = await createOrder(
        items.map((i) => ({ productId: i.productId, qty: i.qty })),
        couponCode,
        token
      );

      await openRazorpayCheckout({
        key: order.keyId,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "Dhana Sri Sarees",
        description: "Order payment",
        prefill: { contact: user.phone },
        theme: { color: "#7A1F2B" },
        handler: () => {
          clearCart();
          router.push(`/order-confirmation/${order.orderId}`);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout, please try again");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
      <h1 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500">
        Checkout
      </h1>

      <div className="mt-8 space-y-4 rounded-2xl border border-maroon-500/10 bg-cream-50 p-5">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between text-sm">
            <span className="text-maroon-900">
              {item.title} <span className="text-maroon-900/50">× {item.qty}</span>
            </span>
            <span className="font-medium text-maroon-900">{formatCurrency(item.price * item.qty)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <OrderSummary totalMrp={totalMrp} totalPrice={totalPrice} couponDiscount={couponDiscount} />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <Button className="mt-6 w-full" size="lg" onClick={handlePay} disabled={loading}>
        {loading ? "Processing..." : isAuthenticated ? `Pay ${formatCurrency(total)}` : "Login to Pay"}
      </Button>
    </div>
  );
}

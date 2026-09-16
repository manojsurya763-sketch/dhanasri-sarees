"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { PromoCodeBox } from "@/components/cart/PromoCodeBox";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/formatCurrency";
import { computeCouponDiscount, findCoupon } from "@/lib/coupons";

export default function CartPage() {
  const { items, couponCode, setQty, removeItem, applyCoupon, clearCoupon } = useCartStore();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const totalMrp = items.reduce((sum, i) => sum + i.mrp * i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const couponDiscount = computeCouponDiscount(couponCode ? findCoupon(couponCode) : undefined, totalPrice);
  const payable = totalPrice - couponDiscount;
  const shipping = payable >= 5000 ? 0 : 99;
  const total = payable + shipping;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-8 sm:px-6 sm:pb-10">
      <h1 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500">
        Your Bag
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-maroon-500/10 bg-cream-50 p-5 lg:col-span-2">
          {items.map((item) => (
            <CartLineItem
              key={item.productId}
              item={item}
              onQtyChange={(qty) => setQty(item.productId, qty)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </div>

        <div className="space-y-4">
          <PromoCodeBox appliedCode={couponCode} onApply={applyCoupon} onClear={clearCoupon} />
          <OrderSummary totalMrp={totalMrp} totalPrice={totalPrice} couponDiscount={couponDiscount} />
          <Link href="/checkout" className="hidden lg:block">
            <Button className="w-full" size="lg">
              Proceed To Pay
            </Button>
          </Link>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-maroon-500/10 bg-cream-50 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
        <div>
          <p className="text-xs text-maroon-900/50">Total</p>
          <p className="text-lg font-semibold text-maroon-900">{formatCurrency(total)}</p>
        </div>
        <Link href="/checkout">
          <Button size="lg">Proceed To Pay</Button>
        </Link>
      </div>
    </div>
  );
}

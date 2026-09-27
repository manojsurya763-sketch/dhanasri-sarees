"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { PromoCodeBox } from "@/components/cart/PromoCodeBox";
import { CouponSuggestions } from "@/components/cart/CouponSuggestions";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/formatCurrency";
import { computeCouponDiscount, findCoupon } from "@/lib/coupons";

export const dynamic = "force-dynamic";

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
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 sm:pb-10">
      <Link href="/category/all" className="inline-flex items-center gap-2 text-sm font-medium text-maroon-500">
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
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
          <CouponSuggestions onApply={applyCoupon} />
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
          <p className="text-xs text-maroon-900/50">Total Amount</p>
          <p className="text-lg font-semibold text-maroon-900">{formatCurrency(total)}</p>
        </div>
        <Link href="/checkout">
          <Button size="lg" showArrow>
            Proceed To Pay
          </Button>
        </Link>
      </div>
    </div>
  );
}

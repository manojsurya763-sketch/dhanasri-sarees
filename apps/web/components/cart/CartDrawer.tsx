"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Button } from "@/components/ui/Button";
import { computeCouponDiscount, findCoupon } from "@/lib/coupons";

export function CartDrawer() {
  const open = useUiStore((s) => s.cartDrawerOpen);
  const close = useUiStore((s) => s.closeCartDrawer);
  const { items, couponCode, setQty, removeItem } = useCartStore();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!open) return null;

  const totalMrp = items.reduce((sum, i) => sum + i.mrp * i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const couponDiscount = computeCouponDiscount(couponCode ? findCoupon(couponCode) : undefined, totalPrice);

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-maroon-900/50" onClick={close} aria-hidden />

      <div className="relative flex h-full w-full max-w-md flex-col bg-cream-50 shadow-xl">
        <div className="flex items-center justify-between border-b border-maroon-500/10 px-5 py-4">
          <h2 className="font-[family-name:var(--font-serif-display)] text-xl text-maroon-500">
            Your Bag ({items.length})
          </h2>
          <button onClick={close} aria-label="Close cart" className="text-maroon-900/60 hover:text-maroon-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            items.map((item) => (
              <CartLineItem
                key={item.productId}
                item={item}
                onQtyChange={(qty) => setQty(item.productId, qty)}
                onRemove={() => removeItem(item.productId)}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 border-t border-maroon-500/10 p-5">
            <OrderSummary totalMrp={totalMrp} totalPrice={totalPrice} couponDiscount={couponDiscount} />
            <Link href="/cart" onClick={close}>
              <Button className="w-full" size="lg">
                Proceed To Pay
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

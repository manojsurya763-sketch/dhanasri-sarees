"use client";

import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { QtyStepper } from "@/components/product/QtyStepper";
import { PillSelect } from "@/components/product/PillSelect";
import { TrustIcons } from "@/components/product/TrustIcons";
import { Button } from "@/components/ui/Button";
import { PromoCodeBox } from "@/components/cart/PromoCodeBox";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { productImage } from "@/lib/image";
import { findCoupon } from "@/lib/coupons";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const BLOUSE_SIZES = ["32", "34", "36", "38", "40", "42"];
const PADDING_OPTIONS = ["Unstitched", "Stitched"];
const FINISHING_OPTIONS = ["Standard", "Wrap-on"];
const SUGGESTED_COUPON = "DHANASRI10";

export function AddToCartPanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const blouseTypeOptions = product.blouseTypes.length > 0 ? product.blouseTypes : ["Unstitched", "Stitched"];
  const [blouseType, setBlouseType] = useState(blouseTypeOptions[0]);
  const [blouseSize, setBlouseSize] = useState(BLOUSE_SIZES[2]);
  const [padding, setPadding] = useState(PADDING_OPTIONS[0]);
  const [finishing, setFinishing] = useState(FINISHING_OPTIONS[0]);

  const addToCart = useCartStore((s) => s.addItem);
  const couponCode = useCartStore((s) => s.couponCode);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const clearCoupon = useCartStore((s) => s.clearCoupon);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const inStock = product.stock > 0;
  const image = productImage(product.images, product.title, 0);
  const suggestedCoupon = findCoupon(SUGGESTED_COUPON);

  function handleAddToCart() {
    if (!inStock) return;
    addToCart(
      {
        productId: product.id,
        title: product.title,
        image,
        price: Number(product.price),
        mrp: Number(product.mrp),
        blouseType,
        blouseSize,
        padding,
        finishing,
      },
      qty
    );
    openCartDrawer();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-maroon-900">Quantity:</span>
        <QtyStepper qty={qty} onChange={setQty} max={Math.max(1, Math.min(10, product.stock))} />
      </div>

      <div className="rounded-2xl border border-maroon-500/10 bg-cream-50 p-4">
        <p className="text-sm font-semibold text-maroon-900">Personalize Your Saree</p>
        <p className="text-xs text-maroon-900/50">Choose your preferences for a perfect fit.</p>

        <div className="mt-4 space-y-4">
          <PillSelect label="Blouse Type" options={blouseTypeOptions} value={blouseType} onChange={setBlouseType} />
          <PillSelect
            label="Blouse Size"
            options={BLOUSE_SIZES}
            value={blouseSize}
            onChange={setBlouseSize}
            hint="Size Guide"
          />
          <PillSelect label="Padding" options={PADDING_OPTIONS} value={padding} onChange={setPadding} />
          <PillSelect label="Saree Finishing" options={FINISHING_OPTIONS} value={finishing} onChange={setFinishing} />
          {finishing === "Wrap-on" && (
            <p className="rounded-lg bg-gold-500/10 px-3 py-2 text-[11px] text-maroon-900/70">
              Wrap-on sarees will require additional measurements (hip and height) after selection.
            </p>
          )}
        </div>
      </div>

      {suggestedCoupon && !couponCode && (
        <div className="flex items-center justify-between rounded-xl border border-gold-500/40 bg-gold-500/10 px-4 py-2.5 text-xs">
          <span className="text-maroon-900">
            Save {suggestedCoupon.pctOff}% with <strong>{suggestedCoupon.code}</strong>
          </span>
          <button
            onClick={() => applyCoupon(suggestedCoupon.code)}
            className="font-semibold text-maroon-500 hover:underline"
          >
            Apply
          </button>
        </div>
      )}

      <PromoCodeBox appliedCode={couponCode} onApply={applyCoupon} onClear={clearCoupon} />

      <div className="flex gap-3">
        <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!inStock}>
          <ShoppingBag className="h-4 w-4" />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        <button
          aria-label="Toggle wishlist"
          onClick={() =>
            toggleWishlist({
              productId: product.id,
              title: product.title,
              image,
              price: Number(product.price),
              mrp: Number(product.mrp),
              rating: product.rating,
            })
          }
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-maroon-500/20 text-maroon-900"
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-maroon-500 text-maroon-500")} />
        </button>
      </div>

      <TrustIcons />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { QtyStepper } from "@/components/product/QtyStepper";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AddToCartPanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addToCart = useCartStore((s) => s.addItem);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const inStock = product.stock > 0;

  function handleAddToCart() {
    if (!inStock) return;
    addToCart(
      {
        productId: product.id,
        title: product.title,
        image: "",
        price: Number(product.price),
        mrp: Number(product.mrp),
      },
      qty
    );
    openCartDrawer();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-maroon-900">Quantity</span>
        <QtyStepper qty={qty} onChange={setQty} max={Math.max(1, Math.min(10, product.stock))} />
      </div>

      <div className="flex gap-3">
        <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!inStock}>
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        <button
          aria-label="Toggle wishlist"
          onClick={() =>
            toggleWishlist({
              productId: product.id,
              title: product.title,
              image: "",
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
    </div>
  );
}

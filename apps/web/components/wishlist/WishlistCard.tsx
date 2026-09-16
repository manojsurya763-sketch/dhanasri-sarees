"use client";

import { Trash2 } from "lucide-react";
import { RatingStars } from "@/components/product/RatingStars";
import { Button } from "@/components/ui/Button";
import { formatCurrency, discountPct } from "@/lib/formatCurrency";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore, type WishlistItem } from "@/store/wishlistStore";

export function WishlistCard({ item }: { item: WishlistItem }) {
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);
  const pct = discountPct(item.mrp, item.price);

  function handleMoveToCart() {
    addToCart({
      productId: item.productId,
      title: item.title,
      image: item.image,
      price: item.price,
      mrp: item.mrp,
    });
    removeItem(item.productId);
  }

  return (
    <div className="flex gap-4 rounded-2xl border border-maroon-500/10 bg-cream-50 p-4">
      <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-maroon-400 to-maroon-800 text-xs text-cream-50/70">
        {item.title.slice(0, 1)}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-maroon-900">{item.title}</p>
            {item.brand && <p className="text-xs text-maroon-900/50">{item.brand}</p>}
            {typeof item.rating === "number" && (
              <div className="mt-1">
                <RatingStars rating={item.rating} />
              </div>
            )}
          </div>
          <button
            aria-label="Remove from wishlist"
            onClick={() => removeItem(item.productId)}
            className="p-1 text-maroon-900/40 hover:text-maroon-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            {pct > 0 && <span className="mr-2 text-xs text-maroon-900/40 line-through">{formatCurrency(item.mrp)}</span>}
            <span className="text-sm font-semibold text-maroon-900">{formatCurrency(item.price)}</span>
            {pct > 0 && <span className="ml-2 text-xs font-medium text-purple-600">-{pct}% OFF</span>}
          </div>
          <Button size="sm" onClick={handleMoveToCart} showArrow>
            Move to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

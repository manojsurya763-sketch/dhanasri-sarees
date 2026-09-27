"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { WishlistCard } from "@/components/wishlist/WishlistCard";
import { EmptyWishlist } from "@/components/wishlist/EmptyWishlist";

export const dynamic = "force-dynamic";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500">
        Your Wishlist
      </h1>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <WishlistCard key={item.productId} item={item} />
        ))}
      </div>
    </div>
  );
}

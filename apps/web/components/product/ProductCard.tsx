"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, GitCompare, Heart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/formatCurrency";
import { productImage } from "@/lib/image";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const image = productImage(product.images, product.title, 0);

  return (
    <div className="group w-full shrink-0 sm:w-auto">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-maroon-50">
        <Image
          src={image}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {product.discountPct > 0 && (
          <Badge variant="discount" className="absolute left-2 top-2 z-10">
            -{product.discountPct}%
          </Badge>
        )}

        <button
          aria-label="Toggle wishlist"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({
              productId: product.id,
              title: product.title,
              image,
              price: Number(product.price),
              mrp: Number(product.mrp),
              rating: product.rating,
            });
          }}
          className="absolute right-2 top-2 z-10 rounded-full bg-cream-50/90 p-1.5 text-maroon-900 hover:bg-cream-50"
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-maroon-500 text-maroon-500")} />
        </button>

        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/40 to-transparent py-3 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-full bg-cream-50/90 p-1.5 text-maroon-900">
            <Eye className="h-4 w-4" />
          </span>
          <span className="rounded-full bg-cream-50/90 p-1.5 text-maroon-900">
            <GitCompare className="h-4 w-4" />
          </span>
        </div>
      </Link>

      <div className="mt-3">
        <Link href={`/products/${product.slug}`}>
          <p className="text-sm font-medium text-maroon-900 line-clamp-1">{product.title}</p>
        </Link>
        <p className="text-xs text-maroon-900/50">SKU: {product.sku}</p>
        <div className="mt-1 flex items-center gap-2">
          {product.discountPct > 0 && (
            <span className="text-xs text-maroon-900/40 line-through">{formatCurrency(Number(product.mrp))}</span>
          )}
          <span className="text-sm font-semibold text-maroon-900">{formatCurrency(Number(product.price))}</span>
        </div>
      </div>
    </div>
  );
}

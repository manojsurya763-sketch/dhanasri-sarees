"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export function ProductGrid({
  title,
  subcopy,
  viewAllHref,
  products,
}: {
  title: string;
  subcopy?: string;
  viewAllHref: string;
  products: Product[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(delta: number) {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500">
            {title}
          </h2>
          {subcopy && <p className="mt-1 text-sm text-maroon-900/60">{subcopy}</p>}
        </div>
        <Link href={viewAllHref} className="hidden text-sm font-medium text-maroon-500 hover:underline sm:block">
          View All →
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-center text-sm text-maroon-900/50">No products yet — check back soon.</p>
      ) : (
        <div className="relative mt-8">
          <div
            ref={scrollRef}
            className="grid auto-cols-[70%] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-4 sm:overflow-visible"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-3 sm:hidden">
            <button
              aria-label="Scroll left"
              onClick={() => scrollBy(-260)}
              className="rounded-full border border-maroon-500/20 p-2 text-maroon-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollBy(260)}
              className="rounded-full border border-maroon-500/20 p-2 text-maroon-900"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Link href={viewAllHref} className="mt-6 block text-center text-sm font-medium text-maroon-500 hover:underline sm:hidden">
        View All →
      </Link>
    </section>
  );
}

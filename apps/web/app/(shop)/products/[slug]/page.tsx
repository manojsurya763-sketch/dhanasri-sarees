import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/api";
import { ProductGallery } from "@/components/product/ProductGallery";
import { RatingStars } from "@/components/product/RatingStars";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ReviewsList } from "@/components/product/ReviewsList";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/formatCurrency";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product.id, 4),
    getProductReviews(product.id, 1, 10),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="flex items-center gap-1.5 text-xs text-maroon-900/50">
        <Link href="/" className="hover:text-maroon-500">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-maroon-900">Sarees</span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <ProductGallery title={product.title} images={product.images} />

        <div>
          <h1 className="font-[family-name:var(--font-serif-display)] text-2xl italic text-maroon-500 sm:text-3xl">
            {product.title}
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            <span className="text-xs text-maroon-900/40">|</span>
            <span className="text-xs text-maroon-900/50">{Math.max(20, product.reviewCount)}+ bought in last month</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {product.discountPct > 0 && (
              <span className="text-sm text-maroon-900/40 line-through">{formatCurrency(Number(product.mrp))}</span>
            )}
            <span className="text-2xl font-semibold text-maroon-900">{formatCurrency(Number(product.price))}</span>
            {product.discountPct > 0 && <Badge variant="discount">-{product.discountPct}% OFF</Badge>}
          </div>
          <p className="mt-1 text-xs text-maroon-900/50">Inclusive of all taxes</p>

          <div className="mt-6">
            <AddToCartPanel product={product} />
          </div>
        </div>
      </div>

      <div className="mt-14">
        <ProductTabs product={product} />
      </div>

      {related.items.length > 0 && (
        <ProductGrid title="You May Also Like" viewAllHref="/category/all" products={related.items} />
      )}

      <div className="mt-16">
        <h2 className="font-[family-name:var(--font-serif-display)] text-2xl italic text-maroon-500">Reviews</h2>
        <div className="mt-6">
          <ReviewsList reviews={reviews.items} />
        </div>
      </div>
    </div>
  );
}

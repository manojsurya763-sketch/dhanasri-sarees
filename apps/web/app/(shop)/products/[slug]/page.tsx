import { notFound } from "next/navigation";
import { getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/api";
import { ProductGallery } from "@/components/product/ProductGallery";
import { RatingStars } from "@/components/product/RatingStars";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { Accordion } from "@/components/product/Accordion";
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
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <ProductGallery title={product.title} />

        <div>
          <h1 className="font-[family-name:var(--font-serif-display)] text-2xl italic text-maroon-500 sm:text-3xl">
            {product.title}
          </h1>
          <p className="mt-1 text-sm text-maroon-900/50">Dhana Sri Sarees</p>

          <div className="mt-2">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <div className="mt-4 flex items-center gap-3">
            {product.discountPct > 0 && (
              <span className="text-sm text-maroon-900/40 line-through">{formatCurrency(Number(product.mrp))}</span>
            )}
            <span className="text-2xl font-semibold text-maroon-900">{formatCurrency(Number(product.price))}</span>
            {product.discountPct > 0 && <Badge variant="discount">-{product.discountPct}% OFF</Badge>}
          </div>

          <p className="mt-2 text-xs text-maroon-900/50">
            Delivery in 4–6 business days &middot; 7-day easy returns
          </p>

          <div className="mt-6">
            <AddToCartPanel product={product} />
          </div>

          <div className="mt-8">
            <Accordion title="Description" defaultOpen>
              {product.description ?? "No description available."}
            </Accordion>
            <Accordion title="Specifications">
              <ul className="space-y-1">
                <li>SKU: {product.sku}</li>
                <li>Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</li>
              </ul>
            </Accordion>
          </div>
        </div>
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

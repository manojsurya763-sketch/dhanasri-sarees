import { getFeaturedProducts } from "@/lib/api";
import { ProductGrid } from "@/components/product/ProductGrid";

export async function FeaturedSection() {
  const { items } = await getFeaturedProducts(8);

  return (
    <ProductGrid
      title="Featured Collection"
      subcopy="Handpicked by our stylists."
      viewAllHref="/category/all"
      products={items}
    />
  );
}

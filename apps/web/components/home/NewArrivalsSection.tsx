import { getNewArrivals } from "@/lib/api";
import { ProductGrid } from "@/components/product/ProductGrid";

export async function NewArrivalsSection() {
  const { items } = await getNewArrivals(8);

  return (
    <ProductGrid
      title="New Arrivals"
      subcopy="Fresh off the loom, added this season."
      viewAllHref="/category/all?sort=newest"
      products={items}
    />
  );
}

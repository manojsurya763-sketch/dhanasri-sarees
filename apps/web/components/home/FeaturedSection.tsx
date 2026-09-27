import { getFeaturedProducts } from "@/lib/api";
import { ProductGrid } from "@/components/product/ProductGrid";

export async function FeaturedSection() {
  const { items } = await getFeaturedProducts(8);

  return (
    <ProductGrid
      title="Featured Collection"
      titleClassName="font-[family-name:var(--font-cormorant)] text-4xl font-bold italic tracking-[-0.01em] sm:text-5xl lg:text-[60px]"
      titleStyle={{
        lineHeight: "98%",
        color: "#964531",
        WebkitTextStroke: "0.5px #964531",
      }}
      subcopy="Discover exquisite drapes shaped by tradition, artistry, and timeless beauty."
      subcopyClassName="mt-1 font-[family-name:var(--font-montserrat)] text-[24px] font-normal tracking-[-0.03em]"
      subcopyStyle={{ lineHeight: "154.7%", color: "#000000" }}
      viewAllHref="/category/all"
      products={items}
    />
  );
}

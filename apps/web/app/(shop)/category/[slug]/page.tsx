import { getProductListing } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSortBar } from "@/components/product/FilterSortBar";
import { Pagination } from "@/components/product/Pagination";

const PAGE_SIZE = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const query = new URLSearchParams();
  if (slug !== "all") query.set("category", slug);
  if (typeof sp.sort === "string") query.set("sort", sp.sort);
  if (typeof sp.minPrice === "string") query.set("minPrice", sp.minPrice);
  if (typeof sp.maxPrice === "string") query.set("maxPrice", sp.maxPrice);
  const page = typeof sp.page === "string" ? Number(sp.page) : 1;
  query.set("page", String(page));
  query.set("limit", String(PAGE_SIZE));

  const { items, pagination } = await getProductListing(query);
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));

  const title = slug === "all" ? "All Sarees" : slug.replace(/-/g, " ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-[family-name:var(--font-serif-display)] text-3xl italic capitalize text-maroon-500">
        {title}
      </h1>
      <p className="mt-1 text-sm text-maroon-900/60">{pagination.total} sarees found</p>

      <div className="mt-6">
        <FilterSortBar />
      </div>

      {items.length === 0 ? (
        <p className="mt-16 text-center text-sm text-maroon-900/50">
          No sarees match these filters — try widening your search.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        buildHref={(p) => {
          const next = new URLSearchParams(query);
          next.set("page", String(p));
          next.delete("limit");
          return `?${next.toString()}`;
        }}
      />
    </div>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, getProductFacets, getProductListing } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { ListingToolbar } from "@/components/product/ListingToolbar";
import { Pagination } from "@/components/product/Pagination";

const PAGE_SIZE = 12;
const CSV_KEYS = ["fabric", "colour", "occasion", "origin", "zari", "loom", "blouseType", "discount"];

function toParam(sp: Record<string, string | string[] | undefined>, key: string) {
  const value = sp[key];
  return typeof value === "string" ? value : undefined;
}

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
  for (const key of ["sort", "minPrice", "maxPrice", "intlShipping", ...CSV_KEYS]) {
    const value = toParam(sp, key);
    if (value) query.set(key, value);
  }
  const page = typeof sp.page === "string" ? Number(sp.page) : 1;
  query.set("page", String(page));
  query.set("limit", String(PAGE_SIZE));

  const facetsQuery = new URLSearchParams();
  if (slug !== "all") facetsQuery.set("category", slug);

  const [category, { items, pagination }, facets] = await Promise.all([
    slug === "all" ? Promise.resolve(null) : getCategoryBySlug(slug),
    getProductListing(query),
    getProductFacets(facetsQuery),
  ]);

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));
  const title = category?.name ?? "All Sarees";
  const description =
    category?.description ?? "Explore our full collection of handcrafted sarees for every occasion.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="flex items-center gap-1.5 text-xs text-maroon-900/50">
        <Link href="/" className="hover:text-maroon-500">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-maroon-900">{title}</span>
      </nav>

      <div className="mx-auto mt-6 max-w-2xl text-center">
        <h1 className="font-[family-name:var(--font-serif-display)] text-3xl text-maroon-500 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-maroon-900/70">{description}</p>
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row">
        <FilterSidebar facets={facets} />

        <div className="min-w-0 flex-1">
          <ListingToolbar resultCount={pagination.total} priceBounds={facets.priceRange} />

          {items.length === 0 ? (
            <p className="mt-16 text-center text-sm text-maroon-900/50">
              No sarees match these filters — try widening your search.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
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
      </div>
    </div>
  );
}

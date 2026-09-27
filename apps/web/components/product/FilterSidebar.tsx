"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { FilterCheckboxGroup } from "@/components/product/FilterCheckboxGroup";
import { PriceRangeSlider } from "@/components/product/PriceRangeSlider";
import type { ProductFacets } from "@/lib/types";

const CSV_KEYS = ["fabric", "colour", "occasion", "origin", "zari", "loom", "blouseType", "discount"] as const;
type CsvKey = (typeof CSV_KEYS)[number];

export function FilterSidebar({ facets }: { facets: ProductFacets }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function getSelected(key: CsvKey): string[] {
    const raw = searchParams.get(key);
    return raw ? raw.split(",").filter(Boolean) : [];
  }

  function pushParams(params: URLSearchParams) {
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggle(key: CsvKey, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = getSelected(key);
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    if (next.length) params.set(key, next.join(","));
    else params.delete(key);
    pushParams(params);
  }

  function setPriceRange([min, max]: [number, number]) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(min));
    params.set("maxPrice", String(max));
    pushParams(params);
  }

  function toggleIntlShipping() {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("intlShipping") === "true") params.delete("intlShipping");
    else params.set("intlShipping", "true");
    pushParams(params);
  }

  function reset() {
    router.push(pathname);
  }

  const priceMin = 0;
  const priceMax = facets.priceRange.max || 1;
  const minPrice = Number(searchParams.get("minPrice") ?? facets.priceRange.min);
  const maxPrice = Number(searchParams.get("maxPrice") ?? priceMax);
  const intlShipping = searchParams.get("intlShipping") === "true";

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-serif-display)] text-2xl italic text-maroon-500">Filter</h2>
        <button
          onClick={reset}
          className="flex items-center gap-1 rounded-full border border-maroon-500/20 px-3 py-1.5 text-xs font-medium text-maroon-900 hover:bg-maroon-50"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <div className="mt-5 border-b border-maroon-500/10 pb-5">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-maroon-900">Price</p>
        <PriceRangeSlider min={priceMin} max={priceMax} value={[minPrice, maxPrice]} onCommit={setPriceRange} />
      </div>

      <FilterCheckboxGroup
        title="Discount"
        options={facets.discount.map((d) => ({ value: d.label, count: d.count }))}
        selected={getSelected("discount")}
        onToggle={(v) => toggle("discount", v)}
        renderLabel={(v) => `${v}%`}
        defaultOpen
      />

      <FilterCheckboxGroup
        title="Fabric"
        options={facets.fabric}
        selected={getSelected("fabric")}
        onToggle={(v) => toggle("fabric", v)}
      />
      <FilterCheckboxGroup
        title="Colour"
        options={facets.colour}
        selected={getSelected("colour")}
        onToggle={(v) => toggle("colour", v)}
      />
      <FilterCheckboxGroup
        title="Occasion"
        options={facets.occasion}
        selected={getSelected("occasion")}
        onToggle={(v) => toggle("occasion", v)}
      />
      <FilterCheckboxGroup
        title="Origin"
        options={facets.origin}
        selected={getSelected("origin")}
        onToggle={(v) => toggle("origin", v)}
      />
      <FilterCheckboxGroup
        title="Zari"
        options={facets.zari}
        selected={getSelected("zari")}
        onToggle={(v) => toggle("zari", v)}
      />
      <FilterCheckboxGroup
        title="Loom"
        options={facets.loom}
        selected={getSelected("loom")}
        onToggle={(v) => toggle("loom", v)}
      />
      <FilterCheckboxGroup
        title="Blouse Type"
        options={facets.blouseType}
        selected={getSelected("blouseType")}
        onToggle={(v) => toggle("blouseType", v)}
      />

      <div className="py-4">
        <label className="flex cursor-pointer items-center justify-between gap-2 text-sm font-semibold uppercase tracking-wide text-maroon-900">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={intlShipping}
              onChange={toggleIntlShipping}
              className="h-4 w-4 rounded border-maroon-500/30 text-maroon-500 focus:ring-maroon-500"
            />
            International Shipping
          </span>
          <span className="text-xs font-normal text-maroon-900/40">({facets.internationalShippingCount})</span>
        </label>
      </div>
    </aside>
  );
}

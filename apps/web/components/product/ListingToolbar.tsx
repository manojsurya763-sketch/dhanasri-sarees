"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Recommended" },
];

const CSV_LABELS: Record<string, string> = {
  fabric: "Fabric",
  colour: "Colour",
  occasion: "Occasion",
  origin: "Origin",
  zari: "Zari",
  loom: "Loom",
  blouseType: "Blouse Type",
  discount: "Discount",
};

interface Chip {
  label: string;
  onRemove: () => void;
}

export function ListingToolbar({ resultCount, priceBounds }: { resultCount: number; priceBounds: { min: number; max: number } }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function pushParams(params: URLSearchParams) {
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function removeCsvValue(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const remaining = (params.get(key) ?? "").split(",").filter((v) => v && v !== value);
    if (remaining.length) params.set(key, remaining.join(","));
    else params.delete(key);
    pushParams(params);
  }

  function clearPrice() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    pushParams(params);
  }

  function clearAll() {
    router.push(pathname);
  }

  const chips: Chip[] = [];

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    const min = minPrice ? Number(minPrice) : priceBounds.min;
    const max = maxPrice ? Number(maxPrice) : priceBounds.max;
    chips.push({ label: `${formatCurrency(min)} to ${formatCurrency(max)}`, onRemove: clearPrice });
  }

  for (const [key, label] of Object.entries(CSV_LABELS)) {
    const raw = searchParams.get(key);
    if (!raw) continue;
    for (const value of raw.split(",").filter(Boolean)) {
      chips.push({
        label: key === "discount" ? `${value}% Off` : `${label}: ${value}`,
        onRemove: () => removeCsvValue(key, value),
      });
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <span
            key={chip.label}
            className="flex items-center gap-1.5 rounded-full border border-maroon-500/20 bg-cream-50 px-3 py-1.5 text-xs font-medium text-maroon-900"
          >
            {chip.label}
            <button aria-label={`Remove ${chip.label}`} onClick={chip.onRemove}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {chips.length > 0 && (
          <button onClick={clearAll} className="text-xs font-medium text-maroon-500 hover:underline">
            Clear all
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-maroon-900/60">{resultCount} Products Found</span>
        <select
          aria-label="Sort by"
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("sort", e.target.value);
            pushParams(params);
          }}
          className="rounded-full border border-maroon-500/20 bg-cream-50 px-4 py-2 text-sm text-maroon-900"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

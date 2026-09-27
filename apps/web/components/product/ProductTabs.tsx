"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

const TABS = ["Product Details", "Care Instructions", "Shipping and Returns"] as const;

const CARE_INSTRUCTIONS = [
  "Dry clean recommended for the first wash.",
  "Store folded in a muslin cloth, away from direct sunlight.",
  "Iron on low heat from the reverse side.",
  "Avoid spraying perfume or deodorant directly on the fabric.",
];

const SHIPPING_RETURNS = [
  "Free shipping across India on orders above ₹5,000.",
  "Delivered in 4–6 business days; international shipping in 10–14 days where available.",
  "7-day easy returns from the date of delivery — item must be unused with tags intact.",
  "Customized/stitched blouses are final sale and not eligible for return.",
];

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof TABS)[number]>(TABS[0]);

  const specs = [
    product.fabric && { label: "Fabric", value: product.fabric },
    product.work && { label: "Work", value: product.work },
    { label: "Blouse", value: product.blouseTypes.length > 0 ? product.blouseTypes.join(" / ") : "Unstitched" },
    product.length && { label: "Length", value: product.length },
    product.occasionTag && { label: "Occasion", value: product.occasionTag.replace(/-/g, " ") },
    product.colour && { label: "Colour", value: product.colour },
    product.origin && { label: "Origin", value: product.origin },
    product.zari && { label: "Zari", value: product.zari },
    product.loom && { label: "Loom", value: product.loom },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div>
      <div className="flex gap-6 border-b border-maroon-500/10">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "-mb-px border-b-2 py-3 text-sm font-medium transition-colors",
              active === tab ? "border-maroon-500 text-maroon-500" : "border-transparent text-maroon-900/50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-5 text-sm text-maroon-900/80">
        {active === "Product Details" && (
          <div>
            <h3 className="font-[family-name:var(--font-serif-display)] text-lg italic text-maroon-500">
              About this Saree
            </h3>
            <p className="mt-2 leading-relaxed">{product.description ?? "No description available."}</p>

            {specs.length > 0 && (
              <table className="mt-5 w-full max-w-md text-sm">
                <tbody>
                  {specs.map((spec) => (
                    <tr key={spec.label} className="border-b border-maroon-500/10 last:border-0">
                      <td className="py-2 pr-4 capitalize text-maroon-900/50">{spec.label}</td>
                      <td className="py-2 capitalize text-maroon-900">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {active === "Care Instructions" && (
          <ul className="list-disc space-y-1.5 pl-5">
            {CARE_INSTRUCTIONS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}

        {active === "Shipping and Returns" && (
          <ul className="list-disc space-y-1.5 pl-5">
            {SHIPPING_RETURNS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

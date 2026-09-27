import Image from "next/image";
import { CheckCheck, Trash2 } from "lucide-react";
import { QtyStepper } from "@/components/product/QtyStepper";
import { RatingStars } from "@/components/product/RatingStars";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, discountPct } from "@/lib/formatCurrency";
import { estimatedDeliveryDate } from "@/lib/date";
import { placeholderImage } from "@/lib/image";
import type { CartItem } from "@/store/cartStore";

export function CartLineItem({
  item,
  brand = "Dhana Sri Sarees",
  rating = 4.6,
  reviewCount = 168,
  onQtyChange,
  onRemove,
}: {
  item: CartItem;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}) {
  const pct = discountPct(item.mrp, item.price);

  return (
    <div className="flex gap-4 border-b border-maroon-500/10 py-5 last:border-0 sm:gap-6">
      <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-xl bg-maroon-50 sm:w-36">
        <Image src={item.image || placeholderImage(item.title)} alt={item.title} fill sizes="144px" className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-[family-name:var(--font-serif-display)] text-base italic text-maroon-500 sm:text-lg">
              {item.title}
            </p>
            <p className="mt-0.5 text-xs text-maroon-900/50">by {brand}</p>
            {(item.blouseType || item.blouseSize || item.padding || item.finishing) && (
              <p className="mt-0.5 text-[11px] text-maroon-900/50">
                {[item.blouseType, item.blouseSize && `Size ${item.blouseSize}`, item.padding, item.finishing]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            <div className="mt-1.5">
              <RatingStars rating={rating} reviewCount={reviewCount} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <QtyStepper qty={item.qty} onChange={onQtyChange} variant="boxed" />
          <button
            aria-label="Remove item"
            onClick={onRemove}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-maroon-500/20 text-maroon-900/60 hover:border-maroon-500/50 hover:text-maroon-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {pct > 0 && <span className="text-xs text-maroon-900/40 line-through">{formatCurrency(item.mrp)}</span>}
          <span className="text-lg font-semibold text-maroon-900">{formatCurrency(item.price)}</span>
          {pct > 0 && <Badge variant="discount">-{pct}% OFF</Badge>}
        </div>

        <div className="mt-3 space-y-1.5 rounded-lg bg-cream-100/70 px-3 py-2.5 text-xs text-maroon-900/70">
          <p className="flex items-center gap-2">
            <CheckCheck className="h-3.5 w-3.5 text-maroon-500" /> FREE delivery {estimatedDeliveryDate()}
          </p>
          <p className="flex items-center gap-2">
            <CheckCheck className="h-3.5 w-3.5 text-maroon-500" /> 7 Day Return available
          </p>
        </div>
      </div>
    </div>
  );
}

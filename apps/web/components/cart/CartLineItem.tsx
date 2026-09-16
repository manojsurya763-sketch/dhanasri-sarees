import { Trash2, Truck, RefreshCcw } from "lucide-react";
import { QtyStepper } from "@/components/product/QtyStepper";
import { RatingStars } from "@/components/product/RatingStars";
import { formatCurrency, discountPct } from "@/lib/formatCurrency";
import type { CartItem } from "@/store/cartStore";

export function CartLineItem({
  item,
  brand = "Dhana Sri Sarees",
  rating = 4.8,
  onQtyChange,
  onRemove,
}: {
  item: CartItem;
  brand?: string;
  rating?: number;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}) {
  const pct = discountPct(item.mrp, item.price);

  return (
    <div className="flex gap-4 border-b border-maroon-500/10 py-4 last:border-0">
      <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-maroon-400 to-maroon-800 text-xs text-cream-50/70">
        {item.title.slice(0, 1)}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-maroon-900">{item.title}</p>
            <p className="text-xs text-maroon-900/50">{brand}</p>
            <div className="mt-1">
              <RatingStars rating={rating} />
            </div>
          </div>
          <button
            aria-label="Remove item"
            onClick={onRemove}
            className="p-1 text-maroon-900/40 hover:text-maroon-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <QtyStepper qty={item.qty} onChange={onQtyChange} />
          <div className="text-right">
            {pct > 0 && (
              <p className="text-xs text-maroon-900/40 line-through">{formatCurrency(item.mrp)}</p>
            )}
            <p className="text-sm font-semibold text-maroon-900">{formatCurrency(item.price)}</p>
            {pct > 0 && <p className="text-xs font-medium text-purple-600">-{pct}% OFF</p>}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-maroon-900/50">
          <span className="flex items-center gap-1">
            <Truck className="h-3 w-3" /> Delivery in 4–6 days
          </span>
          <span className="flex items-center gap-1">
            <RefreshCcw className="h-3 w-3" /> 7-day return
          </span>
        </div>
      </div>
    </div>
  );
}

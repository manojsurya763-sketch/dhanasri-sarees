import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QtyStepper({
  qty,
  onChange,
  min = 1,
  max = 10,
  variant = "minimal",
}: {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  variant?: "minimal" | "boxed";
}) {
  if (variant === "boxed") {
    return (
      <div className="inline-flex items-center overflow-hidden rounded-lg border border-maroon-500/20">
        <button
          aria-label="Decrease quantity"
          onClick={() => onChange(Math.max(min, qty - 1))}
          disabled={qty <= min}
          className="flex h-9 w-9 items-center justify-center bg-gold-500/20 text-maroon-900 disabled:opacity-30"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="flex h-9 w-9 items-center justify-center bg-cream-50 text-sm font-medium text-maroon-900">
          {qty}
        </span>
        <button
          aria-label="Increase quantity"
          onClick={() => onChange(Math.min(max, qty + 1))}
          disabled={qty >= max}
          className="flex h-9 w-9 items-center justify-center bg-gold-500/20 text-maroon-900 disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center rounded-full border border-maroon-500/20">
      <button
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, qty - 1))}
        disabled={qty <= min}
        className={cn("flex h-8 w-8 items-center justify-center text-maroon-900 disabled:opacity-30")}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-6 text-center text-sm font-medium text-maroon-900">{qty}</span>
      <button
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, qty + 1))}
        disabled={qty >= max}
        className="flex h-8 w-8 items-center justify-center text-maroon-900 disabled:opacity-30"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  qty,
  onChange,
  min = 1,
  max = 10,
}: {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-maroon-500/20">
      <button
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, qty - 1))}
        disabled={qty <= min}
        className="flex h-8 w-8 items-center justify-center text-maroon-900 disabled:opacity-30"
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

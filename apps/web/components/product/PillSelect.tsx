"use client";

import { cn } from "@/lib/utils";

export function PillSelect({
  label,
  options,
  value,
  onChange,
  hint,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-maroon-900">{label}</span>
        {hint && <span className="text-[11px] text-maroon-900/40">{hint}</span>}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              value === opt
                ? "border-maroon-500 bg-maroon-500 text-cream-50"
                : "border-maroon-500/20 text-maroon-900 hover:border-maroon-500/50"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

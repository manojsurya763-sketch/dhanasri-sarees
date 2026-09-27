"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  count: number;
}

export function FilterCheckboxGroup({
  title,
  options,
  selected,
  onToggle,
  defaultOpen = false,
  renderLabel,
}: {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  defaultOpen?: boolean;
  renderLabel?: (value: string) => string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-maroon-500/10 py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold uppercase tracking-wide text-maroon-900"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 text-maroon-900/60 transition-transform", open && "rotate-180")} />
      </button>

      {open &&
        (options.length === 0 ? (
          <p className="mt-3 text-xs text-maroon-900/40">No options available</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {options.map((opt) => (
              <li key={opt.value}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-maroon-900/80">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(opt.value)}
                      onChange={() => onToggle(opt.value)}
                      className="h-4 w-4 rounded border-maroon-500/30 text-maroon-500 focus:ring-maroon-500"
                    />
                    {renderLabel ? renderLabel(opt.value) : opt.value}
                  </span>
                  <span className="text-xs text-maroon-900/40">({opt.count})</span>
                </label>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}

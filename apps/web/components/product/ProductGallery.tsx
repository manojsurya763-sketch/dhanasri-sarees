"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ title, count = 4 }: { title: string; count?: number }) {
  const [active, setActive] = useState(0);
  const thumbs = Array.from({ length: count });

  return (
    <div className="flex gap-3">
      <div className="flex flex-col gap-2">
        {thumbs.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "flex h-16 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-maroon-400 to-maroon-800 text-xs text-cream-50/70",
              active === i ? "ring-2 ring-maroon-500" : "opacity-70"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="flex flex-1 aspect-[3/4] items-center justify-center rounded-2xl bg-gradient-to-br from-maroon-400 to-maroon-900 text-cream-50/70">
        {title.slice(0, 1)}
      </div>
    </div>
  );
}

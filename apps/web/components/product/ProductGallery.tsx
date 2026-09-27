"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { placeholderImage } from "@/lib/image";

export function ProductGallery({ title, images }: { title: string; images: string[] }) {
  const gallery = images.length > 0 ? images : [placeholderImage(title)];
  const [active, setActive] = useState(0);

  function go(delta: number) {
    setActive((i) => (i + delta + gallery.length) % gallery.length);
  }

  return (
    <div className="flex gap-3">
      {gallery.length > 1 && (
        <div className="flex flex-col gap-2">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-14 overflow-hidden rounded-lg bg-maroon-50",
                active === i ? "ring-2 ring-maroon-500" : "opacity-70"
              )}
            >
              <Image src={src} alt={`${title} thumbnail ${i + 1}`} fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 aspect-[3/4] overflow-hidden rounded-2xl bg-maroon-50">
        <Image
          key={gallery[active]}
          src={gallery[active]}
          alt={title}
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
          priority
          className="object-cover"
        />

        {gallery.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-cream-50/90 p-2 text-maroon-900 hover:bg-cream-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cream-50/90 p-2 text-maroon-900 hover:bg-cream-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {gallery.map((_, i) => (
                <span
                  key={i}
                  className={cn("h-1.5 w-1.5 rounded-full", active === i ? "bg-maroon-500" : "bg-cream-50/80")}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

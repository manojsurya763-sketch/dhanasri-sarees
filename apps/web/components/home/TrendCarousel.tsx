"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TRENDS = [
  { title: "Draped for Forever", subcopy: "Timeless silhouettes for the modern bride.", slug: "wedding" },
  { title: "Pastel Season", subcopy: "Soft hues for daytime celebrations.", slug: "festive" },
  { title: "Threadwork Stories", subcopy: "Handloom artistry, thread by thread.", slug: "casual" },
  { title: "After Dark", subcopy: "Rich tones for evening soirees.", slug: "party" },
];

export function TrendCarousel() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const paused = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setActive((i) => (i + 1) % TRENDS.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  function go(delta: number) {
    setActive((i) => (i + delta + TRENDS.length) % TRENDS.length);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  const current = TRENDS[active];
  const thumbnails = TRENDS.filter((_, i) => i !== active).slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500 sm:text-4xl">
          Shop by Trend
        </h2>
      </div>

      <div
        className="relative mt-10 flex min-h-[340px] items-end overflow-hidden rounded-2xl bg-gradient-to-br from-maroon-600 to-maroon-900 p-6 sm:p-10"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 bg-black/20" />

        <button
          aria-label="Previous trend"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-cream-50/90 p-2 text-maroon-900 hover:bg-cream-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          aria-label="Next trend"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cream-50/90 p-2 text-maroon-900 hover:bg-cream-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="relative max-w-md">
          <h3 className="font-[family-name:var(--font-serif-display)] text-2xl italic text-cream-50 sm:text-3xl">
            {current.title}
          </h3>
          <p className="mt-2 text-sm text-cream-100/80">{current.subcopy}</p>
          <Link href={`/category/${current.slug}`} className="mt-5 inline-block">
            <Button variant="gold" showArrow>
              Shop Now
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {TRENDS.map((t, i) => (
          <button
            key={t.slug}
            aria-label={`Go to ${t.title}`}
            onClick={() => setActive(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              i === active ? "w-6 bg-maroon-500" : "bg-maroon-500/30"
            )}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {thumbnails.map((t) => (
          <Link
            key={t.slug}
            href={`/category/${t.slug}`}
            className="group relative flex aspect-square items-end overflow-hidden rounded-xl bg-gradient-to-br from-gold-500 to-maroon-600 p-3"
          >
            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/25" />
            <span className="relative text-sm font-medium text-cream-50">{t.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

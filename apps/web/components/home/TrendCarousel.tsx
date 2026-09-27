"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TRENDS = [
  {
    title: "Draped for Forever",
    subcopy: "Timeless silk sarees for the moments you'll cherish for a lifetime.",
    slug: "wedding",
    image: "/images/shop-by-trend.png",
  },
  {
    title: "Pastel Season",
    subcopy: "Soft hues for daytime celebrations.",
    slug: "festive",
    // Source photo is only 206x400 — too low-res to expand wide without blurring, so this panel
    // stays on the gradient fallback until a higher-res photo is available.
    image: null,
  },
  {
    title: "Threadwork Stories",
    subcopy: "Handloom artistry, thread by thread.",
    slug: "casual",
    image: null,
  },
  {
    title: "After Dark",
    subcopy: "Rich tones for evening soirees.",
    slug: "party",
    image: null,
  },
];

export function TrendCarousel() {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500 sm:text-4xl">
          Shop by Trend
        </h2>
        <p className="mt-2 text-sm text-maroon-900/60">
          Discover exquisite drapes shaped by tradition, artistry, and timeless beauty.
        </p>
      </div>

      <div className="mt-10 flex h-[420px] gap-3 overflow-hidden rounded-2xl sm:h-[460px]">
        {TRENDS.map((trend, i) => {
          const isActive = i === active;
          return (
            <div
              key={trend.slug}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(i)}
              className={cn(
                "group relative flex min-w-0 cursor-pointer overflow-hidden rounded-2xl outline-none transition-[flex-grow] duration-500 ease-in-out",
                isActive ? "flex-[6]" : "flex-[1]"
              )}
              style={{ flexGrow: isActive ? 6 : 1 }}
            >
              {trend.image ? (
                <Image
                  src={trend.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 60vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-maroon-600 to-maroon-900" />
              )}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t transition-opacity duration-500",
                  isActive ? "from-black/75 via-black/25 to-black/10" : "from-black/60 via-black/40 to-black/20"
                )}
              />

              <div className={cn("relative flex w-full p-4 sm:p-6", isActive ? "flex-col justify-end" : "h-full items-end justify-center pb-6")}>
                <h3
                  className={cn(
                    "font-[family-name:var(--font-serif-display)] italic text-cream-50 transition-all duration-300",
                    isActive
                      ? "text-xl opacity-100 delay-150 sm:text-2xl"
                      : "whitespace-nowrap text-sm opacity-90 [writing-mode:vertical-rl] sm:text-base"
                  )}
                >
                  {trend.title}
                </h3>

                {isActive && (
                  <div className="mt-2 max-h-24 overflow-hidden opacity-100 transition-all delay-150 duration-300">
                    <p className="max-w-xs text-sm text-cream-100/80">{trend.subcopy}</p>
                    <Link
                      href={`/category/${trend.slug}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-400 hover:text-gold-300"
                    >
                      Shop Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

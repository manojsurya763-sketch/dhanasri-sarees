import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

function EmptyCartIllustration() {
  return (
    <svg viewBox="0 0 220 180" className="h-40 w-48 sm:h-48 sm:w-56" fill="none" aria-hidden>
      <g stroke="var(--color-maroon-900)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M62 62h122l-14 62a10 10 0 0 1-10 8H88a10 10 0 0 1-10-8L62 62Z" fill="var(--color-cream-50)" />
        <path d="M62 62 54 34H32" />
        {[80, 100, 120, 140, 160].map((x) => (
          <line key={x} x1={x} y1="66" x2={x - 6} y2="126" strokeWidth="2" opacity="0.5" />
        ))}
        <circle cx="92" cy="150" r="10" fill="var(--color-maroon-900)" />
        <circle cx="160" cy="150" r="10" fill="var(--color-maroon-900)" />
      </g>

      <g>
        <ellipse cx="150" cy="30" rx="9" ry="7" fill="var(--color-maroon-500)" />
        <circle cx="143" cy="26" r="2.5" fill="var(--color-cream-50)" />
        <circle cx="157" cy="26" r="2.5" fill="var(--color-cream-50)" />
        <path d="M150 23 141 6" stroke="var(--color-maroon-900)" strokeWidth="2" strokeLinecap="round" />
        <path d="M162 16c4-4 10-4 12 0-4 3-9 3-12 0Z" fill="var(--color-maroon-500)" />
        <path d="M150 37c-3 6-3 16 6 20" stroke="var(--color-maroon-900)" strokeWidth="1.5" strokeDasharray="2 3" fill="none" />
      </g>
    </svg>
  );
}

export function EmptyCart() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10 text-center">
      <Link href="/category/all" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-maroon-500">
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Link>

      <div className="flex flex-col items-center">
        <EmptyCartIllustration />

        <h2 className="mt-8 font-[family-name:var(--font-serif-display)] text-2xl italic text-maroon-900 sm:text-3xl">
          Nothing Here, Yet!
        </h2>
        <p className="mt-2 max-w-xs text-sm text-maroon-900/60">
          Maybe it&apos;s time to add a little something beautiful.
        </p>
        <Link href="/category/all" className="mt-6">
          <Button showArrow>Discover Sarees</Button>
        </Link>
      </div>
    </div>
  );
}

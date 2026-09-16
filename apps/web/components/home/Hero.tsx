import Link from "next/link";
import { Button } from "@/components/ui/Button";

const AVATAR_INITIALS = ["A", "P", "R"];

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[radial-gradient(circle_at_75%_30%,var(--color-maroon-400),var(--color-maroon-900)_65%)]">
      <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/90 via-maroon-900/50 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="max-w-xl">
          <h1 className="font-[family-name:var(--font-serif-display)] text-4xl italic text-cream-50 sm:text-5xl md:text-6xl">
            Woven for Your Finest Moments
          </h1>
          <p className="mt-4 max-w-md text-cream-100/80">
            Handcrafted sarees that carry the artistry of generations —
            discover a collection made for every celebration.
          </p>
          <Link href="/category/all?sort=newest" className="mt-8 inline-block">
            <Button size="lg" showArrow>
              Shop the Collection
            </Button>
          </Link>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-3">
              {AVATAR_INITIALS.map((initial, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-cream-50 bg-gold-500 text-xs font-semibold text-maroon-900"
                >
                  {initial}
                </div>
              ))}
            </div>
            <p className="text-sm text-cream-50">
              <span className="font-semibold">4.9 ★</span>{" "}
              <span className="text-cream-100/70">320 Reviews</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

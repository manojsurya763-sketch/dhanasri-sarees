import Link from "next/link";
import { Button } from "@/components/ui/Button";

const CHIP_COLORS = ["from-gold-500 to-maroon-600", "from-maroon-400 to-maroon-700", "from-gold-600 to-maroon-500"];

export function BrandStoryBand() {
  return (
    <section className="bg-maroon-900 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="font-[family-name:var(--font-serif-display)] text-2xl italic leading-relaxed text-cream-50 sm:text-3xl">
          Every saree we weave carries{" "}
          <span className="inline-flex -translate-y-1 gap-1 align-middle">
            {CHIP_COLORS.map((c, i) => (
              <span key={i} className={`inline-block h-8 w-8 rounded-full bg-gradient-to-br ${c} sm:h-10 sm:w-10`} />
            ))}
          </span>{" "}
          two decades of craftsmanship, thread, and story — made to be worn, not just owned.
        </p>
        <p className="mt-4 text-sm text-cream-100/70">
          From the looms of our artisans to your finest moments.
        </p>
        <Link href="/about" className="mt-8 inline-block">
          <Button variant="secondary" showArrow className="border-cream-50 text-cream-50 hover:bg-cream-50/10">
            Discover Our Story
          </Button>
        </Link>
      </div>
    </section>
  );
}

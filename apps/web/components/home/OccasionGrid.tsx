import Link from "next/link";
import { cn } from "@/lib/utils";

const OCCASIONS = [
  { title: "The Wedding Edit", slug: "wedding", large: true, from: "from-maroon-600", to: "to-maroon-900" },
  { title: "Festive Ready", slug: "festive", from: "from-gold-600", to: "to-maroon-600" },
  { title: "Haldi and Mehandi", slug: "haldi-mehandi", from: "from-yellow-600", to: "to-maroon-500" },
  { title: "Casual Ethnic", slug: "casual", from: "from-maroon-400", to: "to-maroon-900" },
  { title: "Party Night", slug: "party", from: "from-maroon-900", to: "to-purple-900" },
];

export function OccasionGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500 sm:text-4xl">
          Dress By Occasion
        </h2>
        <p className="mt-2 text-sm text-maroon-900/60">
          A saree for every celebration in your calendar.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:grid-rows-2">
        {OCCASIONS.map((occ) => (
          <Link
            key={occ.slug}
            href={`/category/${occ.slug}`}
            className={cn(
              "group relative flex min-h-[200px] items-end overflow-hidden rounded-2xl bg-gradient-to-br p-5",
              occ.from,
              occ.to,
              occ.large && "col-span-2 row-span-2 min-h-[320px] sm:min-h-full"
            )}
          >
            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/25" />
            <div className="relative">
              <h3 className="font-[family-name:var(--font-serif-display)] text-xl italic text-cream-50 sm:text-2xl">
                {occ.title}
              </h3>
              <span className="mt-1 inline-block text-sm text-cream-50/90 underline-offset-4 group-hover:underline">
                Explore More →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

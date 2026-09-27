import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const OCCASIONS = [
  { title: "The Wedding Edit", slug: "wedding", large: true, image: "/images/occasions/wedding.png" },
  { title: "Festive Ready", slug: "festive", image: "/images/occasions/festive.png" },
  { title: "Haldi and Mehandi", slug: "haldi-mehandi", image: "/images/occasions/haldi-mehandi.png" },
  { title: "Casual Ethnic", slug: "casual", image: "/images/occasions/casual.png" },
  { title: "Party Night", slug: "party", image: "/images/occasions/party.png" },
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
              "group relative flex min-h-[200px] items-end overflow-hidden rounded-2xl bg-maroon-900 p-5",
              occ.large && "col-span-2 row-span-2 min-h-[320px] sm:min-h-full"
            )}
          >
            <Image
              src={occ.image}
              alt={occ.title}
              fill
              sizes={occ.large ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"}
              className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity group-hover:from-black/80" />
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

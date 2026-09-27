import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

function FabricChip() {
  return (
    <span className="relative -translate-y-1 inline-block h-8 w-16 overflow-hidden rounded-full align-middle sm:h-10 sm:w-20">
      <Image src="/images/fabric-chip.png" alt="" fill sizes="80px" className="object-cover" />
    </span>
  );
}

export function BrandStoryBand() {
  return (
    <section className="bg-maroon-500 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="font-[family-name:var(--font-serif-display)] text-2xl italic leading-relaxed text-cream-50 sm:text-3xl">
          We believe every <FabricChip /> saree carries a story, <FabricChip /> holds a tradition, and becomes part
          of <FabricChip /> your story.
        </p>
        <p className="mt-6 text-sm text-cream-100/80 sm:text-base">
          At Dhana Sri Sarees, we celebrate the timeless beauty of Indian textiles through thoughtfully curated
          sarees, bringing together heritage, craftsmanship, and contemporary elegance.
        </p>
        <Link href="/about" className="mt-8 inline-block">
          <Button className="rounded-lg bg-cream-50 text-maroon-500 hover:bg-cream-100" showArrow>
            Discover Our Story
          </Button>
        </Link>
      </div>
    </section>
  );
}

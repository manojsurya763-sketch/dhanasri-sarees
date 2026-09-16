import { PageHero } from "@/components/layout/PageHero";
import { CTABanner } from "@/components/home/CTABanner";

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Us" />

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
        <div className="postage-stamp mx-auto flex aspect-[4/5] w-full max-w-sm items-center justify-center bg-gradient-to-br from-maroon-400 to-maroon-900 p-4">
          <span className="font-[family-name:var(--font-serif-display)] text-cream-50/80">
            Founder Portrait
          </span>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500">
            Our Story
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-maroon-900/80">
            <p>
              Dhana Sri Sarees began in 2004 as a small family loom in South
              India, driven by a single belief: that a saree is not just
              fabric, but a keepsake of the moments it is worn for.
            </p>
            <p>
              Two decades on, we work directly with weaver communities to
              bring handcrafted silk, cotton, and threadwork sarees to
              women across the world — without losing the artistry that
              started it all.
            </p>
            <p>
              Every piece in our collection is chosen for the story it can
              become part of — a wedding, a festival, or an ordinary day
              made extraordinary.
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

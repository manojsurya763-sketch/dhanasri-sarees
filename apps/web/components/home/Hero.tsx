import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const AVATARS = ["/images/avatars/avatar-1.png", "/images/avatars/avatar-2.png", "/images/avatars/avatar-3.png"];

// background-image/background-clip aren't inherited CSS properties, so each
// line of the heading (rendered as its own <span> to control line breaks)
// needs this applied directly rather than once on the parent <h1>.
const gradientTextStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(175deg, #FFF0DA 1%, #CA791C 1%, #ECD8A3 29%, #98690D 68%, #FFF2DB 87%, #BB943B 96%, #FBF5D1 96%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextStroke: "0.52px #BB943B",
};

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      <Image
        src="/images/hero.png"
        alt="Woman draped in a gold silk saree in a palace setting"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />
      {/* Duplicate, blurred layer — masked to fade out left-to-right, so the
          blur is strongest over the text on the left and gone by the right
          edge, revealing the sharp photo underneath. */}
      <Image
        src="/images/hero.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover object-[70%_center] blur-sm scale-105"
        style={{
          maskImage: "linear-gradient(to right, black 0%, black 40%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to right, black 0%, black 40%, transparent 80%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/14 via-maroon-900/7 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="max-w-xl">
          <h1
            className="font-[family-name:var(--font-cormorant)] text-3xl font-bold italic leading-[0.95] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-[80px]"
          >
            <span className="whitespace-nowrap" style={gradientTextStyle}>
              Woven for Your Finest
            </span>
            <br />
            <span style={gradientTextStyle}>Moments</span>
          </h1>
          <p className="mt-6 max-w-md text-cream-100/80">
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
              {AVATARS.map((src, i) => (
                <div key={i} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-cream-50">
                  <Image src={src} alt="" fill sizes="36px" className="object-cover" />
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

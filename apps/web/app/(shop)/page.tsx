import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { OccasionGrid } from "@/components/home/OccasionGrid";
import { TrendCarousel } from "@/components/home/TrendCarousel";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { BrandStoryBand } from "@/components/home/BrandStoryBand";
import { Testimonials } from "@/components/home/Testimonials";
import { CTABanner } from "@/components/home/CTABanner";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <OccasionGrid />
      <TrendCarousel />
      <Suspense fallback={<ProductGridSkeleton />}>
        <NewArrivalsSection />
      </Suspense>
      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedSection />
      </Suspense>
      <BrandStoryBand />
      <Testimonials />
      <CTABanner />
    </>
  );
}

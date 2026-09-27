import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden py-16">
      <Image src="/images/find-drape.png" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/90 via-maroon-900/60 to-maroon-900/20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-lg">
          <h2 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-cream-50 sm:text-4xl">
            Find Your Perfect Drape
          </h2>
          <p className="mt-3 text-sm text-cream-100/80 sm:text-base">
            Book a one-on-one virtual appointment with our stylists and let us
            help you choose the saree for your moment.
          </p>
          <Button variant="gold" size="lg" showArrow className="mt-6">
            Book A Virtual Appointment
          </Button>
        </div>
      </div>
    </section>
  );
}

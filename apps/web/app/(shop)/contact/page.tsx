import { Clock, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { StaticMap } from "@/components/layout/StaticMap";
import { CTABanner } from "@/components/home/CTABanner";

const INFO_TILES = [
  { icon: Phone, label: "Call Us", value: "+91 98765 43210" },
  { icon: Mail, label: "Email Id", value: "care@dhanasrisarees.com" },
  { icon: Clock, label: "Office Hours", value: "Mon–Sat, 10 AM – 7 PM" },
];

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500">
            Get In Touch
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-maroon-900/70">
            Have a question about an order, a fabric, or a custom drape?
            We&apos;d love to hear from you.
          </p>
        </div>

        <div className="mt-10">
          <StaticMap />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {INFO_TILES.map((tile) => (
            <div
              key={tile.label}
              className="flex items-center gap-4 rounded-xl border border-maroon-500/10 bg-cream-50 p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon-500/10 text-maroon-500">
                <tile.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-maroon-900/50">{tile.label}</p>
                <p className="text-sm font-medium text-maroon-900">{tile.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}

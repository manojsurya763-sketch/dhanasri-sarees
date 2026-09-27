import Image from "next/image";

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="relative flex h-56 items-center justify-center overflow-hidden sm:h-64">
      <Image src="/images/page-hero.png" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-maroon-900/60" />

      <div className="relative text-center">
        <h1 className="font-[family-name:var(--font-serif-display)] text-4xl italic text-cream-50 sm:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-cream-100/80">{subtitle}</p>}
      </div>
    </section>
  );
}

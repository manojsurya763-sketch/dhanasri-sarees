export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="relative flex h-56 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,var(--color-maroon-400),var(--color-maroon-900)_70%)] sm:h-64">
      <div className="relative text-center">
        <h1 className="font-[family-name:var(--font-serif-display)] text-4xl italic text-cream-50 sm:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-cream-100/80">{subtitle}</p>}
      </div>
    </section>
  );
}

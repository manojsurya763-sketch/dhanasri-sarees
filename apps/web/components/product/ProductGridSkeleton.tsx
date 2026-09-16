export function ProductGridSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="h-8 w-48 animate-pulse rounded bg-maroon-500/10" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] rounded-xl bg-maroon-500/10" />
            <div className="mt-3 h-4 w-3/4 rounded bg-maroon-500/10" />
            <div className="mt-2 h-4 w-1/2 rounded bg-maroon-500/10" />
          </div>
        ))}
      </div>
    </section>
  );
}

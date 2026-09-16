const REVIEWS = [
  {
    name: "Ananya R.",
    collection: "Wedding Edit",
    quote: "The silk quality and the threadwork are unmatched — I felt like royalty on my wedding day.",
    initial: "A",
  },
  {
    name: "Priya S.",
    collection: "Festive Ready",
    quote: "Delivered fast and the color was even richer in person. My go-to for every festival now.",
    initial: "P",
  },
  {
    name: "Meena K.",
    collection: "Casual Ethnic",
    quote: "Comfortable enough for everyday wear but still looks special. Customer service was lovely too.",
    initial: "M",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500 sm:text-4xl">
          Trusted by Women Like You
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {REVIEWS.map((review) => (
          <div key={review.name} className="postage-stamp bg-cream-50 p-6">
            <p className="font-[family-name:var(--font-serif-display)] italic text-maroon-900/90">
              &ldquo;{review.quote}&rdquo;
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-500 text-sm font-semibold text-cream-50">
                {review.initial}
              </div>
              <div>
                <p className="text-sm font-semibold text-maroon-900">{review.name}</p>
                <p className="text-xs text-maroon-900/60">{review.collection}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";
import { cn } from "@/lib/utils";

interface Review {
  quote: string;
  name: string;
  collection: string;
  avatar: string;
}

const AVATARS = ["/images/avatars/avatar-1.png", "/images/avatars/avatar-2.png", "/images/avatars/avatar-3.png"];

const REVIEWS: Review[] = [
  {
    quote: "The silk quality and the threadwork are unmatched — I felt like royalty on my wedding day.",
    name: "Ananya R.",
    collection: "Wedding Edit",
    avatar: AVATARS[0],
  },
  {
    quote: "Delivered fast and the color was even richer in person. My go-to for every festival now.",
    name: "Priya S.",
    collection: "Festive Ready",
    avatar: AVATARS[1],
  },
  {
    quote: "Comfortable enough for everyday wear but still looks special. Customer service was lovely too.",
    name: "Meena K.",
    collection: "Casual Ethnic",
    avatar: AVATARS[2],
  },
  {
    quote: "The zari border on my Kanjivaram is exquisite — photographs don't do it justice.",
    name: "Divya N.",
    collection: "Wedding Edit",
    avatar: AVATARS[0],
  },
  {
    quote: "Ordered for Haldi and it was the softest cotton I've worn. Perfect fit, no alterations needed.",
    name: "Kavya T.",
    collection: "Haldi & Mehandi",
    avatar: AVATARS[1],
  },
  {
    quote: "Wore it to a friend's reception and got stopped for compliments all night. Worth every rupee.",
    name: "Ishita M.",
    collection: "Party Night",
    avatar: AVATARS[2],
  },
  {
    quote: "Two sarees in, zero regrets. The drape falls beautifully without any extra pinning.",
    name: "Ritu B.",
    collection: "Festive Ready",
    avatar: AVATARS[0],
  },
  {
    quote: "The packaging alone felt premium, and the saree inside was even better than the photos.",
    name: "Sneha V.",
    collection: "Casual Ethnic",
    avatar: AVATARS[1],
  },
  {
    quote: "My mother-in-law asked where I got it from — that's the highest compliment I could get.",
    name: "Pooja D.",
    collection: "Wedding Edit",
    avatar: AVATARS[2],
  },
];

const COLUMNS = [REVIEWS.slice(0, 3), REVIEWS.slice(3, 6), REVIEWS.slice(6, 9)];
const DURATIONS = [22, 28, 25];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="postage-stamp w-full bg-cream-50 p-6 transition-transform duration-300 hover:-translate-y-1">
      <p className="font-[family-name:var(--font-serif-display)] italic text-maroon-900/90">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
          <Image src={review.avatar} alt={review.name} fill sizes="36px" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-maroon-900">{review.name}</p>
          <p className="text-xs text-maroon-900/60">{review.collection}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsColumn({
  reviews,
  duration,
  className,
}: {
  reviews: Review[];
  duration: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full max-w-xs shrink-0", className)}>
      <ul
        className="flex flex-col gap-6 [animation-play-state:running] hover:[animation-play-state:paused]"
        style={{ animation: `marquee-y ${duration}s linear infinite` }}
      >
        {[0, 1].map((rep) =>
          reviews.map((review, i) => (
            <li key={`${rep}-${i}`} aria-hidden={rep === 1}>
              <ReviewCard review={review} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-serif-display)] text-3xl italic text-maroon-500 sm:text-4xl">
          Trusted by Women Like You
        </h2>
        <p className="mt-2 text-sm text-maroon-900/60">
          Discover exquisite drapes shaped by tradition, artistry, and timeless beauty.
        </p>
      </div>

      <div className="relative mt-10 flex max-h-[640px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]">
        {COLUMNS.map((col, i) => (
          <TestimonialsColumn
            key={i}
            reviews={col}
            duration={DURATIONS[i]}
            className={i === 1 ? "hidden sm:block" : i === 2 ? "hidden lg:block" : undefined}
          />
        ))}
      </div>
    </section>
  );
}

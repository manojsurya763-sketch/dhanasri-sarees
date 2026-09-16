import { RatingStars } from "@/components/product/RatingStars";
import type { Review } from "@/lib/types";

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-maroon-900/50">No reviews yet — be the first to review this saree.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border border-maroon-500/10 bg-cream-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-maroon-900">{review.user.name ?? "Verified Buyer"}</p>
            <RatingStars rating={review.rating} />
          </div>
          {review.comment && <p className="mt-2 text-sm text-maroon-900/70">{review.comment}</p>}
        </div>
      ))}
    </div>
  );
}

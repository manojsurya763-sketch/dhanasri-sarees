import { Star } from "lucide-react";

export function RatingStars({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-maroon-900/70">
      <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
      <span className="font-medium">{rating.toFixed(1)}</span>
      {typeof reviewCount === "number" && <span>({reviewCount})</span>}
    </div>
  );
}

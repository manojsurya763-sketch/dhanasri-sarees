"use client";

import { useEffect, useState } from "react";
import { getReviewEngagement, getWishlistConversion, getWishlistTopProducts } from "@/lib/api";
import type { ReviewEngagement, WishlistConversion, WishlistTopProduct } from "@/lib/types";

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function EngagementDashboard() {
  const [topProducts, setTopProducts] = useState<WishlistTopProduct[] | null>(null);
  const [conversion, setConversion] = useState<WishlistConversion | null>(null);
  const [reviews, setReviews] = useState<ReviewEngagement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getWishlistTopProducts(), getWishlistConversion(), getReviewEngagement("")])
      .then(([tp, conv, rev]) => {
        setTopProducts(tp.items);
        setConversion(conv);
        setReviews(rev);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load engagement data"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!topProducts || !conversion || !reviews) return <p className="text-sm text-slate-400">Loading…</p>;

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-3 text-sm font-semibold text-slate-700">Wishlist conversion</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Wishlisted (signed-in)" value={conversion.totalWishlisted} />
          <StatCard label="Converted to purchase" value={conversion.converted} />
          <StatCard label="Conversion rate" value={`${(conversion.conversionRate * 100).toFixed(0)}%`} />
        </div>
      </section>

      <section>
        <p className="mb-3 text-sm font-semibold text-slate-700">Top wishlisted products</p>
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Wishlisted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-4 text-center text-slate-400">
                    No wishlist activity yet.
                  </td>
                </tr>
              ) : (
                topProducts.map((row) => (
                  <tr key={row.productId}>
                    <td className="px-4 py-2 text-slate-800">{row.title}</td>
                    <td className="px-4 py-2 text-slate-600">{row.wishlistCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <p className="mb-3 text-sm font-semibold text-slate-700">Review engagement (last 30 days)</p>
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Total reviews" value={reviews.totalReviews} />
          <StatCard label="Average rating" value={reviews.avgRating.toFixed(1)} />
        </div>
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Reviews</th>
                <th className="px-4 py-2">Avg rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.days.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-slate-400">
                    No reviews in this period.
                  </td>
                </tr>
              ) : (
                reviews.days.map((day) => (
                  <tr key={day.date}>
                    <td className="px-4 py-2 text-slate-700">{day.date}</td>
                    <td className="px-4 py-2 text-slate-600">{day.count}</td>
                    <td className="px-4 py-2 text-slate-600">{day.avgRating.toFixed(1)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import type { Request, Response } from "express";
import { dateRangeQuerySchema } from "@/modules/engagement/engagement.schema";
import {
  findProductTitles,
  findPurchasedPairsForUsers,
  findReviewsInRange,
  findWishlistedPairsWithUser,
  findWishlistProductCounts,
} from "@/modules/engagement/engagement.repo";

const DEFAULT_RANGE_DAYS = 30;

function resolveRange(dateFrom?: Date, dateTo?: Date) {
  const to = dateTo ?? new Date();
  const from = dateFrom ?? new Date(to.getTime() - DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000);
  return { from, to };
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getWishlistTopProducts(_req: Request, res: Response) {
  const groups = await findWishlistProductCounts();
  const products = await findProductTitles(groups.map((g) => g.productId));
  const titleById = new Map(products.map((p) => [p.id, p.title]));

  const items = groups
    .map((g) => ({
      productId: g.productId,
      title: titleById.get(g.productId) ?? "Unknown product",
      wishlistCount: g._count._all,
    }))
    .sort((a, b) => b.wishlistCount - a.wishlistCount)
    .slice(0, 10);

  res.json({ items });
}

export async function getWishlistConversion(_req: Request, res: Response) {
  const pairs = await findWishlistedPairsWithUser();
  const userIds = [...new Set(pairs.map((p) => p.userId!))];
  const purchases = await findPurchasedPairsForUsers(userIds);

  const purchasedSet = new Set(purchases.map((p) => `${p.order.userId}:${p.productId}`));

  const totalWishlisted = pairs.length;
  const converted = pairs.filter((p) => purchasedSet.has(`${p.userId}:${p.productId}`)).length;
  const conversionRate = totalWishlisted === 0 ? 0 : converted / totalWishlisted;

  res.json({ totalWishlisted, converted, conversionRate });
}

export async function getReviewEngagement(req: Request, res: Response) {
  const { dateFrom, dateTo } = dateRangeQuerySchema.parse(req.query);
  const { from, to } = resolveRange(dateFrom, dateTo);

  const reviews = await findReviewsInRange(from, to);

  const byDay = new Map<string, { count: number; ratingSum: number }>();
  let ratingSum = 0;
  for (const review of reviews) {
    const key = dayKey(review.createdAt);
    const bucket = byDay.get(key) ?? { count: 0, ratingSum: 0 };
    bucket.count += 1;
    bucket.ratingSum += review.rating;
    byDay.set(key, bucket);
    ratingSum += review.rating;
  }

  const days = Array.from(byDay.entries())
    .map(([date, v]) => ({ date, count: v.count, avgRating: v.ratingSum / v.count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  res.json({
    dateFrom: from.toISOString(),
    dateTo: to.toISOString(),
    totalReviews: reviews.length,
    avgRating: reviews.length === 0 ? 0 : ratingSum / reviews.length,
    days,
  });
}

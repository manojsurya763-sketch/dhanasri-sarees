import { prisma } from "@/config/db";

export function findWishlistProductCounts() {
  return prisma.wishlistItem.groupBy({ by: ["productId"], _count: { _all: true } });
}

export function findProductTitles(productIds: string[]) {
  return prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, title: true } });
}

// Guest wishlist items (no userId) can't be linked to an order — only
// signed-in customers' wishlists count toward conversion.
export function findWishlistedPairsWithUser() {
  return prisma.wishlistItem.findMany({
    where: { userId: { not: null } },
    select: { userId: true, productId: true },
  });
}

export function findPurchasedPairsForUsers(userIds: string[]) {
  return prisma.orderItem.findMany({
    where: { order: { userId: { in: userIds } } },
    select: { productId: true, order: { select: { userId: true } } },
  });
}

export function findReviewsInRange(from: Date, to: Date) {
  return prisma.review.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: { rating: true, createdAt: true },
  });
}

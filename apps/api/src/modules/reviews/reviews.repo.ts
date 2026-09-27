import type { Prisma } from "@prisma/client";
import { prisma } from "@/config/db";
import type { AdminListReviewsQuery } from "@/modules/reviews/reviews.schema";

function buildWhere(query: AdminListReviewsQuery): Prisma.ReviewWhereInput {
  return {
    ...(query.productId && { productId: query.productId }),
    ...(query.minRating && { rating: { gte: query.minRating } }),
  };
}

export async function findReviewsAdmin(query: AdminListReviewsQuery) {
  const where = buildWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        product: { select: { title: true, slug: true } },
        user: { select: { phone: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.review.count({ where }),
  ]);

  return { items, total };
}

export function findReviewByIdAdmin(id: string) {
  return prisma.review.findUnique({ where: { id } });
}

export function setReviewResponse(id: string, staffResponse: string, respondedByStaffId: string) {
  return prisma.review.update({
    where: { id },
    data: { staffResponse, staffResponseAt: new Date(), respondedByStaffId },
  });
}

export function setReviewVisibility(id: string, isHidden: boolean) {
  return prisma.review.update({ where: { id }, data: { isHidden } });
}

import type { Prisma } from "@prisma/client";
import { prisma } from "@/config/db";
import type { ListProductsQuery } from "@/modules/products/products.schema";

const SORT_MAP: Record<NonNullable<ListProductsQuery["sort"]>, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  rating: { rating: "desc" },
};

export async function findProducts(query: ListProductsQuery) {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (query.section === "new-arrivals") where.isNewArrival = true;
  if (query.section === "featured") where.isFeatured = true;
  if (query.category) where.category = { slug: query.category };
  if (query.occasion) where.occasionTag = query.occasion;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      ...(query.minPrice !== undefined && { gte: query.minPrice }),
      ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
    };
  }

  const orderBy = query.sort ? SORT_MAP[query.sort] : { createdAt: "desc" as const };
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: query.limit }),
    prisma.product.count({ where }),
  ]);

  return { items, total };
}

export function findProductBySlug(slug: string) {
  return prisma.product.findFirst({ where: { slug, isActive: true } });
}

export function findRelatedProducts(productId: string, categoryId: string | null, limit: number) {
  return prisma.product.findMany({
    where: {
      id: { not: productId },
      isActive: true,
      ...(categoryId && { categoryId }),
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function findProductReviews(productId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { productId } }),
  ]);
  return { items, total };
}

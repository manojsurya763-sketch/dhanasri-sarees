import type { Prisma } from "@prisma/client";
import { prisma } from "@/config/db";
import {
  DISCOUNT_BUCKETS,
  LOW_STOCK_THRESHOLD,
  type AdminListProductsQuery,
  type CreateProductInput,
  type FacetsQuery,
  type ListProductsQuery,
  type UpdateProductInput,
} from "@/modules/products/products.schema";

const SORT_MAP: Record<NonNullable<ListProductsQuery["sort"]>, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  rating: { rating: "desc" },
};

function buildWhere(query: ListProductsQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (query.section === "new-arrivals") where.isNewArrival = true;
  if (query.section === "featured") where.isFeatured = true;
  if (query.category) where.category = { slug: query.category };
  if (query.occasion?.length) where.occasionTag = { in: query.occasion };
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      ...(query.minPrice !== undefined && { gte: query.minPrice }),
      ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
    };
  }
  if (query.fabric?.length) where.fabric = { in: query.fabric };
  if (query.colour?.length) where.colour = { in: query.colour };
  if (query.origin?.length) where.origin = { in: query.origin };
  if (query.zari?.length) where.zari = { in: query.zari };
  if (query.loom?.length) where.loom = { in: query.loom };
  if (query.blouseType?.length) where.blouseTypes = { hasSome: query.blouseType };
  if (query.intlShipping) where.internationalShipping = query.intlShipping === "true";
  if (query.discount?.length) {
    const ranges = DISCOUNT_BUCKETS.filter((b) => query.discount!.includes(b.label));
    if (ranges.length) {
      where.OR = ranges.map((r) => ({ discountPct: { gte: r.min, lte: r.max } }));
    }
  }

  return where;
}

export async function findProducts(query: ListProductsQuery) {
  const where = buildWhere(query);
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
  const where = { productId, isHidden: false };
  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: { user: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);
  return { items, total };
}

function countBy(
  field: "fabric" | "colour" | "origin" | "zari" | "loom" | "occasionTag",
  where: Prisma.ProductWhereInput
) {
  return prisma.product
    .groupBy({
      by: [field],
      where: { ...where, [field]: { not: null } },
      _count: { _all: true },
    })
    .then((rows) =>
      rows
        .map((r) => ({ value: r[field] as string, count: r._count._all }))
        .sort((a, b) => b.count - a.count)
    );
}

const ADMIN_SORT_MAP: Record<AdminListProductsQuery["sort"], Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  stock_asc: { stock: "asc" },
};

function buildAdminWhere(query: AdminListProductsQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (query.isActive !== undefined) where.isActive = query.isActive === "true";
  if (query.category) where.category = { slug: query.category };
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { sku: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.stockStatus === "out_of_stock") where.stock = 0;
  else if (query.stockStatus === "low_stock") where.stock = { gt: 0, lte: LOW_STOCK_THRESHOLD };
  else if (query.stockStatus === "in_stock") where.stock = { gt: LOW_STOCK_THRESHOLD };

  return where;
}

export async function findProductsAdmin(query: AdminListProductsQuery) {
  const where = buildAdminWhere(query);
  const orderBy = ADMIN_SORT_MAP[query.sort];
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: query.limit }),
    prisma.product.count({ where }),
  ]);

  return { items, total };
}

export function findProductByIdAdmin(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export function createProductRecord(data: CreateProductInput & { slug: string }) {
  return prisma.product.create({ data });
}

export function updateProductRecord(id: string, data: UpdateProductInput) {
  return prisma.product.update({ where: { id }, data });
}

export async function findProductBySlugAdmin(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function findProductFacets(query: FacetsQuery) {
  const where: Prisma.ProductWhereInput = { isActive: true };
  if (query.category) where.category = { slug: query.category };
  if (query.occasion?.length) where.occasionTag = { in: query.occasion };

  const [fabric, colour, origin, zari, loom, occasion, priceAgg, blouseRows, intlTrueCount, discountCounts] =
    await Promise.all([
      countBy("fabric", where),
      countBy("colour", where),
      countBy("origin", where),
      countBy("zari", where),
      countBy("loom", where),
      countBy("occasionTag", where),
      prisma.product.aggregate({ where, _min: { price: true }, _max: { price: true } }),
      prisma.product.findMany({ where, select: { blouseTypes: true } }),
      prisma.product.count({ where: { ...where, internationalShipping: true } }),
      Promise.all(
        DISCOUNT_BUCKETS.map((b) =>
          prisma.product
            .count({ where: { ...where, discountPct: { gte: b.min, lte: b.max } } })
            .then((count) => ({ label: b.label, count }))
        )
      ),
    ]);

  const blouseTally = new Map<string, number>();
  for (const row of blouseRows) {
    for (const type of row.blouseTypes) {
      blouseTally.set(type, (blouseTally.get(type) ?? 0) + 1);
    }
  }

  return {
    fabric,
    colour,
    origin,
    zari,
    loom,
    occasion,
    blouseType: Array.from(blouseTally.entries()).map(([value, count]) => ({ value, count })),
    discount: discountCounts,
    internationalShippingCount: intlTrueCount,
    priceRange: {
      min: Number(priceAgg._min.price ?? 0),
      max: Number(priceAgg._max.price ?? 0),
    },
  };
}

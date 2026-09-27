import { prisma } from "@/config/db";

export function findCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function findAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

import { prisma } from "@/config/db";
import type { AdminListCouponsQuery, CreateCouponInput, UpdateCouponInput } from "@/modules/coupons/coupons.schema";

export function findCouponByCode(code: string) {
  return prisma.coupon.findFirst({ where: { code: code.trim().toUpperCase(), isActive: true } });
}

export async function findCouponsAdmin(query: AdminListCouponsQuery) {
  const where = query.isActive !== undefined ? { isActive: query.isActive === "true" } : {};
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    prisma.coupon.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: query.limit }),
    prisma.coupon.count({ where }),
  ]);

  return { items, total };
}

export function findCouponByIdAdmin(id: string) {
  return prisma.coupon.findUnique({ where: { id } });
}

export function createCouponRecord(data: CreateCouponInput) {
  return prisma.coupon.create({ data: { ...data, code: data.code.trim().toUpperCase() } });
}

export function updateCouponRecord(id: string, data: UpdateCouponInput) {
  return prisma.coupon.update({
    where: { id },
    data: { ...data, ...(data.code && { code: data.code.trim().toUpperCase() }) },
  });
}

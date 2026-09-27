import type { Prisma } from "@prisma/client";
import { prisma } from "@/config/db";
import type { AdminListCustomersQuery, UpdateCustomerInput } from "@/modules/customers/customers.schema";

function buildWhere(query: AdminListCustomersQuery): Prisma.UserWhereInput {
  if (!query.search) return {};
  return {
    OR: [
      { phone: { contains: query.search, mode: "insensitive" } },
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
    ],
  };
}

export async function findCustomersAdmin(query: AdminListCustomersQuery) {
  const where = buildWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}

export function findCustomerByIdAdmin(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, select: { id: true, status: true, totalAmount: true, createdAt: true } },
      _count: { select: { reviews: true, wishlist: true } },
    },
  });
}

export function updateCustomerRecord(id: string, data: UpdateCustomerInput) {
  return prisma.user.update({ where: { id }, data });
}

export function setCustomerActive(id: string, isActive: boolean) {
  return prisma.user.update({ where: { id }, data: { isActive } });
}

export async function getCustomerSpendSummary(id: string) {
  const [orderCount, agg, lastOrder] = await Promise.all([
    prisma.order.count({ where: { userId: id, status: { in: ["paid", "shipped", "delivered"] } } }),
    prisma.order.aggregate({
      where: { userId: id, status: { in: ["paid", "shipped", "delivered"] } },
      _sum: { totalAmount: true },
    }),
    prisma.order.findFirst({ where: { userId: id }, orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
  ]);

  const lifetimeValue = Number(agg._sum.totalAmount ?? 0);
  return {
    lifetimeValue,
    avgOrderValue: orderCount > 0 ? lifetimeValue / orderCount : 0,
    orderCount,
    lastOrderAt: lastOrder?.createdAt ?? null,
  };
}

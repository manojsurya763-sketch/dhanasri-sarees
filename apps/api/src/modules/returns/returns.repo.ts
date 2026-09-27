import type { Prisma } from "@prisma/client";
import { prisma } from "@/config/db";
import type { AdminListReturnsQuery } from "@/modules/returns/returns.schema";

export async function findReturnsAdmin(query: AdminListReturnsQuery) {
  const where: Prisma.ReturnWhereInput = query.status ? { status: query.status } : {};
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    prisma.return.findMany({
      where,
      include: {
        order: { select: { id: true } },
        user: { select: { phone: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.return.count({ where }),
  ]);

  return { items, total };
}

export function findReturnByIdAdmin(id: string) {
  return prisma.return.findUnique({
    where: { id },
    include: {
      order: { select: { id: true, status: true } },
      orderItem: { include: { product: { select: { title: true, images: true } } } },
      user: { select: { id: true, phone: true, name: true } },
      processedByStaff: { select: { id: true, name: true, email: true } },
      approvedByStaff: { select: { id: true, name: true, email: true } },
    },
  });
}

export function findOrderForReturn(orderId: string) {
  return prisma.order.findUnique({ where: { id: orderId } });
}

export function createReturnRecord(data: {
  orderId: string;
  orderItemId?: string | null;
  userId: string;
  qty: number;
  reason: string;
}) {
  return prisma.return.create({ data });
}

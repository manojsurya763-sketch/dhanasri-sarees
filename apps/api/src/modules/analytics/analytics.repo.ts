import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/config/db";

// Revenue counts money actually captured and not since returned — same
// convention as admin.controller.ts's dashboard stats.
const REVENUE_STATUSES: OrderStatus[] = ["paid", "shipped", "delivered"];

export function findRevenueOrdersInRange(from: Date, to: Date) {
  return prisma.order.findMany({
    where: { status: { in: REVENUE_STATUSES }, createdAt: { gte: from, lte: to } },
    select: { totalAmount: true, createdAt: true },
  });
}

export function findRevenueOrderItemsInRange(from: Date, to: Date) {
  return prisma.orderItem.findMany({
    where: { order: { status: { in: REVENUE_STATUSES }, createdAt: { gte: from, lte: to } } },
    select: { productId: true, qty: true, priceAtPurchase: true, product: { select: { title: true } } },
  });
}

export function groupRevenueOrdersByCustomer() {
  return prisma.order.groupBy({
    by: ["userId"],
    where: { status: { in: REVENUE_STATUSES } },
    _count: { _all: true },
  });
}

export function countRevenueOrdersInRange(from: Date, to: Date) {
  return prisma.order.count({ where: { status: { in: REVENUE_STATUSES }, createdAt: { gte: from, lte: to } } });
}

export function countReturnsInRange(from: Date, to: Date) {
  return prisma.return.count({ where: { createdAt: { gte: from, lte: to } } });
}

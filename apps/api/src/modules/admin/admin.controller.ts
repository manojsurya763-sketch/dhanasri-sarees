import type { Request, Response } from "express";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/config/db";
import { LOW_STOCK_THRESHOLD } from "@/modules/products/products.schema";

export function getMe(req: Request, res: Response) {
  res.json({ id: req.staff!.id, email: req.staff!.email, role: req.staff!.role });
}

const ALL_STATUSES: OrderStatus[] = ["created", "paid", "failed", "shipped", "delivered", "cancelled", "refunded"];
// Revenue counts money actually captured and not since returned — excludes
// created/failed (never paid) and refunded (paid back out).
const REVENUE_STATUSES: OrderStatus[] = ["paid", "shipped", "delivered"];

export async function getDashboardStats(_req: Request, res: Response) {
  const [totalProducts, activeProducts, lowStock, outOfStock, statusGroups, revenue, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true, stock: { gt: 0, lte: LOW_STOCK_THRESHOLD } } }),
      prisma.product.count({ where: { isActive: true, stock: 0 } }),
      prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.order.aggregate({ where: { status: { in: REVENUE_STATUSES } }, _sum: { totalAmount: true } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { phone: true, name: true } } },
      }),
    ]);

  const ordersByStatus = Object.fromEntries(ALL_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
  for (const row of statusGroups) ordersByStatus[row.status] = row._count._all;

  res.json({
    products: {
      total: totalProducts,
      active: activeProducts,
      inactive: totalProducts - activeProducts,
      lowStock,
      outOfStock,
    },
    ordersByStatus,
    revenue: Number(revenue._sum.totalAmount ?? 0),
    recentOrders,
  });
}

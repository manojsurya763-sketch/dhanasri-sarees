import type { Request, Response } from "express";
import type { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/config/db";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import { adminListOrdersQuerySchema, updateOrderStatusSchema } from "@/modules/orders/orders.schema";

// current status -> allowed target statuses. Cancel/refund move money, so
// they're Super-Admin-only — mirrors returns.controller.ts's
// STAFF_ALLOWED/SUPER_ADMIN_ALLOWED split.
const STAFF_ALLOWED: Record<string, OrderStatus[]> = {
  paid: ["shipped"],
  shipped: ["delivered"],
};
const SUPER_ADMIN_ALLOWED: Record<string, OrderStatus[]> = {
  created: ["cancelled"],
  paid: ["shipped", "cancelled", "refunded"],
  shipped: ["delivered"],
};

const ALL_STATUSES: OrderStatus[] = ["created", "paid", "failed", "shipped", "delivered", "cancelled", "refunded"];
// Same convention as admin.controller.ts's dashboard stats.
const REVENUE_STATUSES: OrderStatus[] = ["paid", "shipped", "delivered"];

export async function listOrdersAdmin(req: Request, res: Response) {
  const query = adminListOrdersQuerySchema.parse(req.query);

  const where: Prisma.OrderWhereInput = {
    ...(query.status && { status: query.status }),
    ...(query.phone && { user: { phone: { contains: query.phone } } }),
    ...((query.dateFrom || query.dateTo) && {
      createdAt: {
        ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
        ...(query.dateTo && { lte: new Date(query.dateTo) }),
      },
    }),
  };

  // Stat cards / status tabs always reflect the phone/date filters (so a
  // search narrows the counts too) but never the active status tab itself.
  const { status: _ignoredStatus, ...statsWhere } = where;

  const skip = (query.page - 1) * query.limit;
  const [items, total, statusGroups, revenue, returnsCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { phone: true, name: true } },
        items: { take: 1, include: { product: { select: { title: true, images: true } } } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ["status"],
      where: statsWhere,
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: { ...statsWhere, status: { in: REVENUE_STATUSES } },
      _sum: { totalAmount: true },
    }),
    prisma.return.count({ where: { order: statsWhere } }),
  ]);

  const statusCounts = Object.fromEntries(ALL_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
  for (const row of statusGroups) statusCounts[row.status] = row._count._all;

  res.json({
    items,
    pagination: { total, page: query.page, pageSize: query.limit },
    stats: {
      totalOrders: ALL_STATUSES.reduce((sum, s) => sum + statusCounts[s], 0),
      statusCounts,
      totalRevenue: Number(revenue._sum.totalAmount ?? 0),
      returnsCount,
    },
  });
}

export async function getOrderAdmin(req: Request, res: Response) {
  const order = await prisma.order.findUnique({
    where: { id: param(req.params.id) },
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, phone: true, name: true, email: true } },
      history: {
        orderBy: { createdAt: "desc" },
        include: { changedByStaff: { select: { name: true, email: true } } },
      },
      returns: {
        orderBy: { createdAt: "desc" },
        include: { orderItem: { include: { product: { select: { title: true } } } } },
      },
    },
  });
  if (!order) throw new ApiError(404, "Order not found");
  res.json(order);
}

export async function updateOrderStatus(req: Request, res: Response) {
  const id = param(req.params.id);
  const { status: target, trackingNumber, carrier } = updateOrderStatusSchema.parse(req.body);

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new ApiError(404, "Order not found");

  const isSuperAdmin = req.staff!.role === "super_admin";
  const allowed = (isSuperAdmin ? SUPER_ADMIN_ALLOWED : STAFF_ALLOWED)[order.status] ?? [];
  if (!allowed.includes(target)) {
    throw new ApiError(400, `Cannot move order from "${order.status}" to "${target}"`);
  }

  const restockingCancel = order.status === "paid" && (target === "cancelled" || target === "refunded");

  const updated = await prisma.$transaction(async (tx) => {
    if (restockingCancel) {
      const items = await tx.orderItem.findMany({ where: { orderId: id } });
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.qty } },
        });
      }
    }

    await tx.orderStatusHistory.create({
      data: {
        orderId: id,
        fromStatus: order.status,
        toStatus: target,
        changedByStaffId: req.staff!.id,
      },
    });

    return tx.order.update({
      where: { id },
      data: {
        status: target,
        ...(target === "shipped" && { trackingNumber, carrier }),
      },
    });
  });

  res.json(updated);
}

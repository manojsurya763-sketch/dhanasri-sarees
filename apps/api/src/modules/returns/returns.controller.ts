import type { Request, Response } from "express";
import type { ReturnStatus } from "@prisma/client";
import { prisma } from "@/config/db";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import {
  adminListReturnsQuerySchema,
  createReturnSchema,
  updateReturnStatusSchema,
} from "@/modules/returns/returns.schema";
import { createReturnRecord, findOrderForReturn, findReturnByIdAdmin, findReturnsAdmin } from "@/modules/returns/returns.repo";

// current status -> allowed target statuses. Admin/Employee can only move a
// return into "processing"; only Super Admin can reach "approved"/"rejected"
// — mirrors orders.admin.controller.ts's ALLOWED_TRANSITIONS pattern.
const STAFF_ALLOWED: Record<string, ReturnStatus[]> = {
  requested: ["processing"],
};
const SUPER_ADMIN_ALLOWED: Record<string, ReturnStatus[]> = {
  requested: ["processing", "approved", "rejected"],
  processing: ["approved", "rejected"],
};

function stripAmount<T extends { refundAmount: unknown }>(row: T, isEmployee: boolean) {
  if (!isEmployee) return row;
  const { refundAmount: _refundAmount, ...rest } = row;
  return rest;
}

export async function listReturnsAdmin(req: Request, res: Response) {
  const query = adminListReturnsQuerySchema.parse(req.query);
  const { items, total } = await findReturnsAdmin(query);
  const isEmployee = req.staff!.role === "employee";

  res.json({
    items: items.map((r) => stripAmount(r, isEmployee)),
    pagination: { total, page: query.page, pageSize: query.limit },
  });
}

export async function getReturnAdmin(req: Request, res: Response) {
  const ret = await findReturnByIdAdmin(param(req.params.id));
  if (!ret) throw new ApiError(404, "Return not found");

  const isEmployee = req.staff!.role === "employee";
  res.json(stripAmount(ret, isEmployee));
}

export async function createReturn(req: Request, res: Response) {
  const data = createReturnSchema.parse(req.body);

  const order = await findOrderForReturn(data.orderId);
  if (!order) throw new ApiError(404, "Order not found");

  const ret = await createReturnRecord({
    orderId: data.orderId,
    orderItemId: data.orderItemId ?? null,
    userId: order.userId,
    qty: data.qty,
    reason: data.reason,
  });
  res.status(201).json(ret);
}

export async function updateReturnStatus(req: Request, res: Response) {
  const id = param(req.params.id);
  const { status: target, refundAmount } = updateReturnStatusSchema.parse(req.body);

  const ret = await findReturnByIdAdmin(id);
  if (!ret) throw new ApiError(404, "Return not found");

  const isSuperAdmin = req.staff!.role === "super_admin";
  const allowed = (isSuperAdmin ? SUPER_ADMIN_ALLOWED : STAFF_ALLOWED)[ret.status] ?? [];
  if (!allowed.includes(target)) {
    throw new ApiError(400, `Cannot move return from "${ret.status}" to "${target}"`);
  }

  if (target === "processing") {
    const updated = await prisma.return.update({
      where: { id },
      data: { status: "processing", processedByStaffId: req.staff!.id },
    });
    return res.json(updated);
  }

  if (target === "rejected") {
    const updated = await prisma.return.update({
      where: { id },
      data: { status: "rejected", approvedByStaffId: req.staff!.id },
    });
    return res.json(updated);
  }

  // target === "approved"
  if (refundAmount === undefined) throw new ApiError(400, "refundAmount is required to approve a return");

  const updated = await prisma.$transaction(async (tx) => {
    if (ret.orderItemId) {
      const item = await tx.orderItem.findUnique({ where: { id: ret.orderItemId } });
      if (item) await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: ret.qty } } });
    } else {
      const items = await tx.orderItem.findMany({ where: { orderId: ret.orderId } });
      for (const item of items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.qty } } });
      }
      await tx.order.update({ where: { id: ret.orderId }, data: { status: "refunded" } });
    }

    return tx.return.update({
      where: { id },
      data: { status: "approved", refundAmount, approvedByStaffId: req.staff!.id },
    });
  });

  res.json(updated);
}

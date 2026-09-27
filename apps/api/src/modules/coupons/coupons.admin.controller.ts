import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import { adminListCouponsQuerySchema, createCouponSchema, updateCouponSchema } from "@/modules/coupons/coupons.schema";
import {
  createCouponRecord,
  findCouponByIdAdmin,
  findCouponsAdmin,
  updateCouponRecord,
} from "@/modules/coupons/coupons.repo";

function handleUniqueConstraint(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    throw new ApiError(409, "A coupon with this code already exists");
  }
  throw err;
}

export async function listCouponsAdmin(req: Request, res: Response) {
  const query = adminListCouponsQuerySchema.parse(req.query);
  const { items, total } = await findCouponsAdmin(query);

  res.json({ items, pagination: { total, page: query.page, pageSize: query.limit } });
}

export async function getCouponAdmin(req: Request, res: Response) {
  const coupon = await findCouponByIdAdmin(param(req.params.id));
  if (!coupon) throw new ApiError(404, "Coupon not found");
  res.json(coupon);
}

export async function createCoupon(req: Request, res: Response) {
  const data = createCouponSchema.parse(req.body);
  const coupon = await createCouponRecord(data).catch(handleUniqueConstraint);
  res.status(201).json(coupon);
}

export async function updateCoupon(req: Request, res: Response) {
  const id = param(req.params.id);
  const data = updateCouponSchema.parse(req.body);

  const existing = await findCouponByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Coupon not found");

  const coupon = await updateCouponRecord(id, data).catch(handleUniqueConstraint);
  res.json(coupon);
}

export async function deleteCoupon(req: Request, res: Response) {
  const id = param(req.params.id);

  const existing = await findCouponByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Coupon not found");

  const coupon = await updateCouponRecord(id, { isActive: false });
  res.json(coupon);
}

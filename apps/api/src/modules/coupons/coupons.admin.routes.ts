import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getCouponAdmin,
  listCouponsAdmin,
  updateCoupon,
} from "@/modules/coupons/coupons.admin.controller";

export const couponsAdminRouter = Router();

couponsAdminRouter.get("/", listCouponsAdmin);
couponsAdminRouter.get("/:id", getCouponAdmin);
couponsAdminRouter.post("/", createCoupon);
couponsAdminRouter.patch("/:id", updateCoupon);
couponsAdminRouter.delete("/:id", deleteCoupon);

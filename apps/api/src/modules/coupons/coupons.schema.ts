import { z } from "zod";

export const adminListCouponsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isActive: z.enum(["true", "false"]).optional(),
});

export type AdminListCouponsQuery = z.infer<typeof adminListCouponsQuerySchema>;

export const createCouponSchema = z.object({
  code: z.string().min(1),
  pctOff: z.coerce.number().int().min(1).max(100),
  maxOff: z.coerce.number().positive(),
  minPurchase: z.coerce.number().nonnegative(),
  isActive: z.boolean().default(true),
  usageLimit: z.coerce.number().int().min(1).nullable().optional(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

export const updateCouponSchema = createCouponSchema.partial();

export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;

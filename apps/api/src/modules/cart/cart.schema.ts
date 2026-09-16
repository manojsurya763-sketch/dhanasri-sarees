import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().uuid(),
  qty: z.coerce.number().int().min(1).max(10).default(1),
});

export const updateCartItemSchema = z.object({
  qty: z.coerce.number().int().min(1).max(10),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1),
});

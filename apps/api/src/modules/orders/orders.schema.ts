import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        qty: z.number().int().min(1).max(20),
      })
    )
    .min(1),
  couponCode: z.string().trim().min(1).optional(),
});

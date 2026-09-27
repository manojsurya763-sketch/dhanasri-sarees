import { z } from "zod";

export const ADMIN_ORDER_STATUSES = ["created", "paid", "failed", "shipped", "delivered", "cancelled", "refunded"] as const;

export const adminListOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(ADMIN_ORDER_STATUSES).optional(),
  phone: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export type AdminListOrdersQuery = z.infer<typeof adminListOrdersQuerySchema>;

// Admins can only move orders into these — "created"/"paid"/"failed" stay
// exclusively controlled by the Razorpay webhook (modules/webhooks/razorpay.controller.ts).
// trackingNumber/carrier are only persisted when status === "shipped".
export const updateOrderStatusSchema = z.object({
  status: z.enum(["shipped", "delivered", "cancelled", "refunded"]),
  trackingNumber: z.string().trim().min(1).optional(),
  carrier: z.string().trim().min(1).optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export const listMyOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type ListMyOrdersQuery = z.infer<typeof listMyOrdersQuerySchema>;

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

import { z } from "zod";

export const ADMIN_RETURN_STATUSES = ["requested", "processing", "approved", "rejected"] as const;

export const adminListReturnsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(ADMIN_RETURN_STATUSES).optional(),
});

export type AdminListReturnsQuery = z.infer<typeof adminListReturnsQuerySchema>;

export const createReturnSchema = z.object({
  orderId: z.string().uuid(),
  orderItemId: z.string().uuid().nullable().optional(),
  qty: z.coerce.number().int().min(1).default(1),
  reason: z.string().min(1),
});

export type CreateReturnInput = z.infer<typeof createReturnSchema>;

// Staff (admin/employee) can only move a return into "processing". Only
// Super Admin can reach "approved"/"rejected" — see returns.controller.ts.
export const updateReturnStatusSchema = z.object({
  status: z.enum(["processing", "approved", "rejected"]),
  refundAmount: z.coerce.number().positive().optional(),
});

export type UpdateReturnStatusInput = z.infer<typeof updateReturnStatusSchema>;

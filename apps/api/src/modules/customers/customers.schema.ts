import { z } from "zod";

export const adminListCustomersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export type AdminListCustomersQuery = z.infer<typeof adminListCustomersQuerySchema>;

export const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().nullable().optional(),
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

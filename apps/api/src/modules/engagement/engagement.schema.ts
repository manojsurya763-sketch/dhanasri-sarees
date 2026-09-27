import { z } from "zod";

export const dateRangeQuerySchema = z.object({
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;

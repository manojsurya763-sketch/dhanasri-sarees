import { z } from "zod";

export const listProductsQuerySchema = z.object({
  section: z.enum(["new-arrivals", "featured"]).optional(),
  category: z.string().optional(),
  occasion: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

export const relatedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(24).default(8),
});

export const reviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

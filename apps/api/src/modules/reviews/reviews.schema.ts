import { z } from "zod";

export const adminListReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  productId: z.string().uuid().optional(),
  minRating: z.coerce.number().int().min(1).max(5).optional(),
});

export type AdminListReviewsQuery = z.infer<typeof adminListReviewsQuerySchema>;

export const respondToReviewSchema = z.object({
  staffResponse: z.string().min(1),
});

export type RespondToReviewInput = z.infer<typeof respondToReviewSchema>;

export const setReviewVisibilitySchema = z.object({
  isHidden: z.boolean(),
});

export type SetReviewVisibilityInput = z.infer<typeof setReviewVisibilitySchema>;

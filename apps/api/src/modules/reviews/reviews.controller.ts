import type { Request, Response } from "express";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import {
  adminListReviewsQuerySchema,
  respondToReviewSchema,
  setReviewVisibilitySchema,
} from "@/modules/reviews/reviews.schema";
import { findReviewByIdAdmin, findReviewsAdmin, setReviewResponse, setReviewVisibility } from "@/modules/reviews/reviews.repo";

export async function listReviewsAdmin(req: Request, res: Response) {
  const query = adminListReviewsQuerySchema.parse(req.query);
  const { items, total } = await findReviewsAdmin(query);

  res.json({ items, pagination: { total, page: query.page, pageSize: query.limit } });
}

export async function respondToReview(req: Request, res: Response) {
  const id = param(req.params.id);
  const { staffResponse } = respondToReviewSchema.parse(req.body);

  const existing = await findReviewByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Review not found");

  const review = await setReviewResponse(id, staffResponse, req.staff!.id);
  res.json(review);
}

export async function updateReviewVisibility(req: Request, res: Response) {
  const id = param(req.params.id);
  const { isHidden } = setReviewVisibilitySchema.parse(req.body);

  const existing = await findReviewByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Review not found");

  const review = await setReviewVisibility(id, isHidden);
  res.json(review);
}

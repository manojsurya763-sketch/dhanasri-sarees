import { Router } from "express";
import { requireSuperAdmin } from "@/middleware/auth.guard";
import { listReviewsAdmin, respondToReview, updateReviewVisibility } from "@/modules/reviews/reviews.controller";

export const reviewsAdminRouter = Router();

reviewsAdminRouter.get("/", listReviewsAdmin);
reviewsAdminRouter.patch("/:id/response", respondToReview);
reviewsAdminRouter.patch("/:id/visibility", requireSuperAdmin, updateReviewVisibility);

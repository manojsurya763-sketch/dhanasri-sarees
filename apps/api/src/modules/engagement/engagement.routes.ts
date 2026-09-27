import { Router } from "express";
import {
  getReviewEngagement,
  getWishlistConversion,
  getWishlistTopProducts,
} from "@/modules/engagement/engagement.controller";

export const engagementRouter = Router();

engagementRouter.get("/wishlist-top-products", getWishlistTopProducts);
engagementRouter.get("/wishlist-conversion", getWishlistConversion);
engagementRouter.get("/review-engagement", getReviewEngagement);

import { Router } from "express";
import {
  getProductBySlug,
  getProductReviews,
  getRelatedProducts,
  listProducts,
} from "@/modules/products/products.controller";

export const productsRouter = Router();

productsRouter.get("/", listProducts);
productsRouter.get("/:slug", getProductBySlug);
productsRouter.get("/:id/related", getRelatedProducts);
productsRouter.get("/:id/reviews", getProductReviews);

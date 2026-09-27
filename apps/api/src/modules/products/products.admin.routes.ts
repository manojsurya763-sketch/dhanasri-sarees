import { Router } from "express";
import { requireAdminOrAbove } from "@/middleware/auth.guard";
import {
  createProduct,
  deleteProduct,
  getProductAdmin,
  listProductsAdmin,
  updateProduct,
  updateProductStock,
} from "@/modules/products/products.admin.controller";

export const productsAdminRouter = Router();

productsAdminRouter.get("/", listProductsAdmin);
productsAdminRouter.get("/:id", getProductAdmin);
productsAdminRouter.post("/", requireAdminOrAbove, createProduct);
productsAdminRouter.patch("/:id", requireAdminOrAbove, updateProduct);
productsAdminRouter.patch("/:id/stock", updateProductStock);
productsAdminRouter.delete("/:id", requireAdminOrAbove, deleteProduct);

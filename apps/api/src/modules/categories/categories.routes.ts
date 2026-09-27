import { Router } from "express";
import { getCategoryBySlug, listCategories } from "@/modules/categories/categories.controller";

export const categoriesRouter = Router();

categoriesRouter.get("/", listCategories);
categoriesRouter.get("/:slug", getCategoryBySlug);

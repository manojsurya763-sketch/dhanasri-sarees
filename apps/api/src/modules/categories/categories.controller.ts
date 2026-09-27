import type { Request, Response } from "express";
import { param } from "@/lib/params";
import { findAllCategories, findCategoryBySlug } from "@/modules/categories/categories.repo";

export async function listCategories(_req: Request, res: Response) {
  const items = await findAllCategories();
  res.json({ items });
}

export async function getCategoryBySlug(req: Request, res: Response) {
  const category = await findCategoryBySlug(param(req.params.slug));
  if (!category) {
    res.status(404).json({ error: "Category not found" });
    return;
  }
  res.json(category);
}

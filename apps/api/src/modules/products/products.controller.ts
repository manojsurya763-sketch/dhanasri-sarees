import type { Request, Response } from "express";
import { prisma } from "@/config/db";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import {
  facetsQuerySchema,
  listProductsQuerySchema,
  relatedQuerySchema,
  reviewsQuerySchema,
} from "@/modules/products/products.schema";
import {
  findProductBySlug,
  findProductFacets,
  findProductReviews,
  findProducts,
  findRelatedProducts,
} from "@/modules/products/products.repo";

export async function listProducts(req: Request, res: Response) {
  const query = listProductsQuerySchema.parse(req.query);
  const { items, total } = await findProducts(query);

  res.json({
    items,
    pagination: { total, page: query.page, pageSize: query.limit },
  });
}

export async function getProductFacets(req: Request, res: Response) {
  const query = facetsQuerySchema.parse(req.query);
  const facets = await findProductFacets(query);
  res.json(facets);
}

export async function getProductBySlug(req: Request, res: Response) {
  const product = await findProductBySlug(param(req.params.slug));
  if (!product) throw new ApiError(404, "Product not found");
  res.json(product);
}

export async function getRelatedProducts(req: Request, res: Response) {
  const { limit } = relatedQuerySchema.parse(req.query);
  const product = await prisma.product.findUnique({ where: { id: param(req.params.id) } });
  if (!product) throw new ApiError(404, "Product not found");

  const related = await findRelatedProducts(product.id, product.categoryId, limit);
  res.json({ items: related });
}

export async function getProductReviews(req: Request, res: Response) {
  const { page, limit } = reviewsQuerySchema.parse(req.query);
  const { items, total } = await findProductReviews(param(req.params.id), page, limit);
  res.json({ items, pagination: { total, page, pageSize: limit } });
}

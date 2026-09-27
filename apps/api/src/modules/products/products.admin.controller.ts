import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { param } from "@/lib/params";
import { slugify } from "@/lib/slugify";
import { ApiError } from "@/middleware/error-handler";
import {
  adminListProductsQuerySchema,
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
} from "@/modules/products/products.schema";
import {
  createProductRecord,
  findProductByIdAdmin,
  findProductBySlugAdmin,
  findProductsAdmin,
  updateProductRecord,
} from "@/modules/products/products.repo";

async function uniqueSlugFrom(title: string): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;
  while (await findProductBySlugAdmin(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

function handleUniqueConstraint(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    throw new ApiError(409, "SKU or slug already exists");
  }
  throw err;
}

export async function listProductsAdmin(req: Request, res: Response) {
  const query = adminListProductsQuerySchema.parse(req.query);
  const { items, total } = await findProductsAdmin(query);

  res.json({
    items,
    pagination: { total, page: query.page, pageSize: query.limit },
  });
}

export async function getProductAdmin(req: Request, res: Response) {
  const product = await findProductByIdAdmin(param(req.params.id));
  if (!product) throw new ApiError(404, "Product not found");
  res.json(product);
}

export async function createProduct(req: Request, res: Response) {
  const data = createProductSchema.parse(req.body);
  const slug = data.slug ?? (await uniqueSlugFrom(data.title));

  const product = await createProductRecord({ ...data, slug }).catch(handleUniqueConstraint);
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const id = param(req.params.id);
  const data = updateProductSchema.parse(req.body);

  const existing = await findProductByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Product not found");

  const product = await updateProductRecord(id, data).catch(handleUniqueConstraint);
  res.json(product);
}

export async function updateProductStock(req: Request, res: Response) {
  const id = param(req.params.id);
  const { stock } = updateStockSchema.parse(req.body);

  const existing = await findProductByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Product not found");

  const product = await updateProductRecord(id, { stock });
  res.json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  const id = param(req.params.id);

  const existing = await findProductByIdAdmin(id);
  if (!existing) throw new ApiError(404, "Product not found");

  const product = await updateProductRecord(id, { isActive: false });
  res.json(product);
}

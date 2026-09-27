import { z } from "zod";

const csv = () => z.string().transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean));

export const listProductsQuerySchema = z.object({
  section: z.enum(["new-arrivals", "featured"]).optional(),
  category: z.string().optional(),
  occasion: csv().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  fabric: csv().optional(),
  colour: csv().optional(),
  origin: csv().optional(),
  zari: csv().optional(),
  loom: csv().optional(),
  blouseType: csv().optional(),
  discount: csv().optional(),
  intlShipping: z.enum(["true", "false"]).optional(),
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

export const facetsQuerySchema = z.object({
  category: z.string().optional(),
  occasion: csv().optional(),
});

export type FacetsQuery = z.infer<typeof facetsQuerySchema>;

export const relatedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(24).default(8),
});

export const reviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const DISCOUNT_BUCKETS = [
  { label: "20", min: 20, max: 39 },
  { label: "40", min: 40, max: 59 },
  { label: "60", min: 60, max: 64 },
  { label: "65", min: 65, max: 100 },
] as const;

export const LOW_STOCK_THRESHOLD = 5;

export const adminListProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  isActive: z.enum(["true", "false"]).optional(),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "stock_asc"]).default("newest"),
});

export type AdminListProductsQuery = z.infer<typeof adminListProductsQuerySchema>;

export const createProductSchema = z.object({
  title: z.string().min(1),
  sku: z.string().min(1),
  slug: z.string().min(1).optional(),
  categoryId: z.string().uuid().nullable().optional(),
  occasionTag: z.string().nullable().optional(),
  mrp: z.coerce.number().positive(),
  price: z.coerce.number().positive(),
  discountPct: z.coerce.number().int().min(0).max(100).default(0),
  description: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
  stock: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isActive: z.boolean().default(true),
  fabric: z.string().nullable().optional(),
  colour: z.string().nullable().optional(),
  origin: z.string().nullable().optional(),
  zari: z.string().nullable().optional(),
  loom: z.string().nullable().optional(),
  work: z.string().nullable().optional(),
  length: z.string().nullable().optional(),
  blouseTypes: z.array(z.string()).default([]),
  internationalShipping: z.boolean().default(true),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const updateStockSchema = z.object({
  stock: z.coerce.number().int().min(0),
});

export type UpdateStockInput = z.infer<typeof updateStockSchema>;

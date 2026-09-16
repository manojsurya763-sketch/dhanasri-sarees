import type { Request, Response } from "express";
import { prisma } from "@/config/db";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import { addWishlistItemSchema } from "@/modules/wishlist/wishlist.schema";

export async function listWishlist(req: Request, res: Response) {
  const items = await prisma.wishlistItem.findMany({
    where: { guestId: req.guestId },
    include: { product: true },
  });
  res.json({ items });
}

export async function addWishlistItem(req: Request, res: Response) {
  const { productId } = addWishlistItemSchema.parse(req.body);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");

  const item = await prisma.wishlistItem.upsert({
    where: { guestId_productId: { guestId: req.guestId, productId } },
    update: {},
    create: { guestId: req.guestId, productId },
    include: { product: true },
  });
  res.status(201).json(item);
}

export async function removeWishlistItem(req: Request, res: Response) {
  await prisma.wishlistItem.deleteMany({
    where: { id: param(req.params.id), guestId: req.guestId },
  });
  res.status(204).send();
}

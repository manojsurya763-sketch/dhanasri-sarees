import type { Request, Response } from "express";
import { prisma } from "@/config/db";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import { addCartItemSchema, applyCouponSchema, updateCartItemSchema } from "@/modules/cart/cart.schema";
import { addCartItem, getOrCreateCart, removeCartItem, updateCartItem } from "@/modules/cart/cart.repo";
import { findCouponByCode } from "@/modules/coupons/coupons.repo";
import { summarizeCart } from "@/modules/cart/cart.summary";

async function respondWithCart(res: Response, guestId: string, cart: Awaited<ReturnType<typeof getOrCreateCart>>) {
  const coupon = cart.couponCode ? await findCouponByCode(cart.couponCode) : null;
  res.json({ cart, summary: summarizeCart(cart, coupon) });
}

export async function getCart(req: Request, res: Response) {
  const cart = await getOrCreateCart(req.guestId);
  await respondWithCart(res, req.guestId, cart);
}

export async function addItem(req: Request, res: Response) {
  const { productId, qty } = addCartItemSchema.parse(req.body);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");

  const cart = await addCartItem(req.guestId, productId, qty);
  await respondWithCart(res, req.guestId, cart);
}

export async function updateItem(req: Request, res: Response) {
  const { qty } = updateCartItemSchema.parse(req.body);
  const cart = await updateCartItem(req.guestId, param(req.params.id), qty);
  await respondWithCart(res, req.guestId, cart);
}

export async function removeItem(req: Request, res: Response) {
  const cart = await removeCartItem(req.guestId, param(req.params.id));
  await respondWithCart(res, req.guestId, cart);
}

export async function applyCoupon(req: Request, res: Response) {
  const { code } = applyCouponSchema.parse(req.body);
  const coupon = await findCouponByCode(code);
  if (!coupon) throw new ApiError(400, "Invalid coupon code");

  const cart = await getOrCreateCart(req.guestId);
  const summary = summarizeCart(cart, coupon);
  if (summary.totalPrice < Number(coupon.minPurchase)) {
    throw new ApiError(400, `Minimum purchase of ${coupon.minPurchase} required for this coupon`);
  }

  const updated = await prisma.cart.update({
    where: { id: cart.id },
    data: { couponCode: coupon.code },
    include: { items: { include: { product: true } } },
  });
  await respondWithCart(res, req.guestId, updated);
}

import crypto from "node:crypto";
import type { Request, Response } from "express";
import { prisma } from "@/config/db";
import { getRazorpay } from "@/config/razorpay";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import { createOrderSchema } from "@/modules/orders/orders.schema";
import { findCouponByCode } from "@/modules/coupons/coupons.repo";
import { summarizeItems } from "@/modules/cart/cart.summary";

export async function createOrder(req: Request, res: Response) {
  const { items, couponCode } = createOrderSchema.parse(req.body);
  const userId = req.userId!;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, isActive: true },
  });

  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new ApiError(404, `Product ${item.productId} not found`);
    if (product.stock < item.qty) throw new ApiError(400, `"${product.title}" only has ${product.stock} left in stock`);
    return { product, qty: item.qty };
  });

  const coupon = couponCode ? await findCouponByCode(couponCode) : null;
  if (couponCode && !coupon) throw new ApiError(400, "Invalid coupon code");

  const summary = summarizeItems(lineItems, coupon);
  if (coupon && summary.totalPrice < Number(coupon.minPurchase)) {
    throw new ApiError(400, `Minimum purchase of ${coupon.minPurchase} required for coupon ${coupon.code}`);
  }

  const orderId = crypto.randomUUID();
  const rzpOrder = await getRazorpay().orders.create({
    amount: Math.round(summary.totalAmount * 100),
    currency: "INR",
    receipt: orderId,
  });

  const order = await prisma.order.create({
    data: {
      id: orderId,
      userId,
      totalMrp: summary.totalMrp,
      discount: summary.discountOnMrp + summary.couponDiscount,
      shipping: summary.shipping,
      totalAmount: summary.totalAmount,
      status: "created",
      couponCode: coupon?.code,
      razorpayOrderId: rzpOrder.id,
      items: {
        create: lineItems.map((item) => ({
          productId: item.product.id,
          qty: item.qty,
          priceAtPurchase: item.product.price,
        })),
      },
    },
    include: { items: true },
  });

  res.status(201).json({
    orderId: order.id,
    razorpayOrderId: rzpOrder.id,
    amount: summary.totalAmount,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}

export async function getOrder(req: Request, res: Response) {
  const order = await prisma.order.findUnique({
    where: { id: param(req.params.id) },
    include: { items: { include: { product: true } } },
  });
  if (!order) throw new ApiError(404, "Order not found");
  res.json(order);
}

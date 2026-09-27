import crypto from "node:crypto";
import type { Request, Response } from "express";
import { prisma } from "@/config/db";
import { getRazorpay } from "@/config/razorpay";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import { createOrderSchema, listMyOrdersQuerySchema } from "@/modules/orders/orders.schema";
import { findCouponByCode } from "@/modules/coupons/coupons.repo";
import { summarizeItems } from "@/modules/cart/cart.summary";
import { restockAndFailOrder } from "@/modules/orders/orders.repo";

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

  // Reserve stock (and coupon usage) atomically as part of creating the
  // order — the read-based checks above are only fast-fail UX messages.
  // These guards are the real ones: two concurrent checkouts for the last
  // unit, or the last use of a limited coupon, can't both succeed — the
  // loser's updateMany gets count 0 and throws, rolling back the whole
  // transaction (including the other items' decrements).
  const order = await prisma.$transaction(async (tx) => {
    for (const item of lineItems) {
      const result = await tx.product.updateMany({
        where: { id: item.product.id, stock: { gte: item.qty } },
        data: { stock: { decrement: item.qty } },
      });
      if (result.count === 0) {
        throw new ApiError(409, `"${item.product.title}" just sold out — please update your cart`);
      }
    }

    if (coupon) {
      // Same atomic-guard shape as the stock check above: the WHERE clause
      // compares the row's live timesUsed at write time (under Postgres's
      // row lock), so two concurrent checkouts for the last use of a
      // limited coupon can't both succeed.
      const result = await tx.coupon.updateMany({
        where: {
          id: coupon.id,
          OR: [{ usageLimit: null }, { timesUsed: { lt: coupon.usageLimit ?? 0 } }],
        },
        data: { timesUsed: { increment: 1 } },
      });
      if (result.count === 0) {
        throw new ApiError(409, `Coupon "${coupon.code}" has reached its usage limit`);
      }
    }

    return tx.order.create({
      data: {
        id: orderId,
        userId,
        totalMrp: summary.totalMrp,
        discount: summary.discountOnMrp + summary.couponDiscount,
        shipping: summary.shipping,
        totalAmount: summary.totalAmount,
        status: "created",
        couponCode: coupon?.code,
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
  });

  // Razorpay call kept outside the DB transaction (no network I/O inside a
  // transaction). If it fails, release the stock just reserved.
  let rzpOrder;
  try {
    rzpOrder = await getRazorpay().orders.create({
      amount: Math.round(summary.totalAmount * 100),
      currency: "INR",
      receipt: orderId,
    });
  } catch (err) {
    await restockAndFailOrder(orderId, "Auto-failed: Razorpay order creation failed");
    throw err;
  }

  await prisma.order.update({ where: { id: orderId }, data: { razorpayOrderId: rzpOrder.id } });

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
    include: {
      items: { include: { product: true } },
      returns: {
        orderBy: { createdAt: "desc" },
        select: { id: true, qty: true, reason: true, status: true, refundAmount: true, createdAt: true, orderItemId: true },
      },
    },
  });
  if (!order) throw new ApiError(404, "Order not found");
  res.json(order);
}

// "My Orders" — the customer's own order history, most recent first. This is
// the page that surfaces admin-side status/tracking changes (shipped,
// delivered, cancelled, refunded, return approvals) back to the customer.
export async function listMyOrders(req: Request, res: Response) {
  const query = listMyOrdersQuerySchema.parse(req.query);
  const userId = req.userId!;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: { select: { title: true, images: true, slug: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  res.json({ items, pagination: { total, page: query.page, pageSize: query.limit } });
}

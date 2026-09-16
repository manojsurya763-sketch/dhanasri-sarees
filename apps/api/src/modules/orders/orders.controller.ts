import type { Request, Response } from "express";
import { prisma } from "@/config/db";
import { param } from "@/lib/params";
import { ApiError } from "@/middleware/error-handler";
import { createOrderSchema } from "@/modules/orders/orders.schema";
import { getOrCreateCart } from "@/modules/cart/cart.repo";
import { findCouponByCode } from "@/modules/coupons/coupons.repo";
import { summarizeCart } from "@/modules/cart/cart.summary";

export async function createOrder(req: Request, res: Response) {
  const { phone } = createOrderSchema.parse(req.body);
  const cart = await getOrCreateCart(req.guestId);
  if (cart.items.length === 0) throw new ApiError(400, "Cart is empty");

  const coupon = cart.couponCode ? await findCouponByCode(cart.couponCode) : null;
  const summary = summarizeCart(cart, coupon);

  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
  });

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: user.id,
        totalMrp: summary.totalMrp,
        discount: summary.discountOnMrp + summary.couponDiscount,
        shipping: summary.shipping,
        totalAmount: summary.totalAmount,
        status: "pending",
        couponCode: cart.couponCode,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            priceAtPurchase: item.product.price,
          })),
        },
      },
      include: { items: true },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    await tx.cart.update({ where: { id: cart.id }, data: { couponCode: null } });

    return created;
  });

  res.status(201).json(order);
}

export async function getOrder(req: Request, res: Response) {
  const order = await prisma.order.findUnique({
    where: { id: param(req.params.id) },
    include: { items: { include: { product: true } } },
  });
  if (!order) throw new ApiError(404, "Order not found");
  res.json(order);
}

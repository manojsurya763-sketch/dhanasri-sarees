import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { decodeFakeToken, customerToken } from "./fakeAuth";

vi.mock("@/config/firebaseAdmin", () => ({
  firebaseAuth: { verifyIdToken: vi.fn(async (t: string) => decodeFakeToken(t)) },
}));
vi.mock("@/config/razorpay", () => ({
  getRazorpay: () => ({
    orders: {
      create: vi.fn(async () => ({ id: `order_fake_${Math.random().toString(36).slice(2)}` })),
    },
  }),
}));

import { app } from "@/app";
import { prisma } from "@/config/db";

describe("coupon usage limit", () => {
  const phone = `+1888${Date.now()}`;
  let userId: string;
  let productId: string;
  let couponId: string;
  let couponCode: string;

  beforeAll(async () => {
    const user = await prisma.user.create({ data: { phone } });
    userId = user.id;
    const product = await prisma.product.create({
      data: { title: "Coupon Saree", sku: `CPN-${Date.now()}`, slug: `cpn-saree-${Date.now()}`, mrp: 1000, price: 1000, stock: 10 },
    });
    productId = product.id;
    couponCode = `LIMIT1${Date.now()}`;
    const coupon = await prisma.coupon.create({
      data: { code: couponCode, pctOff: 10, maxOff: 500, minPurchase: 0, isActive: true, usageLimit: 1 },
    });
    couponId = coupon.id;
  });

  afterAll(async () => {
    await prisma.orderStatusHistory.deleteMany({ where: { order: { userId } } });
    await prisma.orderItem.deleteMany({ where: { order: { userId } } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.coupon.delete({ where: { id: couponId } });
    await prisma.product.delete({ where: { id: productId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  it("rejects a second checkout once the usage limit is reached", async () => {
    const token = customerToken(phone);
    const body = { items: [{ productId, qty: 1 }], couponCode };

    const first = await request(app).post("/orders").set("Authorization", `Bearer ${token}`).send(body);
    expect(first.status).toBe(201);

    const second = await request(app).post("/orders").set("Authorization", `Bearer ${token}`).send(body);
    expect(second.status).toBe(409);

    const updated = await prisma.coupon.findUnique({ where: { id: couponId } });
    expect(updated!.timesUsed).toBe(1);
  });
});

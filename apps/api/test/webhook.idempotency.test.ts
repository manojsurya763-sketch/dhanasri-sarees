import crypto from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { decodeFakeToken } from "./fakeAuth";

// The webhook route itself doesn't use requireStaff/requireAuth, but
// importing @/app pulls in auth.guard.ts -> firebaseAdmin.ts, which would
// otherwise try to initialize the Firebase Admin SDK with the dummy
// credentials in .env.test and throw at import time.
vi.mock("@/config/firebaseAdmin", () => ({
  firebaseAuth: { verifyIdToken: vi.fn(async (t: string) => decodeFakeToken(t)) },
}));

import { app } from "@/app";
import { prisma } from "@/config/db";

describe("razorpay webhook idempotency", () => {
  let userId: string;
  let productId: string;
  let orderId: string;
  const razorpayOrderId = `order_idem_test_${Date.now()}`;
  const paymentId = `pay_idem_test_${Date.now()}`;

  beforeAll(async () => {
    const user = await prisma.user.create({ data: { phone: `+1777${Date.now()}` } });
    userId = user.id;
    const product = await prisma.product.create({
      data: { title: "Webhook Saree", sku: `WH-${Date.now()}`, slug: `wh-saree-${Date.now()}`, mrp: 300, price: 300, stock: 10 },
    });
    productId = product.id;
    const order = await prisma.order.create({
      data: {
        userId,
        totalMrp: 300,
        discount: 0,
        shipping: 0,
        totalAmount: 300,
        status: "created",
        razorpayOrderId,
        items: { create: [{ productId, qty: 1, priceAtPurchase: 300 }] },
      },
    });
    orderId = order.id;
  });

  afterAll(async () => {
    await prisma.webhookEvent.deleteMany({ where: { eventId: `payment.captured:${paymentId}` } });
    await prisma.orderStatusHistory.deleteMany({ where: { orderId } });
    await prisma.orderItem.deleteMany({ where: { orderId } });
    await prisma.order.delete({ where: { id: orderId } });
    await prisma.product.delete({ where: { id: productId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  function buildPayload() {
    return JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { id: paymentId, order_id: razorpayOrderId } } },
    });
  }

  function sign(body: string) {
    return crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!).update(body).digest("hex");
  }

  it("processes a retried delivery of the same event only once", async () => {
    const body = buildPayload();
    const signature = sign(body);

    const first = await request(app)
      .post("/webhooks/razorpay")
      .set("Content-Type", "application/json")
      .set("x-razorpay-signature", signature)
      .send(body);
    expect(first.status).toBe(200);

    const second = await request(app)
      .post("/webhooks/razorpay")
      .set("Content-Type", "application/json")
      .set("x-razorpay-signature", signature)
      .send(body);
    expect(second.status).toBe(200);

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { history: true } });
    expect(order!.status).toBe("paid");
    expect(order!.history).toHaveLength(1);

    const events = await prisma.webhookEvent.count({ where: { eventId: `payment.captured:${paymentId}` } });
    expect(events).toBe(1);
  });
});

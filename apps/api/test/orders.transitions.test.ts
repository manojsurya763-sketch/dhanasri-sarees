import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { decodeFakeToken, staffToken } from "./fakeAuth";

vi.mock("@/config/firebaseAdmin", () => ({
  firebaseAuth: { verifyIdToken: vi.fn(async (t: string) => decodeFakeToken(t)) },
}));

import { app } from "@/app";
import { prisma } from "@/config/db";

describe("order status transitions", () => {
  const saUid = "orders-test-sa";
  const empUid = "orders-test-emp";
  let userId: string;
  let productId: string;

  beforeAll(async () => {
    await prisma.staff.createMany({
      data: [
        { firebaseUid: saUid, email: "orders-sa@test.local", role: "super_admin" },
        { firebaseUid: empUid, email: "orders-emp@test.local", role: "employee" },
      ],
      skipDuplicates: true,
    });
    const user = await prisma.user.create({ data: { phone: `+1000${Date.now()}` } });
    userId = user.id;
    const product = await prisma.product.create({
      data: { title: "Test Saree", sku: `TEST-${Date.now()}`, slug: `test-saree-${Date.now()}`, mrp: 1000, price: 1000, stock: 10 },
    });
    productId = product.id;
  });

  afterAll(async () => {
    await prisma.staff.deleteMany({ where: { firebaseUid: { in: [saUid, empUid] } } });
    await prisma.orderStatusHistory.deleteMany({ where: { order: { userId } } });
    await prisma.orderItem.deleteMany({ where: { order: { userId } } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.product.delete({ where: { id: productId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  function createOrder(status: "created" | "paid" | "shipped") {
    return prisma.order.create({
      data: {
        userId,
        totalMrp: 1000,
        discount: 0,
        shipping: 0,
        totalAmount: 1000,
        status,
        items: { create: [{ productId, qty: 1, priceAtPurchase: 1000 }] },
      },
    });
  }

  it("employee cannot cancel a paid order", async () => {
    const order = await createOrder("paid");
    const res = await request(app)
      .patch(`/admin/orders/${order.id}/status`)
      .set("Authorization", `Bearer ${staffToken(empUid)}`)
      .send({ status: "cancelled" });
    expect(res.status).toBe(400);
  });

  it("employee can ship a paid order", async () => {
    const order = await createOrder("paid");
    const res = await request(app)
      .patch(`/admin/orders/${order.id}/status`)
      .set("Authorization", `Bearer ${staffToken(empUid)}`)
      .send({ status: "shipped" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("shipped");
  });

  it("super admin can cancel a paid order, restocks it, and records an audit trail entry", async () => {
    const order = await createOrder("paid");
    const before = await prisma.product.findUnique({ where: { id: productId } });

    const res = await request(app)
      .patch(`/admin/orders/${order.id}/status`)
      .set("Authorization", `Bearer ${staffToken(saUid)}`)
      .send({ status: "cancelled" });
    expect(res.status).toBe(200);

    const after = await prisma.product.findUnique({ where: { id: productId } });
    expect(after!.stock).toBe(before!.stock + 1);

    const history = await prisma.orderStatusHistory.findMany({ where: { orderId: order.id } });
    expect(history).toHaveLength(1);
    expect(history[0].toStatus).toBe("cancelled");
    expect(history[0].fromStatus).toBe("paid");
  });

  it("rejects an illegal transition regardless of role", async () => {
    const order = await createOrder("created");
    const res = await request(app)
      .patch(`/admin/orders/${order.id}/status`)
      .set("Authorization", `Bearer ${staffToken(saUid)}`)
      .send({ status: "delivered" });
    expect(res.status).toBe(400);
  });
});

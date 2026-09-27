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

import type { Server } from "node:http";
import { app } from "@/app";
import { prisma } from "@/config/db";

describe("checkout stock reservation", () => {
  const phone = `+1999${Date.now()}`;
  let userId: string;
  let productId: string;
  let server: Server;

  beforeAll(async () => {
    // A single long-lived server (rather than letting supertest spin up a
    // fresh ephemeral listener per call) so concurrent requests actually
    // overlap in flight instead of being serialized by per-request
    // listen() setup — otherwise the first request can fully commit before
    // the second even starts, masking a broken atomic guard.
    server = app.listen(0);
    const user = await prisma.user.create({ data: { phone } });
    userId = user.id;
    const product = await prisma.product.create({
      data: { title: "Race Saree", sku: `RACE-${Date.now()}`, slug: `race-saree-${Date.now()}`, mrp: 500, price: 500, stock: 1 },
    });
    productId = product.id;
  });

  afterAll(async () => {
    server.close();
    await prisma.orderStatusHistory.deleteMany({ where: { order: { userId } } });
    await prisma.orderItem.deleteMany({ where: { order: { userId } } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.product.delete({ where: { id: productId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  it("end-to-end: only one of several concurrent checkouts for the last unit succeeds", async () => {
    const body = { items: [{ productId, qty: 1 }] };
    const token = customerToken(phone);

    // Integration-level check against the real endpoint. Local Postgres
    // round-trips are fast enough that these requests don't reliably
    // overlap deep enough to exercise the atomic guard specifically (the
    // read-based fast-fail check often wins the race first) — see the
    // dedicated test below for that. This test instead protects the
    // end-to-end invariant: whichever guard catches it, exactly one
    // checkout succeeds and stock never goes negative.
    const results = await Promise.all(
      Array.from({ length: 5 }, () => request(server).post("/orders").set("Authorization", `Bearer ${token}`).send(body))
    );

    const successCount = results.filter((r) => r.status === 201).length;
    expect(successCount).toBe(1);
    for (const res of results) {
      if (res.status !== 201) expect([400, 409]).toContain(res.status);
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    expect(product!.stock).toBe(0);
  });

  it("atomic guard: the exact updateMany pattern used in createOrder can't oversell under forced overlap", async () => {
    // Directly exercises the same shape as orders.controller.ts's stock
    // guard (`updateMany({ where: { id, stock: { gte: qty } }, data: { stock: { decrement: qty } } })`
    // inside a $transaction), with an artificial delay to force genuine
    // concurrent overlap — something the HTTP test above can't reliably
    // produce against a fast local database. This is the test that would
    // actually fail if the `stock: { gte: qty }` guard were removed.
    await prisma.product.update({ where: { id: productId }, data: { stock: 1 } });

    async function reserve() {
      try {
        await prisma.$transaction(async (tx) => {
          const result = await tx.product.updateMany({
            where: { id: productId, stock: { gte: 1 } },
            data: { stock: { decrement: 1 } },
          });
          await new Promise((resolve) => setTimeout(resolve, 100));
          if (result.count === 0) throw new Error("SOLD_OUT");
        });
        return "success" as const;
      } catch {
        return "failed" as const;
      }
    }

    const [a, b] = await Promise.all([reserve(), reserve()]);
    const successCount = [a, b].filter((r) => r === "success").length;
    expect(successCount).toBe(1);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    expect(product!.stock).toBe(0);
  });
});

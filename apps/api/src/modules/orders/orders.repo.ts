import { prisma } from "@/config/db";

// Restock reserved items and mark an order failed — used whenever a
// "created" order's payment doesn't complete: a Razorpay order-create
// failure right after reserving stock, the payment.failed webhook, or the
// stale-order reconciliation job. Idempotent: a no-op if the order has
// already moved out of "created" (e.g. the webhook and reconciliation job
// race on the same order).
export async function restockAndFailOrder(orderId: string, note: string, changedByStaffId: string | null = null) {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== "created") return;

    const items = await tx.orderItem.findMany({ where: { orderId } });
    for (const item of items) {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.qty } } });
    }

    if (order.couponCode) {
      await tx.coupon.updateMany({
        where: { code: order.couponCode, timesUsed: { gt: 0 } },
        data: { timesUsed: { decrement: 1 } },
      });
    }

    await tx.orderStatusHistory.create({
      data: { orderId, fromStatus: order.status, toStatus: "failed", changedByStaffId, note },
    });

    await tx.order.update({ where: { id: orderId }, data: { status: "failed" } });
  });
}

export function findStaleCreatedOrders(olderThan: Date) {
  return prisma.order.findMany({
    where: { status: "created", createdAt: { lt: olderThan } },
    select: { id: true },
  });
}

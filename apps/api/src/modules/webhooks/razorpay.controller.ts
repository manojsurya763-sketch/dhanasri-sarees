import crypto from "node:crypto";
import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "@/config/db";
import { restockAndFailOrder } from "@/modules/orders/orders.repo";

function verifySignature(rawBody: Buffer, signature: string | undefined, secret: string): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function handleRazorpayWebhook(req: Request, res: Response) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    req.log.error("RAZORPAY_WEBHOOK_SECRET not configured; rejecting webhook");
    return res.status(500).json({ error: "Webhook not configured" });
  }

  const signature = req.headers["x-razorpay-signature"] as string | undefined;
  const rawBody = req.body as Buffer;

  if (!verifySignature(rawBody, signature, secret)) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const payload = JSON.parse(rawBody.toString("utf8"));
  const event = payload.event as string;
  const payment = payload.payload?.payment?.entity;

  // Razorpay retries webhook deliveries — dedupe on (event, payment id) so a
  // retried delivery is a no-op instead of double-processing (stock is only
  // ever decremented once, at order creation — see orders.controller.ts).
  if (payment?.id) {
    try {
      await prisma.webhookEvent.create({
        data: { provider: "razorpay", eventId: `${event}:${payment.id}`, type: event },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return res.json({ received: true });
      }
      throw err;
    }
  }

  if (event === "payment.captured") {
    const razorpayOrderId = payment?.order_id as string | undefined;
    if (razorpayOrderId) {
      const order = await prisma.order.findUnique({ where: { razorpayOrderId } });
      // Stock was already reserved when the order was created — this only
      // flips status. Only acts on "created": if the order was already
      // auto-failed by the stale-order job (a very late webhook), it is
      // left as-is rather than risk re-decrementing already-restocked stock;
      // that rare case needs a human to reconcile the payment manually.
      if (order && order.status === "created") {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: order.id },
            data: { status: "paid", razorpayPaymentId: payment.id },
          });
          await tx.orderStatusHistory.create({
            data: {
              orderId: order.id,
              fromStatus: "created",
              toStatus: "paid",
              changedByStaffId: null,
              note: "Razorpay payment.captured webhook",
            },
          });
        });
      }
    }
  } else if (event === "payment.failed") {
    const razorpayOrderId = payment?.order_id as string | undefined;
    if (razorpayOrderId) {
      const order = await prisma.order.findUnique({ where: { razorpayOrderId } });
      if (order) {
        await restockAndFailOrder(order.id, "Auto-failed: Razorpay payment.failed webhook");
      }
    }
  }

  res.json({ received: true });
}

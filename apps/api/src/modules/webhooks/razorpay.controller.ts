import crypto from "node:crypto";
import type { Request, Response } from "express";
import { prisma } from "@/config/db";

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
    console.error("RAZORPAY_WEBHOOK_SECRET not configured; rejecting webhook");
    return res.status(500).json({ error: "Webhook not configured" });
  }

  const signature = req.headers["x-razorpay-signature"] as string | undefined;
  const rawBody = req.body as Buffer;

  if (!verifySignature(rawBody, signature, secret)) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const payload = JSON.parse(rawBody.toString("utf8"));
  const event = payload.event as string;

  if (event === "payment.captured") {
    const payment = payload.payload?.payment?.entity;
    const razorpayOrderId = payment?.order_id as string | undefined;
    if (razorpayOrderId) {
      const order = await prisma.order.findUnique({ where: { razorpayOrderId } });
      if (order && order.status !== "paid") {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: order.id },
            data: { status: "paid", razorpayPaymentId: payment.id },
          });

          const items = await tx.orderItem.findMany({ where: { orderId: order.id } });
          for (const item of items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.qty } },
            });
          }
        });
      }
    }
  } else if (event === "payment.failed") {
    const payment = payload.payload?.payment?.entity;
    const razorpayOrderId = payment?.order_id as string | undefined;
    if (razorpayOrderId) {
      await prisma.order.updateMany({
        where: { razorpayOrderId, status: "created" },
        data: { status: "failed" },
      });
    }
  }

  res.json({ received: true });
}

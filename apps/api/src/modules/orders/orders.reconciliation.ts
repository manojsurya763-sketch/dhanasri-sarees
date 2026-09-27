import { logger } from "@/config/logger";
import { findStaleCreatedOrders, restockAndFailOrder } from "@/modules/orders/orders.repo";

const STALE_THRESHOLD_MS = 60 * 60 * 1000; // 60 minutes

// Orders can get stuck in "created" forever if the Razorpay webhook never
// arrives (browser closed mid-payment, delivery outage) — this periodically
// restocks and fails any order that's been unpaid too long.
export async function reconcileStaleOrders() {
  const olderThan = new Date(Date.now() - STALE_THRESHOLD_MS);
  const stale = await findStaleCreatedOrders(olderThan);

  for (const order of stale) {
    await restockAndFailOrder(order.id, "Auto-failed: stale unpaid order");
  }

  if (stale.length > 0) {
    logger.info({ count: stale.length }, "reconciled stale unpaid orders");
  }
}

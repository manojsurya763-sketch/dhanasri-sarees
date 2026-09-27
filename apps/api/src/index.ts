import { app } from "@/app";
import { logger } from "@/config/logger";
import { reconcileStaleOrders } from "@/modules/orders/orders.reconciliation";

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const RECONCILE_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

app.listen(port, () => {
  logger.info(`API listening on http://localhost:${port}`);
});

setInterval(() => {
  reconcileStaleOrders().catch((err) => logger.error({ err }, "stale-order reconciliation failed"));
}, RECONCILE_INTERVAL_MS);

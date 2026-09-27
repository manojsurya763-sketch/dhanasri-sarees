import { Router } from "express";
import { getOrderAdmin, listOrdersAdmin, updateOrderStatus } from "@/modules/orders/orders.admin.controller";

export const ordersAdminRouter = Router();

ordersAdminRouter.get("/", listOrdersAdmin);
ordersAdminRouter.get("/:id", getOrderAdmin);
ordersAdminRouter.patch("/:id/status", updateOrderStatus);

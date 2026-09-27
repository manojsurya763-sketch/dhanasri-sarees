import { Router } from "express";
import { requireAuth } from "@/middleware/auth.guard";
import { createOrder, getOrder, listMyOrders } from "@/modules/orders/orders.controller";

export const ordersRouter = Router();

ordersRouter.get("/", requireAuth, listMyOrders);
ordersRouter.post("/", requireAuth, createOrder);
ordersRouter.get("/:id", getOrder);

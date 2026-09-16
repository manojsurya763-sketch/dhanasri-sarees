import { Router } from "express";
import { requireAuth } from "@/middleware/auth.guard";
import { createOrder, getOrder } from "@/modules/orders/orders.controller";

export const ordersRouter = Router();

ordersRouter.post("/", requireAuth, createOrder);
ordersRouter.get("/:id", getOrder);

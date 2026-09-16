import { Router } from "express";
import { createOrder, getOrder } from "@/modules/orders/orders.controller";

export const ordersRouter = Router();

ordersRouter.post("/", createOrder);
ordersRouter.get("/:id", getOrder);

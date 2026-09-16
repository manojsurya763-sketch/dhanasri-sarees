import { Router } from "express";
import { addItem, applyCoupon, getCart, removeItem, updateItem } from "@/modules/cart/cart.controller";

export const cartRouter = Router();

cartRouter.get("/", getCart);
cartRouter.post("/items", addItem);
cartRouter.patch("/items/:id", updateItem);
cartRouter.delete("/items/:id", removeItem);
cartRouter.post("/apply-coupon", applyCoupon);

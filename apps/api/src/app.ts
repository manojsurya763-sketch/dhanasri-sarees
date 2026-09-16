import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { guestCart } from "@/middleware/guest-cart";
import { errorHandler, notFoundHandler } from "@/middleware/error-handler";
import { authRouter } from "@/modules/auth/auth.routes";
import { productsRouter } from "@/modules/products/products.routes";
import { cartRouter } from "@/modules/cart/cart.routes";
import { wishlistRouter } from "@/modules/wishlist/wishlist.routes";
import { ordersRouter } from "@/modules/orders/orders.routes";
import { razorpayWebhookRouter } from "@/modules/webhooks/razorpay.routes";

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000", credentials: true }));

// Registered before express.json() so the Razorpay signature can be verified against the raw body.
app.use("/webhooks/razorpay", razorpayWebhookRouter);

app.use(express.json());
app.use(cookieParser());
app.use(guestCart);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/orders", ordersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

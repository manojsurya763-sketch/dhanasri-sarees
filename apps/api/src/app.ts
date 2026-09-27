import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import { buildOpenApiDocument } from "@/openapi/document";
import { logger } from "@/config/logger";
import { authLimiter, checkoutLimiter, globalLimiter } from "@/middleware/rate-limit";
import { guestCart } from "@/middleware/guest-cart";
import { requireStaff, requireRole, requireSuperAdmin } from "@/middleware/auth.guard";
import { errorHandler, notFoundHandler } from "@/middleware/error-handler";
import { authRouter } from "@/modules/auth/auth.routes";
import { categoriesRouter } from "@/modules/categories/categories.routes";
import { productsRouter } from "@/modules/products/products.routes";
import { cartRouter } from "@/modules/cart/cart.routes";
import { wishlistRouter } from "@/modules/wishlist/wishlist.routes";
import { ordersRouter } from "@/modules/orders/orders.routes";
import { razorpayWebhookRouter } from "@/modules/webhooks/razorpay.routes";
import { adminRouter } from "@/modules/admin/admin.routes";
import { productsAdminRouter } from "@/modules/products/products.admin.routes";
import { ordersAdminRouter } from "@/modules/orders/orders.admin.routes";
import { settingsRouter } from "@/modules/settings/settings.routes";
import { staffAdminRouter } from "@/modules/staff/staff.routes";
import { customersAdminRouter } from "@/modules/customers/customers.routes";
import { returnsAdminRouter } from "@/modules/returns/returns.routes";
import { reviewsAdminRouter } from "@/modules/reviews/reviews.routes";
import { couponsAdminRouter } from "@/modules/coupons/coupons.admin.routes";
import { attendanceRouter } from "@/modules/attendance/attendance.routes";
import { analyticsRouter } from "@/modules/analytics/analytics.routes";
import { engagementRouter } from "@/modules/engagement/engagement.routes";

export const app = express();

app.use(pinoHttp({ logger, genReqId: () => crypto.randomUUID() }));
app.use(helmet());
app.use(globalLimiter);

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Registered before express.json() so the Razorpay signature can be verified against the raw body.
app.use("/webhooks/razorpay", checkoutLimiter, razorpayWebhookRouter);

app.use(express.json());
app.use(cookieParser());
app.use(guestCart);

app.get("/health", (_req, res) => res.json({ ok: true }));

// Dev/staff API reference — not customer-facing, not gated behind auth
// (same as most internal API docs), documenting request schemas derived
// directly from the Zod schemas each controller already validates against.
const openApiDocument = buildOpenApiDocument();
app.get("/docs/openapi.json", (_req, res) => res.json(openApiDocument));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/auth", authLimiter, authRouter);
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/orders", checkoutLimiter, ordersRouter);
app.use("/settings", settingsRouter);

// More specific /admin/* mounts must be registered before the bare /admin
// mount below so their requests don't fall through to it.
app.use("/admin/products", requireStaff, productsAdminRouter);
app.use("/admin/orders", requireStaff, ordersAdminRouter);
app.use("/admin/staff", requireStaff, requireSuperAdmin, staffAdminRouter);
app.use("/admin/customers", requireStaff, customersAdminRouter);
app.use("/admin/returns", requireStaff, returnsAdminRouter);
app.use("/admin/reviews", requireStaff, reviewsAdminRouter);
app.use("/admin/discounts", requireStaff, requireSuperAdmin, couponsAdminRouter);
app.use("/admin/attendance", requireStaff, requireRole("employee", "super_admin"), attendanceRouter);
app.use("/admin/analytics", requireStaff, requireSuperAdmin, analyticsRouter);
app.use("/admin/engagement", requireStaff, requireSuperAdmin, engagementRouter);
app.use("/admin", requireStaff, adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

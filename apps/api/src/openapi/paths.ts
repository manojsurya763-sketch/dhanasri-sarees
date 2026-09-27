import { z } from "zod";
import { registry, idParam, jsonBody, jsonResponse, commonErrorResponses, errorResponse } from "@/openapi/registry";

import { addCartItemSchema, updateCartItemSchema, applyCouponSchema } from "@/modules/cart/cart.schema";
import {
  adminListCouponsQuerySchema,
  createCouponSchema,
  updateCouponSchema,
} from "@/modules/coupons/coupons.schema";
import { adminListCustomersQuerySchema, updateCustomerSchema } from "@/modules/customers/customers.schema";
import { dateRangeQuerySchema as analyticsDateRangeQuerySchema } from "@/modules/analytics/analytics.schema";
import { dateRangeQuerySchema as engagementDateRangeQuerySchema } from "@/modules/engagement/engagement.schema";
import {
  adminListOrdersQuerySchema,
  createOrderSchema,
  listMyOrdersQuerySchema,
  updateOrderStatusSchema,
} from "@/modules/orders/orders.schema";
import {
  adminListProductsQuerySchema,
  createProductSchema,
  facetsQuerySchema,
  listProductsQuerySchema,
  relatedQuerySchema,
  reviewsQuerySchema,
  updateProductSchema,
  updateStockSchema,
} from "@/modules/products/products.schema";
import {
  adminListReturnsQuerySchema,
  createReturnSchema,
  updateReturnStatusSchema,
} from "@/modules/returns/returns.schema";
import {
  adminListReviewsQuerySchema,
  respondToReviewSchema,
  setReviewVisibilitySchema,
} from "@/modules/reviews/reviews.schema";
import { updateSettingsSchema } from "@/modules/settings/settings.schema";
import { createStaffSchema, updateStaffRoleSchema } from "@/modules/staff/staff.schema";
import { listMyAttendanceQuerySchema } from "@/modules/attendance/attendance.schema";
import { addWishlistItemSchema } from "@/modules/wishlist/wishlist.schema";

const bearer = [{ bearerAuth: [] }];

// ---- auth ----
registry.registerPath({
  method: "post",
  path: "/auth/session",
  tags: ["Auth"],
  summary: "Sync a verified Firebase phone-auth login into the users table",
  security: bearer,
  responses: { 200: jsonResponse("Session synced"), 401: commonErrorResponses[401] },
});

// ---- categories ----
registry.registerPath({
  method: "get",
  path: "/categories",
  tags: ["Categories"],
  responses: { 200: jsonResponse("Category list") },
});
registry.registerPath({
  method: "get",
  path: "/categories/{slug}",
  tags: ["Categories"],
  request: { params: z.object({ slug: z.string() }) },
  responses: { 200: jsonResponse("Category detail"), 404: commonErrorResponses[404] },
});

// ---- products (public) ----
registry.registerPath({
  method: "get",
  path: "/products",
  tags: ["Products"],
  request: { query: listProductsQuerySchema },
  responses: { 200: jsonResponse("Paginated product list") },
});
registry.registerPath({
  method: "get",
  path: "/products/facets",
  tags: ["Products"],
  request: { query: facetsQuerySchema },
  responses: { 200: jsonResponse("Available filter facets") },
});
registry.registerPath({
  method: "get",
  path: "/products/{slug}",
  tags: ["Products"],
  request: { params: z.object({ slug: z.string() }) },
  responses: { 200: jsonResponse("Product detail"), 404: commonErrorResponses[404] },
});
registry.registerPath({
  method: "get",
  path: "/products/{id}/related",
  tags: ["Products"],
  request: { params: idParam, query: relatedQuerySchema },
  responses: { 200: jsonResponse("Related products") },
});
registry.registerPath({
  method: "get",
  path: "/products/{id}/reviews",
  tags: ["Products"],
  request: { params: idParam, query: reviewsQuerySchema },
  responses: { 200: jsonResponse("Paginated product reviews") },
});

// ---- cart ----
registry.registerPath({
  method: "get",
  path: "/cart",
  tags: ["Cart"],
  responses: { 200: jsonResponse("Current cart (guest or signed-in)") },
});
registry.registerPath({
  method: "post",
  path: "/cart/items",
  tags: ["Cart"],
  request: { body: jsonBody(addCartItemSchema) },
  responses: { 200: jsonResponse("Updated cart"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/cart/items/{id}",
  tags: ["Cart"],
  request: { params: idParam, body: jsonBody(updateCartItemSchema) },
  responses: { 200: jsonResponse("Updated cart"), ...commonErrorResponses },
});
registry.registerPath({
  method: "delete",
  path: "/cart/items/{id}",
  tags: ["Cart"],
  request: { params: idParam },
  responses: { 200: jsonResponse("Updated cart"), 404: commonErrorResponses[404] },
});
registry.registerPath({
  method: "post",
  path: "/cart/apply-coupon",
  tags: ["Cart"],
  request: { body: jsonBody(applyCouponSchema) },
  responses: { 200: jsonResponse("Cart with coupon applied"), ...commonErrorResponses },
});

// ---- wishlist ----
registry.registerPath({
  method: "get",
  path: "/wishlist",
  tags: ["Wishlist"],
  responses: { 200: jsonResponse("Wishlist items") },
});
registry.registerPath({
  method: "post",
  path: "/wishlist",
  tags: ["Wishlist"],
  request: { body: jsonBody(addWishlistItemSchema) },
  responses: { 201: jsonResponse("Item added"), ...commonErrorResponses },
});
registry.registerPath({
  method: "delete",
  path: "/wishlist/{id}",
  tags: ["Wishlist"],
  request: { params: idParam },
  responses: { 200: jsonResponse("Item removed"), 404: commonErrorResponses[404] },
});

// ---- orders (customer) ----
registry.registerPath({
  method: "get",
  path: "/orders",
  tags: ["Orders"],
  summary: "The signed-in customer's own order history — surfaces admin status/tracking/return changes",
  security: bearer,
  request: { query: listMyOrdersQuerySchema },
  responses: { 200: jsonResponse("Paginated own-order list"), 401: commonErrorResponses[401] },
});
registry.registerPath({
  method: "post",
  path: "/orders",
  tags: ["Orders"],
  summary: "Create an order and a Razorpay order to pay it (reserves stock/coupon usage atomically)",
  security: bearer,
  request: { body: jsonBody(createOrderSchema) },
  responses: {
    201: jsonResponse("Order + Razorpay order created"),
    409: jsonResponse("Out of stock or coupon usage limit reached", errorResponse),
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "get",
  path: "/orders/{id}",
  tags: ["Orders"],
  request: { params: idParam },
  responses: { 200: jsonResponse("Order detail"), 404: commonErrorResponses[404] },
});

// ---- settings (public read) ----
registry.registerPath({
  method: "get",
  path: "/settings",
  tags: ["Settings"],
  responses: { 200: jsonResponse("Site settings (logo, nav links)") },
});

// ---- webhooks (documented, not meant to be called manually) ----
registry.registerPath({
  method: "post",
  path: "/webhooks/razorpay",
  tags: ["Webhooks"],
  summary: "Razorpay payment webhook — signature-verified, idempotent on (event, payment id)",
  responses: { 200: jsonResponse("Acknowledged") },
});

// ==================== /admin/* (staff only) ====================

// ---- admin: me / dashboard / settings ----
registry.registerPath({
  method: "get",
  path: "/admin/me",
  tags: ["Admin: Session"],
  security: bearer,
  responses: { 200: jsonResponse("Current staff identity"), 401: commonErrorResponses[401], 403: commonErrorResponses[403] },
});
registry.registerPath({
  method: "get",
  path: "/admin/dashboard",
  tags: ["Admin: Session"],
  summary: "Super Admin / Admin only",
  security: bearer,
  responses: { 200: jsonResponse("Dashboard stats"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/settings",
  tags: ["Admin: Session"],
  summary: "Super Admin only",
  security: bearer,
  request: { body: jsonBody(updateSettingsSchema) },
  responses: { 200: jsonResponse("Updated settings"), ...commonErrorResponses },
});

// ---- admin: products ----
registry.registerPath({
  method: "get",
  path: "/admin/products",
  tags: ["Admin: Products"],
  security: bearer,
  request: { query: adminListProductsQuerySchema },
  responses: { 200: jsonResponse("Paginated product list"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/products/{id}",
  tags: ["Admin: Products"],
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Product detail"), ...commonErrorResponses },
});
registry.registerPath({
  method: "post",
  path: "/admin/products",
  tags: ["Admin: Products"],
  summary: "Super Admin / Admin only",
  security: bearer,
  request: { body: jsonBody(createProductSchema) },
  responses: { 201: jsonResponse("Product created"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/products/{id}",
  tags: ["Admin: Products"],
  summary: "Super Admin / Admin only",
  security: bearer,
  request: { params: idParam, body: jsonBody(updateProductSchema) },
  responses: { 200: jsonResponse("Product updated"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/products/{id}/stock",
  tags: ["Admin: Products"],
  summary: "Any staff role, including Employee",
  security: bearer,
  request: { params: idParam, body: jsonBody(updateStockSchema) },
  responses: { 200: jsonResponse("Stock updated"), ...commonErrorResponses },
});
registry.registerPath({
  method: "delete",
  path: "/admin/products/{id}",
  tags: ["Admin: Products"],
  summary: "Super Admin / Admin only (soft-delete)",
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Product deactivated"), ...commonErrorResponses },
});

// ---- admin: orders ----
registry.registerPath({
  method: "get",
  path: "/admin/orders",
  tags: ["Admin: Orders"],
  security: bearer,
  request: { query: adminListOrdersQuerySchema },
  responses: { 200: jsonResponse("Paginated order list"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/orders/{id}",
  tags: ["Admin: Orders"],
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Order detail incl. returns, status history, tracking"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/orders/{id}/status",
  tags: ["Admin: Orders"],
  summary: "created→shipped/delivered: any staff. cancelled/refunded: Super Admin only.",
  security: bearer,
  request: { params: idParam, body: jsonBody(updateOrderStatusSchema) },
  responses: { 200: jsonResponse("Order updated"), ...commonErrorResponses },
});

// ---- admin: staff (Super Admin only) ----
registry.registerPath({
  method: "get",
  path: "/admin/staff",
  tags: ["Admin: Staff"],
  security: bearer,
  responses: { 200: jsonResponse("Staff list"), ...commonErrorResponses },
});
registry.registerPath({
  method: "post",
  path: "/admin/staff",
  tags: ["Admin: Staff"],
  security: bearer,
  request: { body: jsonBody(createStaffSchema) },
  responses: { 201: jsonResponse("Staff account created"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/staff/{id}/role",
  tags: ["Admin: Staff"],
  security: bearer,
  request: { params: idParam, body: jsonBody(updateStaffRoleSchema) },
  responses: { 200: jsonResponse("Role updated"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/staff/{id}/deactivate",
  tags: ["Admin: Staff"],
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Staff deactivated"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/staff/{id}/reactivate",
  tags: ["Admin: Staff"],
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Staff reactivated"), ...commonErrorResponses },
});

// ---- admin: customers ----
registry.registerPath({
  method: "get",
  path: "/admin/customers",
  tags: ["Admin: Customers"],
  security: bearer,
  request: { query: adminListCustomersQuerySchema },
  responses: { 200: jsonResponse("Paginated customer list"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/customers/{id}",
  tags: ["Admin: Customers"],
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Customer detail"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/customers/{id}/spend-summary",
  tags: ["Admin: Customers"],
  summary: "Super Admin only",
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Lifetime value / order stats"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/customers/{id}",
  tags: ["Admin: Customers"],
  summary: "Super Admin only",
  security: bearer,
  request: { params: idParam, body: jsonBody(updateCustomerSchema) },
  responses: { 200: jsonResponse("Customer updated"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/customers/{id}/deactivate",
  tags: ["Admin: Customers"],
  summary: "Super Admin only",
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Customer deactivated"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/customers/{id}/reactivate",
  tags: ["Admin: Customers"],
  summary: "Super Admin only",
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Customer reactivated"), ...commonErrorResponses },
});

// ---- admin: returns ----
registry.registerPath({
  method: "get",
  path: "/admin/returns",
  tags: ["Admin: Returns"],
  security: bearer,
  request: { query: adminListReturnsQuerySchema },
  responses: { 200: jsonResponse("Paginated return list"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/returns/{id}",
  tags: ["Admin: Returns"],
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Return detail"), ...commonErrorResponses },
});
registry.registerPath({
  method: "post",
  path: "/admin/returns",
  tags: ["Admin: Returns"],
  summary: "Super Admin / Admin only",
  security: bearer,
  request: { body: jsonBody(createReturnSchema) },
  responses: { 201: jsonResponse("Return logged"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/returns/{id}/status",
  tags: ["Admin: Returns"],
  summary: "requested→processing: any staff. approved/rejected: Super Admin only.",
  security: bearer,
  request: { params: idParam, body: jsonBody(updateReturnStatusSchema) },
  responses: { 200: jsonResponse("Return updated"), ...commonErrorResponses },
});

// ---- admin: reviews ----
registry.registerPath({
  method: "get",
  path: "/admin/reviews",
  tags: ["Admin: Reviews"],
  security: bearer,
  request: { query: adminListReviewsQuerySchema },
  responses: { 200: jsonResponse("Paginated review list"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/reviews/{id}/response",
  tags: ["Admin: Reviews"],
  security: bearer,
  request: { params: idParam, body: jsonBody(respondToReviewSchema) },
  responses: { 200: jsonResponse("Response saved"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/reviews/{id}/visibility",
  tags: ["Admin: Reviews"],
  summary: "Super Admin only",
  security: bearer,
  request: { params: idParam, body: jsonBody(setReviewVisibilitySchema) },
  responses: { 200: jsonResponse("Visibility updated"), ...commonErrorResponses },
});

// ---- admin: discounts (Super Admin only) ----
registry.registerPath({
  method: "get",
  path: "/admin/discounts",
  tags: ["Admin: Discounts"],
  security: bearer,
  request: { query: adminListCouponsQuerySchema },
  responses: { 200: jsonResponse("Paginated coupon list"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/discounts/{id}",
  tags: ["Admin: Discounts"],
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Coupon detail"), ...commonErrorResponses },
});
registry.registerPath({
  method: "post",
  path: "/admin/discounts",
  tags: ["Admin: Discounts"],
  security: bearer,
  request: { body: jsonBody(createCouponSchema) },
  responses: { 201: jsonResponse("Coupon created"), ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/admin/discounts/{id}",
  tags: ["Admin: Discounts"],
  security: bearer,
  request: { params: idParam, body: jsonBody(updateCouponSchema) },
  responses: { 200: jsonResponse("Coupon updated"), ...commonErrorResponses },
});
registry.registerPath({
  method: "delete",
  path: "/admin/discounts/{id}",
  tags: ["Admin: Discounts"],
  summary: "Soft-deactivate",
  security: bearer,
  request: { params: idParam },
  responses: { 200: jsonResponse("Coupon deactivated"), ...commonErrorResponses },
});

// ---- admin: attendance (Employee + Super Admin, self-service) ----
registry.registerPath({
  method: "get",
  path: "/admin/attendance/me",
  tags: ["Admin: Attendance"],
  security: bearer,
  request: { query: listMyAttendanceQuerySchema },
  responses: { 200: jsonResponse("Own attendance history"), ...commonErrorResponses },
});
registry.registerPath({
  method: "post",
  path: "/admin/attendance/clock-in",
  tags: ["Admin: Attendance"],
  security: bearer,
  responses: {
    201: jsonResponse("Clocked in"),
    409: jsonResponse("Already clocked in", errorResponse),
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "post",
  path: "/admin/attendance/clock-out",
  tags: ["Admin: Attendance"],
  security: bearer,
  responses: { 200: jsonResponse("Clocked out"), ...commonErrorResponses },
});

// ---- admin: analytics (Super Admin only) ----
registry.registerPath({
  method: "get",
  path: "/admin/analytics/sales",
  tags: ["Admin: Analytics"],
  security: bearer,
  request: { query: analyticsDateRangeQuerySchema },
  responses: { 200: jsonResponse("Revenue/orders by day"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/analytics/products",
  tags: ["Admin: Analytics"],
  security: bearer,
  request: { query: analyticsDateRangeQuerySchema },
  responses: { 200: jsonResponse("Top products by revenue/units"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/analytics/customers",
  tags: ["Admin: Analytics"],
  security: bearer,
  responses: { 200: jsonResponse("Repeat-customer rate"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/analytics/returns-rate",
  tags: ["Admin: Analytics"],
  security: bearer,
  request: { query: analyticsDateRangeQuerySchema },
  responses: { 200: jsonResponse("Returns rate"), ...commonErrorResponses },
});

// ---- admin: engagement (Super Admin only) ----
registry.registerPath({
  method: "get",
  path: "/admin/engagement/wishlist-top-products",
  tags: ["Admin: Engagement"],
  security: bearer,
  responses: { 200: jsonResponse("Top wishlisted products"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/engagement/wishlist-conversion",
  tags: ["Admin: Engagement"],
  security: bearer,
  responses: { 200: jsonResponse("Wishlist-to-purchase conversion"), ...commonErrorResponses },
});
registry.registerPath({
  method: "get",
  path: "/admin/engagement/review-engagement",
  tags: ["Admin: Engagement"],
  security: bearer,
  request: { query: engagementDateRangeQuerySchema },
  responses: { 200: jsonResponse("Review volume/rating trend"), ...commonErrorResponses },
});

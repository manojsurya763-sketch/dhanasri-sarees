import { getIdToken } from "@/lib/firebase";
import type {
  AttendanceEntry,
  Category,
  Coupon,
  CouponInput,
  CreateReturnInput,
  CreateStaffInput,
  CustomerAnalytics,
  CustomerDetail,
  CustomerListItem,
  CustomerSpendSummary,
  DashboardStats,
  NavLink,
  OrderDetail,
  OrderListItem,
  OrderListResponse,
  OrderStatus,
  Paginated,
  Product,
  ProductAnalytics,
  ProductInput,
  ReturnDetail,
  ReturnListItem,
  ReturnsRateAnalytics,
  ReturnStatus,
  ReviewEngagement,
  ReviewListItem,
  SalesAnalytics,
  StaffMember,
  StaffRole,
  UpdateCustomerInput,
  WishlistConversion,
  WishlistTopProduct,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

export function getMe() {
  return apiFetch<{ id: string; email: string | null; role: StaffRole }>("/admin/me");
}

export function listCategories() {
  return apiFetch<{ items: Category[] }>("/categories");
}

export function getDashboardStats() {
  return apiFetch<DashboardStats>("/admin/dashboard");
}

export function getSettings() {
  return apiFetch<{ logoUrl: string | null; navLinks: NavLink[] | null }>("/settings");
}

export function updateSettings(input: { logoUrl?: string; navLinks?: NavLink[] }) {
  return apiFetch<{ logoUrl: string | null; navLinks: NavLink[] | null }>("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function listProducts(query: string) {
  return apiFetch<Paginated<Product>>(`/admin/products?${query}`);
}

export function getProduct(id: string) {
  return apiFetch<Product>(`/admin/products/${id}`);
}

export function createProduct(input: ProductInput) {
  return apiFetch<Product>("/admin/products", { method: "POST", body: JSON.stringify(input) });
}

export function updateProduct(id: string, input: Partial<ProductInput>) {
  return apiFetch<Product>(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteProduct(id: string) {
  return apiFetch<Product>(`/admin/products/${id}`, { method: "DELETE" });
}

export function updateProductStock(id: string, stock: number) {
  return apiFetch<Product>(`/admin/products/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ stock }),
  });
}

export function listOrders(query: string) {
  return apiFetch<OrderListResponse>(`/admin/orders?${query}`);
}

export function getOrder(id: string) {
  return apiFetch<OrderDetail>(`/admin/orders/${id}`);
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  tracking?: { trackingNumber?: string; carrier?: string }
) {
  return apiFetch<OrderDetail>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...tracking }),
  });
}

export function listStaff() {
  return apiFetch<{ items: StaffMember[] }>("/admin/staff");
}

export function createStaff(input: CreateStaffInput) {
  return apiFetch<StaffMember>("/admin/staff", { method: "POST", body: JSON.stringify(input) });
}

export function updateStaffRole(id: string, role: StaffRole) {
  return apiFetch<StaffMember>(`/admin/staff/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export function deactivateStaff(id: string) {
  return apiFetch<StaffMember>(`/admin/staff/${id}/deactivate`, { method: "PATCH" });
}

export function reactivateStaff(id: string) {
  return apiFetch<StaffMember>(`/admin/staff/${id}/reactivate`, { method: "PATCH" });
}

export function listCustomers(query: string) {
  return apiFetch<Paginated<CustomerListItem>>(`/admin/customers?${query}`);
}

export function getCustomer(id: string) {
  return apiFetch<CustomerDetail>(`/admin/customers/${id}`);
}

export function getCustomerSpendSummary(id: string) {
  return apiFetch<CustomerSpendSummary>(`/admin/customers/${id}/spend-summary`);
}

export function updateCustomer(id: string, input: UpdateCustomerInput) {
  return apiFetch<CustomerDetail>(`/admin/customers/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deactivateCustomer(id: string) {
  return apiFetch<CustomerDetail>(`/admin/customers/${id}/deactivate`, { method: "PATCH" });
}

export function reactivateCustomer(id: string) {
  return apiFetch<CustomerDetail>(`/admin/customers/${id}/reactivate`, { method: "PATCH" });
}

export function listReturns(query: string) {
  return apiFetch<Paginated<ReturnListItem>>(`/admin/returns?${query}`);
}

export function getReturn(id: string) {
  return apiFetch<ReturnDetail>(`/admin/returns/${id}`);
}

export function createReturn(input: CreateReturnInput) {
  return apiFetch<ReturnDetail>("/admin/returns", { method: "POST", body: JSON.stringify(input) });
}

export function updateReturnStatus(id: string, status: ReturnStatus, refundAmount?: number) {
  return apiFetch<ReturnDetail>(`/admin/returns/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...(refundAmount !== undefined && { refundAmount }) }),
  });
}

export function listReviews(query: string) {
  return apiFetch<Paginated<ReviewListItem>>(`/admin/reviews?${query}`);
}

export function respondToReview(id: string, staffResponse: string) {
  return apiFetch<ReviewListItem>(`/admin/reviews/${id}/response`, {
    method: "PATCH",
    body: JSON.stringify({ staffResponse }),
  });
}

export function setReviewVisibility(id: string, isHidden: boolean) {
  return apiFetch<ReviewListItem>(`/admin/reviews/${id}/visibility`, {
    method: "PATCH",
    body: JSON.stringify({ isHidden }),
  });
}

export function listDiscounts(query: string) {
  return apiFetch<Paginated<Coupon>>(`/admin/discounts?${query}`);
}

export function getDiscount(id: string) {
  return apiFetch<Coupon>(`/admin/discounts/${id}`);
}

export function createDiscount(input: CouponInput) {
  return apiFetch<Coupon>("/admin/discounts", { method: "POST", body: JSON.stringify(input) });
}

export function updateDiscount(id: string, input: Partial<CouponInput>) {
  return apiFetch<Coupon>(`/admin/discounts/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteDiscount(id: string) {
  return apiFetch<Coupon>(`/admin/discounts/${id}`, { method: "DELETE" });
}

export function listMyAttendance(query: string) {
  return apiFetch<Paginated<AttendanceEntry>>(`/admin/attendance/me?${query}`);
}

export function clockIn() {
  return apiFetch<AttendanceEntry>("/admin/attendance/clock-in", { method: "POST" });
}

export function clockOut() {
  return apiFetch<AttendanceEntry>("/admin/attendance/clock-out", { method: "POST" });
}

export function getSalesAnalytics(query: string) {
  return apiFetch<SalesAnalytics>(`/admin/analytics/sales?${query}`);
}

export function getProductAnalytics(query: string) {
  return apiFetch<ProductAnalytics>(`/admin/analytics/products?${query}`);
}

export function getCustomerAnalytics() {
  return apiFetch<CustomerAnalytics>("/admin/analytics/customers");
}

export function getReturnsRateAnalytics(query: string) {
  return apiFetch<ReturnsRateAnalytics>(`/admin/analytics/returns-rate?${query}`);
}

export function getWishlistTopProducts() {
  return apiFetch<{ items: WishlistTopProduct[] }>("/admin/engagement/wishlist-top-products");
}

export function getWishlistConversion() {
  return apiFetch<WishlistConversion>("/admin/engagement/wishlist-conversion");
}

export function getReviewEngagement(query: string) {
  return apiFetch<ReviewEngagement>(`/admin/engagement/review-engagement?${query}`);
}

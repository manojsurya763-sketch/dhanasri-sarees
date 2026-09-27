export interface Product {
  id: string;
  title: string;
  sku: string;
  slug: string;
  categoryId: string | null;
  occasionTag: string | null;
  mrp: string;
  price: string;
  discountPct: number;
  description: string | null;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  fabric: string | null;
  colour: string | null;
  origin: string | null;
  zari: string | null;
  loom: string | null;
  work: string | null;
  length: string | null;
  blouseTypes: string[];
  internationalShipping: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  title: string;
  sku: string;
  slug?: string;
  categoryId: string | null;
  occasionTag: string | null;
  mrp: number;
  price: number;
  discountPct: number;
  description: string | null;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  fabric: string | null;
  colour: string | null;
  origin: string | null;
  zari: string | null;
  loom: string | null;
  work: string | null;
  length: string | null;
  blouseTypes: string[];
  internationalShipping: boolean;
}

export type OrderStatus = "created" | "paid" | "failed" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface OrderListItem {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  user: { phone: string; name: string | null };
  items: { product: { title: string; images: string[] } }[];
  _count: { items: number };
}

export interface OrderStats {
  totalOrders: number;
  statusCounts: Record<OrderStatus, number>;
  totalRevenue: number;
  returnsCount: number;
}

export interface OrderListResponse extends Paginated<OrderListItem> {
  stats: OrderStats;
}

export interface OrderDetail {
  id: string;
  status: OrderStatus;
  totalMrp: string;
  discount: string;
  shipping: string;
  totalAmount: string;
  couponCode: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  createdAt: string;
  user: { id: string; phone: string; name: string | null; email: string | null };
  items: {
    id: string;
    qty: number;
    priceAtPurchase: string;
    product: { title: string; images: string[]; slug: string };
  }[];
  history: OrderStatusHistoryEntry[];
  returns: OrderReturnEntry[];
}

export interface OrderReturnEntry {
  id: string;
  qty: number;
  reason: string;
  status: ReturnStatus;
  refundAmount?: string;
  createdAt: string;
  orderItem: { product: { title: string } } | null;
}

export interface OrderStatusHistoryEntry {
  id: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  note: string | null;
  createdAt: string;
  changedByStaff: { name: string | null; email: string } | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  occasionTag: string | null;
  description: string | null;
}

export interface DashboardStats {
  products: {
    total: number;
    active: number;
    inactive: number;
    lowStock: number;
    outOfStock: number;
  };
  ordersByStatus: Record<OrderStatus, number>;
  revenue: number;
  recentOrders: OrderListItem[];
}

export type StaffRole = "super_admin" | "admin" | "employee";

export interface StaffMember {
  id: string;
  email: string;
  name: string | null;
  role: StaffRole;
  isActive: boolean;
  createdAt: string;
}

export interface CreateStaffInput {
  email: string;
  password: string;
  name?: string;
  role: StaffRole;
}

export interface CustomerListItem {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  orderCount: number;
}

export interface CustomerOrderSummary {
  id: string;
  status: OrderStatus;
  totalAmount?: string; // omitted in the Employee response
  createdAt: string;
}

export interface CustomerDetail {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  reviewCount: number;
  wishlistCount: number;
  orders: CustomerOrderSummary[];
}

export interface CustomerSpendSummary {
  lifetimeValue: number;
  avgOrderValue: number;
  orderCount: number;
  lastOrderAt: string | null;
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string | null;
}

export type ReturnStatus = "requested" | "processing" | "approved" | "rejected";

export interface ReturnListItem {
  id: string;
  orderId: string;
  orderItemId: string | null;
  qty: number;
  reason: string;
  status: ReturnStatus;
  refundAmount?: string; // omitted in the Employee response
  createdAt: string;
  order: { id: string };
  user: { phone: string; name: string | null };
}

export interface ReturnDetail {
  id: string;
  orderId: string;
  orderItemId: string | null;
  qty: number;
  reason: string;
  status: ReturnStatus;
  refundAmount?: string; // omitted in the Employee response
  createdAt: string;
  order: { id: string; status: OrderStatus };
  orderItem: {
    id: string;
    productId: string;
    qty: number;
    priceAtPurchase: string;
    product: { title: string; images: string[] };
  } | null;
  user: { id: string; phone: string; name: string | null };
  processedByStaff: { id: string; name: string | null; email: string } | null;
  approvedByStaff: { id: string; name: string | null; email: string } | null;
}

export interface CreateReturnInput {
  orderId: string;
  orderItemId?: string | null;
  qty: number;
  reason: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Coupon {
  id: string;
  code: string;
  pctOff: number;
  maxOff: string;
  minPurchase: string;
  isActive: boolean;
  usageLimit: number | null;
  timesUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponInput {
  code: string;
  pctOff: number;
  maxOff: number;
  minPurchase: number;
  isActive: boolean;
  usageLimit?: number | null;
}

export interface ReviewListItem {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  isHidden: boolean;
  staffResponse: string | null;
  staffResponseAt: string | null;
  createdAt: string;
  product: { title: string; slug: string };
  user: { phone: string; name: string | null };
}

export interface Paginated<T> {
  items: T[];
  pagination: { total: number; page: number; pageSize: number };
}

export interface AttendanceEntry {
  id: string;
  staffId: string;
  clockInAt: string;
  clockOutAt: string | null;
  createdAt: string;
}

export interface SalesAnalytics {
  dateFrom: string;
  dateTo: string;
  totalRevenue: number;
  totalOrders: number;
  days: { date: string; revenue: number; orders: number }[];
}

export interface ProductAnalyticsRow {
  productId: string;
  title: string;
  units: number;
  revenue: number;
}

export interface ProductAnalytics {
  dateFrom: string;
  dateTo: string;
  topByRevenue: ProductAnalyticsRow[];
  topByUnits: ProductAnalyticsRow[];
}

export interface CustomerAnalytics {
  totalCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
}

export interface ReturnsRateAnalytics {
  dateFrom: string;
  dateTo: string;
  orders: number;
  returns: number;
  returnsRate: number;
}

export interface WishlistTopProduct {
  productId: string;
  title: string;
  wishlistCount: number;
}

export interface WishlistConversion {
  totalWishlisted: number;
  converted: number;
  conversionRate: number;
}

export interface ReviewEngagement {
  dateFrom: string;
  dateTo: string;
  totalReviews: number;
  avgRating: number;
  days: { date: string; count: number; avgRating: number }[];
}

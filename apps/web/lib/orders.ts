export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface OrderReturnSummary {
  id: string;
  qty: number;
  reason: string;
  status: "requested" | "processing" | "approved" | "rejected";
  refundAmount: string | null;
  createdAt: string;
  orderItemId: string | null;
}

export interface OrderDetail {
  id: string;
  status: string;
  totalMrp: string;
  discount: string;
  shipping: string;
  totalAmount: string;
  couponCode: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  createdAt: string;
  items: {
    id: string;
    qty: number;
    priceAtPurchase: string;
    product: { title: string; images: string[]; slug: string };
  }[];
  returns: OrderReturnSummary[];
}

export interface Paginated<T> {
  items: T[];
  pagination: { total: number; page: number; pageSize: number };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function createOrder(
  items: { productId: string; qty: number }[],
  couponCode: string | null,
  token: string
): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items, couponCode: couponCode ?? undefined }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Could not start checkout, please try again");
  return data as CreateOrderResponse;
}

export async function getOrder(orderId: string): Promise<OrderDetail> {
  const res = await fetch(`${API_URL}/orders/${orderId}`);
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

export async function listMyOrders(token: string, page = 1, limit = 10): Promise<Paginated<OrderDetail>> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_URL}/orders?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Could not load your orders");
  return data as Paginated<OrderDetail>;
}

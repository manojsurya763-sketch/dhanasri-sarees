export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface OrderDetail {
  id: string;
  status: string;
  totalMrp: string;
  discount: string;
  shipping: string;
  totalAmount: string;
  couponCode: string | null;
  createdAt: string;
  items: {
    id: string;
    qty: number;
    priceAtPurchase: string;
    product: { title: string; images: string[]; slug: string };
  }[];
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

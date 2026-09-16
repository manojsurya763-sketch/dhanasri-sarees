export interface Coupon {
  code: string;
  pctOff: number;
  maxOff: number;
  minPurchase: number;
}

// Temporary local coupon table until POST /cart/apply-coupon (Prompt 11) is live.
export const COUPONS: Coupon[] = [
  { code: "DHANASRI10", pctOff: 10, maxOff: 1000, minPurchase: 2000 },
  { code: "DHANASRI15", pctOff: 15, maxOff: 1500, minPurchase: 5000 },
  { code: "DHANASRI20", pctOff: 20, maxOff: 2500, minPurchase: 10000 },
];

export function findCoupon(code: string) {
  return COUPONS.find((c) => c.code === code.trim().toUpperCase());
}

export function computeCouponDiscount(coupon: Coupon | undefined, subtotal: number) {
  if (!coupon || subtotal < coupon.minPurchase) return 0;
  return Math.min(Math.round((subtotal * coupon.pctOff) / 100), coupon.maxOff);
}

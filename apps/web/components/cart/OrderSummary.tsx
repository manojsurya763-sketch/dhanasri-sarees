import { formatCurrency } from "@/lib/formatCurrency";

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 99;

export function OrderSummary({
  totalMrp,
  totalPrice,
  couponDiscount,
}: {
  totalMrp: number;
  totalPrice: number;
  couponDiscount: number;
}) {
  const discountOnMrp = totalMrp - totalPrice;
  const payable = totalPrice - couponDiscount;
  const shipping = payable >= FREE_SHIPPING_THRESHOLD || payable === 0 ? 0 : SHIPPING_FEE;
  const total = payable + shipping;

  return (
    <div className="rounded-2xl border border-maroon-500/10 bg-cream-50 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-maroon-900/60">
        Order Summary
      </h3>

      <dl className="mt-4 space-y-2 text-sm text-maroon-900/80">
        <div className="flex justify-between">
          <dt>Total MRP</dt>
          <dd>{formatCurrency(totalMrp)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Discount on MRP</dt>
          <dd className="text-purple-600">-{formatCurrency(discountOnMrp)}</dd>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between">
            <dt>Coupon Discount</dt>
            <dd className="text-purple-600">-{formatCurrency(couponDiscount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatCurrency(shipping)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex justify-between border-t border-maroon-500/10 pt-4 text-base font-semibold text-maroon-900">
        <span>Total Amount</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

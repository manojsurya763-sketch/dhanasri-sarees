import type { Cart, CartItem, Coupon, Product } from "@prisma/client";

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 99;

type CartWithItems = Cart & { items: (CartItem & { product: Product })[] };

export function summarizeCart(cart: CartWithItems, coupon: Coupon | null) {
  const totalMrp = cart.items.reduce((sum, i) => sum + Number(i.product.mrp) * i.qty, 0);
  const totalPrice = cart.items.reduce((sum, i) => sum + Number(i.product.price) * i.qty, 0);

  let couponDiscount = 0;
  if (coupon && totalPrice >= Number(coupon.minPurchase)) {
    couponDiscount = Math.min(Math.round((totalPrice * coupon.pctOff) / 100), Number(coupon.maxOff));
  }

  const payable = totalPrice - couponDiscount;
  const shipping = payable === 0 || payable >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const totalAmount = payable + shipping;

  return {
    totalMrp,
    totalPrice,
    discountOnMrp: totalMrp - totalPrice,
    couponDiscount,
    shipping,
    totalAmount,
  };
}

"use client";

import { BadgePercent } from "lucide-react";
import { COUPONS } from "@/lib/coupons";
import { formatCurrency } from "@/lib/formatCurrency";

export function CouponSuggestions({ onApply }: { onApply: (code: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {COUPONS.map((coupon) => (
        <button
          key={coupon.code}
          onClick={() => onApply(coupon.code)}
          className="flex items-start gap-3 rounded-xl border border-gold-500/40 bg-gold-500/10 p-4 text-left transition-colors hover:bg-gold-500/20"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-50 text-maroon-500">
            <BadgePercent className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-maroon-900">
              SAVE {coupon.pctOff}% with {coupon.code}
            </span>
            <span className="mt-0.5 block text-xs text-maroon-900/60">
              {coupon.pctOff}% Off up to {formatCurrency(coupon.maxOff)} for Min. purchase of{" "}
              {formatCurrency(coupon.minPurchase)}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

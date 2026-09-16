"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { findCoupon } from "@/lib/coupons";

const SUGGESTIONS = ["DHANASRI10", "DHANASRI15", "DHANASRI20"];

export function PromoCodeBox({
  appliedCode,
  onApply,
  onClear,
}: {
  appliedCode: string | null;
  onApply: (code: string) => void;
  onClear: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleApply() {
    const coupon = findCoupon(value);
    if (!coupon) {
      setError("Invalid promo code");
      return;
    }
    setError(null);
    onApply(coupon.code);
    setValue("");
  }

  return (
    <div className="rounded-2xl border border-maroon-500/10 bg-cream-50 p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((code) => (
          <span key={code} className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-medium text-gold-600">
            SAVE with {code}
          </span>
        ))}
      </div>

      {appliedCode ? (
        <div className="flex items-center justify-between rounded-lg bg-maroon-50 px-4 py-2.5 text-sm text-maroon-900">
          <span>
            Applied: <strong>{appliedCode}</strong>
          </span>
          <button onClick={onClear} className="text-xs font-medium text-maroon-500 hover:underline">
            Remove
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Enter promo code"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleApply} size="sm">
            Apply
          </Button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-maroon-900/50">
        Try: {SUGGESTIONS.join(", ")}
      </p>
    </div>
  );
}

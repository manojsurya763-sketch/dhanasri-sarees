"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDiscount, updateDiscount } from "@/lib/api";
import type { Coupon } from "@/lib/types";

interface DiscountFormProps {
  coupon?: Coupon;
}

export function DiscountForm({ coupon }: DiscountFormProps) {
  const router = useRouter();
  const [code, setCode] = useState(coupon?.code ?? "");
  const [pctOff, setPctOff] = useState(String(coupon?.pctOff ?? ""));
  const [maxOff, setMaxOff] = useState(coupon?.maxOff ?? "");
  const [minPurchase, setMinPurchase] = useState(coupon?.minPurchase ?? "");
  const [isActive, setIsActive] = useState(coupon?.isActive ?? true);
  const [usageLimit, setUsageLimit] = useState(coupon?.usageLimit != null ? String(coupon.usageLimit) : "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      code,
      pctOff: Number(pctOff),
      maxOff: Number(maxOff),
      minPurchase: Number(minPurchase),
      isActive,
      usageLimit: usageLimit.trim() ? Number(usageLimit) : null,
    };

    try {
      if (coupon) {
        await updateDiscount(coupon.id, payload);
      } else {
        await createDiscount(payload);
      }
      router.push("/discounts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save discount");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Code <span className="text-red-500">*</span>
        </label>
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Discount % <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="number"
          min="1"
          max="100"
          value={pctOff}
          onChange={(e) => setPctOff(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Max discount amount (₹) <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="number"
          min="0"
          step="0.01"
          value={maxOff}
          onChange={(e) => setMaxOff(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Minimum purchase (₹) <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="number"
          min="0"
          step="0.01"
          value={minPurchase}
          onChange={(e) => setMinPurchase(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Usage limit (optional)</label>
        <input
          type="number"
          min="1"
          value={usageLimit}
          onChange={(e) => setUsageLimit(e.target.value)}
          placeholder="Unlimited"
          className={inputClass}
        />
        {coupon && (
          <p className="mt-1 text-xs text-slate-500">Used {coupon.timesUsed} time(s) so far.</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Active
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {submitting ? "Saving…" : coupon ? "Save changes" : "Create discount"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";

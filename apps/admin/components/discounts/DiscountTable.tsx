"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { deleteDiscount, listDiscounts, updateDiscount } from "@/lib/api";
import type { Coupon } from "@/lib/types";

export function DiscountTable() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;

  const fetchDiscounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
    if (isActive) params.set("isActive", isActive);
    try {
      const data = await listDiscounts(params.toString());
      setItems(data.items);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load discounts");
    } finally {
      setLoading(false);
    }
  }, [page, isActive]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  async function toggleActive(coupon: Coupon) {
    if (coupon.isActive) {
      await deleteDiscount(coupon.id);
    } else {
      await updateDiscount(coupon.id, { isActive: true });
    }
    fetchDiscounts();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={isActive}
          onChange={(e) => {
            setPage(1);
            setIsActive(e.target.value as "" | "true" | "false");
          }}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <Link
          href="/discounts/new"
          className="ml-auto rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          + New discount
        </Link>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Code</th>
              <th className="px-4 py-2 font-medium">% Off</th>
              <th className="px-4 py-2 font-medium">Max off</th>
              <th className="px-4 py-2 font-medium">Min purchase</th>
              <th className="px-4 py-2 font-medium">Usage</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  No discounts found.
                </td>
              </tr>
            ) : (
              items.map((coupon) => (
                <tr key={coupon.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2 font-medium text-slate-900">{coupon.code}</td>
                  <td className="px-4 py-2 text-slate-700">{coupon.pctOff}%</td>
                  <td className="px-4 py-2 text-slate-700">₹{coupon.maxOff}</td>
                  <td className="px-4 py-2 text-slate-700">₹{coupon.minPurchase}</td>
                  <td className="px-4 py-2 text-slate-700">
                    {coupon.timesUsed}
                    {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        coupon.isActive
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                          : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
                      }
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/discounts/${coupon.id}/edit`} className="mr-3 text-slate-600 hover:text-slate-900">
                      Edit
                    </Link>
                    <button onClick={() => toggleActive(coupon)} className="text-slate-600 hover:text-slate-900">
                      {coupon.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > pageSize && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {page} of {Math.ceil(total / pageSize)}
          </span>
          <div className="space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

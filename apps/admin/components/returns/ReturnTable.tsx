"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { listReturns } from "@/lib/api";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import type { ReturnListItem, ReturnStatus } from "@/lib/types";
import { ReturnStatusBadge } from "@/components/returns/ReturnStatusBadge";

const STATUS_OPTIONS: ReturnStatus[] = ["requested", "processing", "approved", "rejected"];

export function ReturnTable() {
  const role = useAdminAuthStore((s) => s.role);
  const canCreate = role === "super_admin" || role === "admin";

  const [items, setItems] = useState<ReturnListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ReturnStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
    if (status) params.set("status", status);
    try {
      const data = await listReturns(params.toString());
      setItems(data.items);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load returns");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const showAmountColumn = items.some((r) => r.refundAmount !== undefined);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as ReturnStatus | "");
          }}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {canCreate && (
          <Link
            href="/returns/new"
            className="ml-auto rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Log return
          </Link>
        )}
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Return</th>
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Reason</th>
              {showAmountColumn && <th className="px-4 py-2 font-medium">Refund</th>}
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Logged</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No returns found.
                </td>
              </tr>
            ) : (
              items.map((ret) => (
                <tr key={ret.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2">
                    <Link href={`/returns/${ret.id}`} className="font-medium text-slate-900 hover:underline">
                      {ret.id.slice(0, 8)}…
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-slate-600">{ret.user.name ?? ret.user.phone}</td>
                  <td className="px-4 py-2 text-slate-600">{ret.reason}</td>
                  {showAmountColumn && (
                    <td className="px-4 py-2 text-slate-700">
                      {ret.refundAmount !== undefined ? `₹${ret.refundAmount}` : "—"}
                    </td>
                  )}
                  <td className="px-4 py-2">
                    <ReturnStatusBadge status={ret.status} />
                  </td>
                  <td className="px-4 py-2 text-slate-500">{new Date(ret.createdAt).toLocaleDateString()}</td>
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

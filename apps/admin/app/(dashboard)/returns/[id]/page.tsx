"use client";

import { use, useEffect, useState } from "react";
import { getReturn, updateReturnStatus } from "@/lib/api";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import type { ReturnDetail, ReturnStatus } from "@/lib/types";
import { ReturnStatusBadge } from "@/components/returns/ReturnStatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

const STAFF_ALLOWED: Record<ReturnStatus, ReturnStatus[]> = {
  requested: ["processing"],
  processing: [],
  approved: [],
  rejected: [],
};

const SUPER_ADMIN_ALLOWED: Record<ReturnStatus, ReturnStatus[]> = {
  requested: ["processing", "approved", "rejected"],
  processing: ["approved", "rejected"],
  approved: [],
  rejected: [],
};

export default function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const role = useAdminAuthStore((s) => s.role);
  const isSuperAdmin = role === "super_admin";

  const [ret, setRet] = useState<ReturnDetail | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  function load() {
    getReturn(id)
      .then(setRet)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load return"));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(next: ReturnStatus) {
    setUpdating(true);
    setError(null);
    try {
      const amount = next === "approved" ? Number(refundAmount) : undefined;
      if (next === "approved" && (!amount || amount <= 0)) {
        setError("Enter a refund amount to approve this return");
        setUpdating(false);
        return;
      }
      const updated = await updateReturnStatus(id, next, amount);
      setRet(updated);
      setRefundAmount("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    } finally {
      setUpdating(false);
    }
  }

  if (error && !ret) return <ErrorState message={error} />;
  if (!ret) return <LoadingState />;

  const nextOptions = (isSuperAdmin ? SUPER_ADMIN_ALLOWED : STAFF_ALLOWED)[ret.status];

  return (
    <div className="max-w-3xl">
      <PageHeader title={`Return ${ret.id}`} backHref="/returns" action={<ReturnStatusBadge status={ret.status} />} />

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mb-6 grid grid-cols-2 gap-6 rounded-md border border-slate-200 bg-white p-4 text-sm">
        <div>
          <p className="font-medium text-slate-900">Customer</p>
          <p className="text-slate-600">{ret.user.name ?? "—"}</p>
          <p className="text-slate-600">{ret.user.phone}</p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Order</p>
          <p className="text-slate-600">
            Order {ret.orderId.slice(0, 8)}… ({ret.order.status})
          </p>
          <p className="text-slate-600">Qty: {ret.qty}</p>
          {ret.refundAmount !== undefined && <p className="text-slate-600">Refund: ₹{ret.refundAmount ?? "—"}</p>}
        </div>
      </div>

      <div className="mb-6 rounded-md border border-slate-200 bg-white p-4 text-sm">
        <p className="font-medium text-slate-900">Reason</p>
        <p className="mt-1 text-slate-600">{ret.reason}</p>
        {ret.orderItem && (
          <p className="mt-2 text-slate-600">
            Item: {ret.orderItem.product.title} (qty {ret.orderItem.qty} purchased)
          </p>
        )}
        {!ret.orderItem && <p className="mt-2 text-slate-500">Whole-order return</p>}
      </div>

      {(ret.processedByStaff || ret.approvedByStaff) && (
        <div className="mb-6 rounded-md border border-slate-200 bg-white p-4 text-sm">
          <p className="font-medium text-slate-900">History</p>
          {ret.processedByStaff && (
            <p className="mt-1 text-slate-600">Processed by {ret.processedByStaff.name ?? ret.processedByStaff.email}</p>
          )}
          {ret.approvedByStaff && (
            <p className="text-slate-600">Decided by {ret.approvedByStaff.name ?? ret.approvedByStaff.email}</p>
          )}
        </div>
      )}

      {nextOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-700">Update status:</span>
          {nextOptions.includes("approved") && (
            <input
              type="number"
              min="1"
              placeholder="Refund ₹"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-28 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
          )}
          {nextOptions.map((option) => (
            <button
              key={option}
              disabled={updating}
              onClick={() => handleStatusChange(option)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm capitalize hover:bg-slate-100 disabled:opacity-50"
            >
              Mark {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

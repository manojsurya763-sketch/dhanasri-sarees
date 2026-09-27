"use client";

import { useCallback, useEffect, useState } from "react";
import { listReviews, respondToReview, setReviewVisibility } from "@/lib/api";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import type { ReviewListItem } from "@/lib/types";

export function ReviewTable() {
  const role = useAdminAuthStore((s) => s.role);
  const isSuperAdmin = role === "super_admin";

  const [items, setItems] = useState<ReviewListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
    try {
      const data = await listReviews(params.toString());
      setItems(data.items);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleToggleVisibility(review: ReviewListItem) {
    try {
      await setReviewVisibility(review.id, !review.isHidden);
      fetchReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update visibility");
    }
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-400">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((review) => (
            <ReviewRow
              key={review.id}
              review={review}
              isSuperAdmin={isSuperAdmin}
              onToggleVisibility={() => handleToggleVisibility(review)}
              onResponded={fetchReviews}
            />
          ))}
        </div>
      )}

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

function ReviewRow({
  review,
  isSuperAdmin,
  onToggleVisibility,
  onResponded,
}: {
  review: ReviewListItem;
  isSuperAdmin: boolean;
  onToggleVisibility: () => void;
  onResponded: () => void;
}) {
  const [response, setResponse] = useState(review.staffResponse ?? "");
  const [saving, setSaving] = useState(false);

  async function handleRespond() {
    if (!response.trim()) return;
    setSaving(true);
    try {
      await respondToReview(review.id, response.trim());
      onResponded();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`rounded-md border bg-white p-4 ${review.isHidden ? "border-slate-200 opacity-60" : "border-slate-200"}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">{review.product.title}</p>
          <p className="text-xs text-slate-500">
            {review.user.name ?? review.user.phone} · {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)} · {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {review.isHidden && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Hidden</span>
          )}
          {isSuperAdmin && (
            <button onClick={onToggleVisibility} className="text-xs font-medium text-slate-600 hover:text-slate-900">
              {review.isHidden ? "Show" : "Hide"}
            </button>
          )}
        </div>
      </div>

      {review.comment && <p className="mt-2 text-sm text-slate-700">{review.comment}</p>}

      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write a response…"
          rows={2}
          className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <button
          onClick={handleRespond}
          disabled={saving || !response.trim()}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Respond"}
        </button>
      </div>
      {review.staffResponseAt && (
        <p className="mt-1 text-xs text-slate-400">
          Last responded {new Date(review.staffResponseAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

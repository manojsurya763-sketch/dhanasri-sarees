"use client";

import { useCallback, useEffect, useState } from "react";
import { clockIn, clockOut, listMyAttendance } from "@/lib/api";
import type { AttendanceEntry } from "@/lib/types";

export function AttendanceClock() {
  const [items, setItems] = useState<AttendanceEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
    try {
      const data = await listMyAttendance(params.toString());
      setItems(data.items);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const openEntry = page === 1 ? items.find((e) => e.clockOutAt === null) : undefined;

  async function handleClockIn() {
    setActing(true);
    setError(null);
    try {
      await clockIn();
      await fetchEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not clock in");
    } finally {
      setActing(false);
    }
  }

  async function handleClockOut() {
    setActing(true);
    setError(null);
    try {
      await clockOut();
      await fetchEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not clock out");
    } finally {
      setActing(false);
    }
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="mb-6 flex items-center gap-4 rounded-md border border-slate-200 bg-white p-4">
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : openEntry ? (
          <>
            <div>
              <p className="text-sm font-medium text-slate-900">Clocked in</p>
              <p className="text-xs text-slate-500">Since {new Date(openEntry.clockInAt).toLocaleTimeString()}</p>
            </div>
            <button
              onClick={handleClockOut}
              disabled={acting}
              className="ml-auto rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {acting ? "Clocking out…" : "Clock out"}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-500">You are not clocked in.</p>
            <button
              onClick={handleClockIn}
              disabled={acting}
              className="ml-auto rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {acting ? "Clocking in…" : "Clock in"}
            </button>
          </>
        )}
      </div>

      <h2 className="mb-2 text-sm font-semibold text-slate-900">History</h2>

      {!loading && items.length === 0 ? (
        <p className="text-sm text-slate-400">No attendance entries yet.</p>
      ) : (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Clock in</th>
                <th className="px-4 py-2">Clock out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-2 text-slate-700">{new Date(entry.clockInAt).toLocaleString()}</td>
                  <td className="px-4 py-2 text-slate-700">
                    {entry.clockOutAt ? new Date(entry.clockOutAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

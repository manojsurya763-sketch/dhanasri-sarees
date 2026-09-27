"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

function StatCard({ label, value, href }: { label: string; value: string | number; href?: string }) {
  const content = (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="block transition hover:border-slate-300 hover:shadow-sm">
      {content}
    </Link>
  ) : (
    content
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load dashboard"));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!stats) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Dashboard" />

      <section className="mb-8">
        <p className="mb-3 text-sm font-semibold text-slate-700">Products</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total" value={stats.products.total} href="/products" />
          <StatCard label="Active" value={stats.products.active} href="/products" />
          <StatCard label="Low stock" value={stats.products.lowStock} href="/inventory" />
          <StatCard label="Out of stock" value={stats.products.outOfStock} href="/inventory" />
        </div>
      </section>

      <section className="mb-8">
        <p className="mb-3 text-sm font-semibold text-slate-700">Orders by status</p>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <Link
              key={status}
              href={`/orders?status=${status}`}
              className="rounded-md border border-slate-200 bg-white p-3 text-center transition hover:border-slate-300 hover:shadow-sm"
            >
              <p className="text-xl font-semibold text-slate-900">{count}</p>
              <p className="mt-1 text-xs capitalize text-slate-500">{status}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <p className="mb-3 text-sm font-semibold text-slate-700">Revenue</p>
        <div className="max-w-xs">
          <StatCard label="Total captured" value={`₹${stats.revenue.toLocaleString("en-IN")}`} />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Sum of paid, shipped and delivered orders — excludes unpaid, failed, cancelled and refunded orders.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Recent orders</p>
          <Link href="/orders" className="text-xs font-medium text-slate-500 hover:text-slate-900">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">Order</th>
                <th className="px-4 py-2 font-medium">Customer</th>
                <th className="px-4 py-2 font-medium">Total</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Placed</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2">
                      <Link href={`/orders/${order.id}`} className="font-medium text-slate-900 hover:underline">
                        {order.id.slice(0, 8)}…
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-slate-600">{order.user.name ?? order.user.phone}</td>
                    <td className="px-4 py-2 text-slate-700">₹{order.totalAmount}</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-2 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

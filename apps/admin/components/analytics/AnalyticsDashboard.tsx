"use client";

import { useEffect, useState } from "react";
import { getCustomerAnalytics, getProductAnalytics, getReturnsRateAnalytics, getSalesAnalytics } from "@/lib/api";
import type { CustomerAnalytics, ProductAnalytics, ReturnsRateAnalytics, SalesAnalytics } from "@/lib/types";

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function SalesChart({ sales }: { sales: SalesAnalytics }) {
  const maxRevenue = Math.max(1, ...sales.days.map((d) => d.revenue));

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      {sales.days.length === 0 ? (
        <p className="text-sm text-slate-400">No revenue in this period.</p>
      ) : (
        <div className="flex h-40 items-end gap-1">
          {sales.days.map((day) => (
            <div key={day.date} className="group relative flex-1" title={`${day.date}: ₹${day.revenue.toLocaleString("en-IN")}`}>
              <div
                className="w-full rounded-t bg-slate-700 transition group-hover:bg-slate-900"
                style={{ height: `${Math.max(4, (day.revenue / maxRevenue) * 100)}%` }}
              />
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-slate-400">
        {new Date(sales.dateFrom).toLocaleDateString()} – {new Date(sales.dateTo).toLocaleDateString()}
      </p>
    </div>
  );
}

function ProductTable({ title, rows, metric }: { title: string; rows: ProductAnalytics["topByRevenue"]; metric: "revenue" | "units" }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700">{title}</p>
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Units</th>
              <th className="px-4 py-2">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-slate-400">
                  No sales in this period.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.productId} className={metric === "revenue" ? "font-medium" : undefined}>
                  <td className="px-4 py-2 text-slate-800">{row.title}</td>
                  <td className="px-4 py-2 text-slate-600">{row.units}</td>
                  <td className="px-4 py-2 text-slate-600">₹{row.revenue.toLocaleString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AnalyticsDashboard() {
  const [sales, setSales] = useState<SalesAnalytics | null>(null);
  const [products, setProducts] = useState<ProductAnalytics | null>(null);
  const [customers, setCustomers] = useState<CustomerAnalytics | null>(null);
  const [returnsRate, setReturnsRate] = useState<ReturnsRateAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getSalesAnalytics(""), getProductAnalytics(""), getCustomerAnalytics(), getReturnsRateAnalytics("")])
      .then(([s, p, c, r]) => {
        setSales(s);
        setProducts(p);
        setCustomers(c);
        setReturnsRate(r);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load analytics"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!sales || !products || !customers || !returnsRate) return <p className="text-sm text-slate-400">Loading…</p>;

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-3 text-sm font-semibold text-slate-700">Sales (last 30 days)</p>
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Revenue" value={`₹${sales.totalRevenue.toLocaleString("en-IN")}`} />
          <StatCard label="Orders" value={sales.totalOrders} />
          <StatCard label="Repeat customers" value={`${(customers.repeatRate * 100).toFixed(0)}%`} hint={`${customers.repeatCustomers} of ${customers.totalCustomers}`} />
          <StatCard label="Returns rate" value={`${(returnsRate.returnsRate * 100).toFixed(0)}%`} hint={`${returnsRate.returns} of ${returnsRate.orders} orders`} />
        </div>
        <SalesChart sales={sales} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ProductTable title="Top products by revenue" rows={products.topByRevenue} metric="revenue" />
        <ProductTable title="Top products by units" rows={products.topByUnits} metric="units" />
      </section>
    </div>
  );
}

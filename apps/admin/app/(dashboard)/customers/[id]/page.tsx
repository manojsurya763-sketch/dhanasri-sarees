"use client";

import { use, useEffect, useState } from "react";
import {
  deactivateCustomer,
  getCustomer,
  getCustomerSpendSummary,
  reactivateCustomer,
  updateCustomer,
} from "@/lib/api";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { CustomerDetail, CustomerSpendSummary } from "@/lib/types";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const role = useAdminAuthStore((s) => s.role);
  const isSuperAdmin = role === "super_admin";

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [spend, setSpend] = useState<CustomerSpendSummary | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    getCustomer(id)
      .then((c) => {
        setCustomer(c);
        setName(c.name ?? "");
        setEmail(c.email ?? "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load customer"));
    if (isSuperAdmin) {
      getCustomerSpendSummary(id)
        .then(setSpend)
        .catch(() => {});
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await updateCustomer(id, { name: name || undefined, email: email || null });
      setCustomer((c) => (c ? { ...c, name: updated.name, email: updated.email } : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive() {
    if (!customer) return;
    setError(null);
    try {
      const updated = customer.isActive ? await deactivateCustomer(id) : await reactivateCustomer(id);
      setCustomer((c) => (c ? { ...c, isActive: updated.isActive } : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    }
  }

  if (error && !customer) return <ErrorState message={error} />;
  if (!customer) return <LoadingState />;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={customer.name ?? customer.phone}
        backHref="/customers"
        action={
          <span
            className={
              customer.isActive
                ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
            }
          >
            {customer.isActive ? "Active" : "Inactive"}
          </span>
        }
      />

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mb-6 grid grid-cols-2 gap-6 rounded-md border border-slate-200 bg-white p-4 text-sm">
        <div>
          <p className="font-medium text-slate-900">Profile</p>
          <p className="text-slate-600">Phone: {customer.phone}</p>
          <p className="text-slate-600">Joined: {new Date(customer.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Activity</p>
          <p className="text-slate-600">Reviews: {customer.reviewCount}</p>
          <p className="text-slate-600">Wishlist items: {customer.wishlistCount}</p>
        </div>
      </div>

      {isSuperAdmin && spend && (
        <div className="mb-6 grid grid-cols-4 gap-4 rounded-md border border-slate-200 bg-white p-4 text-sm">
          <div>
            <p className="text-xs text-slate-500">Lifetime value</p>
            <p className="text-lg font-semibold text-slate-900">₹{spend.lifetimeValue.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg order value</p>
            <p className="text-lg font-semibold text-slate-900">₹{Math.round(spend.avgOrderValue).toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Orders</p>
            <p className="text-lg font-semibold text-slate-900">{spend.orderCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Last order</p>
            <p className="text-lg font-semibold text-slate-900">
              {spend.lastOrderAt ? new Date(spend.lastOrderAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 rounded-md border border-slate-200 bg-white">
        <p className="border-b border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Order history</p>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Order</th>
              <th className="px-4 py-2 font-medium">Status</th>
              {customer.orders[0]?.totalAmount !== undefined && <th className="px-4 py-2 font-medium">Total</th>}
              <th className="px-4 py-2 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody>
            {customer.orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No orders yet.
                </td>
              </tr>
            ) : (
              customer.orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2 text-slate-900">{order.id.slice(0, 8)}…</td>
                  <td className="px-4 py-2 capitalize text-slate-600">{order.status}</td>
                  {order.totalAmount !== undefined && <td className="px-4 py-2 text-slate-700">₹{order.totalAmount}</td>}
                  <td className="px-4 py-2 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isSuperAdmin && (
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="mb-3 text-sm font-medium text-slate-700">Manage account</p>
          <form onSubmit={handleSave} className="mb-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
          <button
            onClick={handleToggleActive}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            {customer.isActive ? "Deactivate account" : "Reactivate account"}
          </button>
        </div>
      )}
    </div>
  );
}

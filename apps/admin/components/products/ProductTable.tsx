"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { deleteProduct, listProducts, updateProduct, updateProductStock } from "@/lib/api";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import type { Product } from "@/lib/types";

interface ProductTableProps {
  // Sorts by stock ascending and hides the search/status filters — used by
  // the Inventory page so low/out-of-stock products surface first.
  pinnedLowStock?: boolean;
}

export function ProductTable({ pinnedLowStock }: ProductTableProps) {
  const role = useAdminAuthStore((s) => s.role);
  const isEmployee = role === "employee";
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
    if (search) params.set("search", search);
    if (isActive) params.set("isActive", isActive);
    if (pinnedLowStock) {
      params.set("isActive", "true");
      params.set("sort", "stock_asc");
    }
    try {
      const data = await listProducts(params.toString());
      setItems(data.items);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search, isActive, pinnedLowStock]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function toggleActive(product: Product) {
    if (product.isActive) {
      await deleteProduct(product.id);
    } else {
      await updateProduct(product.id, { isActive: true });
    }
    fetchProducts();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Search by title or SKU"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        {!pinnedLowStock && (
          <>
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
            {!isEmployee && (
              <Link
                href="/products/new"
                className="ml-auto rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                + New product
              </Link>
            )}
          </>
        )}
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Product</th>
              <th className="px-4 py-2 font-medium">SKU</th>
              <th className="px-4 py-2 font-medium">Price</th>
              <th className="px-4 py-2 font-medium">Stock</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium"></th>
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
                  No products found.
                </td>
              </tr>
            ) : (
              items.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2 font-medium text-slate-900">{product.title}</td>
                  <td className="px-4 py-2 text-slate-500">{product.sku}</td>
                  <td className="px-4 py-2 text-slate-700">₹{product.price}</td>
                  <td className="px-4 py-2">
                    {isEmployee ? (
                      <StockEditor product={product} onSaved={fetchProducts} />
                    ) : (
                      <span className={product.stock <= 5 ? "font-semibold text-red-600" : "text-slate-700"}>
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        product.isActive
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                          : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
                      }
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {!isEmployee && (
                      <>
                        <Link href={`/products/${product.id}/edit`} className="mr-3 text-slate-600 hover:text-slate-900">
                          Edit
                        </Link>
                        <button onClick={() => toggleActive(product)} className="text-slate-600 hover:text-slate-900">
                          {product.isActive ? "Deactivate" : "Reactivate"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!pinnedLowStock && total > pageSize && (
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

function StockEditor({ product, onSaved }: { product: Product; onSaved: () => void }) {
  const [value, setValue] = useState(String(product.stock));
  const [saving, setSaving] = useState(false);

  async function save() {
    const stock = Number(value);
    if (!Number.isInteger(stock) || stock < 0 || stock === product.stock) return;
    setSaving(true);
    try {
      await updateProductStock(product.id, stock);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={
          "w-20 rounded-md border px-2 py-1 text-sm " +
          (product.stock <= 5 ? "border-red-300 text-red-600 font-semibold" : "border-slate-300 text-slate-700")
        }
      />
      <button
        onClick={save}
        disabled={saving || Number(value) === product.stock}
        className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
      >
        {saving ? "…" : "Save"}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createStaff } from "@/lib/api";
import { StaffTable } from "@/components/staff/StaffTable";
import { PageHeader } from "@/components/ui/PageHeader";
import type { StaffRole } from "@/lib/types";

export default function StaffPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffRole>("employee");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createStaff({ email, password, name: name || undefined, role });
      setEmail("");
      setPassword("");
      setName("");
      setRole("employee");
      setRefreshSignal((n) => n + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create staff account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="Staff" />

      <form onSubmit={handleCreate} className="mb-6 flex flex-wrap items-end gap-3 rounded-md border border-slate-200 bg-white p-4">
        <div>
          <label className="block text-xs font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">Name (optional)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as StaffRole)}
            className="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Add staff member"}
        </button>
        {error && <p className="w-full text-sm text-red-600">{error}</p>}
      </form>

      <StaffTable refreshSignal={refreshSignal} />
    </div>
  );
}

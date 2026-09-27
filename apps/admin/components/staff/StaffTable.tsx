"use client";

import { useEffect, useState } from "react";
import { deactivateStaff, listStaff, reactivateStaff, updateStaffRole } from "@/lib/api";
import type { StaffMember, StaffRole } from "@/lib/types";

const ROLE_OPTIONS: StaffRole[] = ["super_admin", "admin", "employee"];

export function StaffTable({ refreshSignal }: { refreshSignal: number }) {
  const [items, setItems] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStaff() {
    setLoading(true);
    setError(null);
    try {
      const data = await listStaff();
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load staff");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  async function handleRoleChange(id: string, role: StaffRole) {
    await updateStaffRole(id, role);
    fetchStaff();
  }

  async function handleToggleActive(member: StaffMember) {
    if (member.isActive) {
      await deactivateStaff(member.id).catch((err) => setError(err instanceof Error ? err.message : "Failed"));
    } else {
      await reactivateStaff(member.id);
    }
    fetchStaff();
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Created</th>
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
                  No staff accounts yet.
                </td>
              </tr>
            ) : (
              items.map((member) => (
                <tr key={member.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2 font-medium text-slate-900">{member.email}</td>
                  <td className="px-4 py-2 text-slate-500">{member.name ?? "—"}</td>
                  <td className="px-4 py-2">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as StaffRole)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        member.isActive
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                          : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
                      }
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-500">{new Date(member.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => handleToggleActive(member)} className="text-slate-600 hover:text-slate-900">
                      {member.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { create } from "zustand";
import type { StaffRole } from "@/lib/types";

interface AdminUser {
  uid: string;
  email: string | null;
}

interface AdminAuthState {
  user: AdminUser | null;
  role: StaffRole | null;
  isStaff: boolean;
  initialized: boolean;
  setUser: (user: AdminUser | null, role: StaffRole | null) => void;
}

// Mirrors Firebase's own session (see AdminAuthListener). `initialized`
// distinguishes "still checking" from "definitely signed out", so the
// protected layout doesn't redirect before the first auth check resolves.
// `role` comes from the API (Postgres-backed), not a Firebase claim — see
// AdminAuthListener for why.
export const useAdminAuthStore = create<AdminAuthState>()((set) => ({
  user: null,
  role: null,
  isStaff: false,
  initialized: false,
  setUser: (user, role) => set({ user, role, isStaff: role !== null, initialized: true }),
}));

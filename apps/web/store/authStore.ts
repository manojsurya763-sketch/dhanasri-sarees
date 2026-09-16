import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  phone: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (phone: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (phone) => set({ user: { phone }, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "dhana-sri-auth" }
  )
);

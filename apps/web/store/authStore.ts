import { create } from "zustand";

interface AuthUser {
  uid: string;
  phone: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
}

// Firebase's own onAuthStateChanged (see AuthListener) is the source of truth
// and persists sign-in across reloads on its own — this store just mirrors it
// for synchronous reads in components (e.g. the header icon).
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

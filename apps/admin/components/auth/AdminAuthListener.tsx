"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getMe } from "@/lib/api";
import { useAdminAuthStore } from "@/store/adminAuthStore";

// Mounted once in the root layout. Keeps adminAuthStore in sync with
// Firebase's own session. Role comes from GET /admin/me (Postgres-backed),
// not a Firebase custom claim — that keeps a single source of truth for
// authorization and means a deactivation is enforced on the next API call,
// not on next token refresh.
export function AdminAuthListener() {
  const setUser = useAdminAuthStore((s) => s.setUser);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null, null);
        return;
      }
      try {
        const me = await getMe();
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email }, me.role);
      } catch {
        setUser(null, null); // not staff, or deactivated
      }
    });
  }, [setUser]);

  return null;
}

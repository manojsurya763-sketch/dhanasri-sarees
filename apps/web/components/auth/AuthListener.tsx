"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

// Mounted once in the root layout. Keeps authStore in sync with Firebase's
// own session so components can read auth state synchronously.
export function AuthListener() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser && firebaseUser.phoneNumber ? { uid: firebaseUser.uid, phone: firebaseUser.phoneNumber } : null);
    });
  }, [setUser]);

  return null;
}

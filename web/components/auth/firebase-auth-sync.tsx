"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getClientAuth, mapFirebaseUser } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { useAuthStore } from "@/store/auth-store";

export function FirebaseAuthSync() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = useAuthStore((s) => s.setTokens);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const auth = getClientAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (useAuthStore.getState().user?.isGuest) return;

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setUser(mapFirebaseUser(firebaseUser));
        setTokens(token);
        return;
      }

      const { isAuthenticated, accessToken } = useAuthStore.getState();
      if (isAuthenticated && accessToken) {
        logout();
      }
    });

    return () => unsubscribe();
  }, [setUser, setTokens, logout]);

  return null;
}

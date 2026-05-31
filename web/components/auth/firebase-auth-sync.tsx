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
        const mapped = mapFirebaseUser(firebaseUser);
        const existing = useAuthStore.getState().user;
        if (existing?.id === mapped.id && !existing.isGuest) {
          setUser({
            ...mapped,
            country: existing.country,
            ethnicity: existing.ethnicity,
            languages: existing.languages,
            profileCompleted: existing.profileCompleted,
            level: existing.level,
            xp: existing.xp,
            xpToNextLevel: existing.xpToNextLevel,
            agreements: existing.agreements,
            contributions: existing.contributions,
            streak: existing.streak,
            lastActiveDate: existing.lastActiveDate,
            badges: existing.badges,
          });
        } else {
          setUser(mapped);
        }
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

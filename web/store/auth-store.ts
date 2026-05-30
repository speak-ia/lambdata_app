import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types";

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setTokens: (access: string | null, refresh?: string | null) => void;
  loginAsGuest: () => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const GUEST_USER: UserProfile = {
  id: "guest",
  displayName: "Contributeur invité",
  country: "SN",
  languages: ["fr"],
  level: 1,
  xp: 0,
  xpToNextLevel: 10000,
  agreements: 0,
  contributions: 0,
  badges: [],
  streak: 0,
  isGuest: true,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user && !user.isGuest,
        }),
      setTokens: (access, refresh) =>
        set({
          accessToken: access,
          refreshToken: refresh ?? null,
        }),
      loginAsGuest: () =>
        set({
          user: GUEST_USER,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "lambdata-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

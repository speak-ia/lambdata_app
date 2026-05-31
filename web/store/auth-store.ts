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
  updateUser: (patch: Partial<UserProfile>) => void;
  setTokens: (access: string | null, refresh?: string | null) => void;
  loginAsGuest: () => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const GUEST_USER: UserProfile = {
  id: "guest",
  displayName: "Contributeur invité",
  country: "SN",
  ethnicity: "other",
  languages: ["fr"],
  profileCompleted: true,
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
      updateUser: (patch) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...patch } : null,
        })),
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
      version: 1,
      migrate: (persisted) => {
        const state = persisted as {
          user?: UserProfile;
        };
        if (state?.user && !state.user.isGuest) {
          state.user = {
            ...state.user,
            ethnicity: state.user.ethnicity ?? "",
            profileCompleted: state.user.profileCompleted ?? false,
            languages: state.user.languages ?? [],
          };
        }
        return persisted;
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

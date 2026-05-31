import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppLanguage } from "@/types";

interface AppState {
  theme: "light" | "dark" | "system";
  appLanguage: AppLanguage;
  isOnline: boolean;
  showInstallPrompt: boolean;
  hasSeenOnboarding: boolean;
  setTheme: (theme: AppState["theme"]) => void;
  setAppLanguage: (lang: AppLanguage) => void;
  setOnline: (online: boolean) => void;
  setShowInstallPrompt: (show: boolean) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "system",
      appLanguage: "fr",
      isOnline: true,
      showInstallPrompt: false,
      hasSeenOnboarding: false,
      setTheme: (theme) => set({ theme }),
      setAppLanguage: (appLanguage) => set({ appLanguage }),
      setOnline: (isOnline) => set({ isOnline }),
      setShowInstallPrompt: (showInstallPrompt) => set({ showInstallPrompt }),
      setHasSeenOnboarding: (hasSeenOnboarding) => set({ hasSeenOnboarding }),
    }),
    { name: "lambdata-app" },
  ),
);

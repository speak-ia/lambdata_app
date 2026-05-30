import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  theme: "light" | "dark" | "system";
  isOnline: boolean;
  showInstallPrompt: boolean;
  hasSeenOnboarding: boolean;
  setTheme: (theme: AppState["theme"]) => void;
  setOnline: (online: boolean) => void;
  setShowInstallPrompt: (show: boolean) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "system",
      isOnline: true,
      showInstallPrompt: false,
      hasSeenOnboarding: false,
      setTheme: (theme) => set({ theme }),
      setOnline: (isOnline) => set({ isOnline }),
      setShowInstallPrompt: (showInstallPrompt) => set({ showInstallPrompt }),
      setHasSeenOnboarding: (hasSeenOnboarding) => set({ hasSeenOnboarding }),
    }),
    { name: "lambdata-app" },
  ),
);

"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { syncPendingUploads } from "@/offline/sync-manager";
import { useAuthStore } from "@/store/auth-store";

export function useOnlineStatus() {
  const setOnline = useAppStore((s) => s.setOnline);
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [setOnline]);

  useEffect(() => {
    const onOnline = async () => {
      await syncPendingUploads(token);
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [token]);
}

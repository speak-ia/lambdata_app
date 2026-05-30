"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";

export function PwaRegister() {
  const setShowInstallPrompt = useAppStore((s) => s.setShowInstallPrompt);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => {
        /* SW optional in dev */
      });

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, [setShowInstallPrompt]);

  return null;
}

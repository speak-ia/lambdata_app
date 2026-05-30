"use client";

import { WifiOff } from "lucide-react";
import { useAppStore } from "@/store/app-store";

export function OfflineBanner() {
  const isOnline = useAppStore((s) => s.isOnline);
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[60] flex items-center justify-center gap-2 bg-sand px-4 py-2 text-sm font-medium text-sand-foreground safe-top"
    >
      <WifiOff className="size-4" />
      Mode hors ligne — vos contributions seront synchronisées
    </div>
  );
}

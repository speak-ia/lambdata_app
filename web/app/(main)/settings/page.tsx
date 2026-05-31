"use client";

import Link from "next/link";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { ProfileSetupForm } from "@/components/profile/profile-setup-form";
import { APP_UI_LANGUAGES } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import type { AppLanguage } from "@/types";
import { ChevronLeft } from "lucide-react";

export default function SettingsPage() {
  const appLanguage = useAppStore((s) => s.appLanguage);
  const setAppLanguage = useAppStore((s) => s.setAppLanguage);
  const msgs = t(appLanguage);

  const handleAppLanguage = (code: AppLanguage) => {
    setAppLanguage(code);
    toast.success(msgs.saved);
  };

  return (
    <div className="flex flex-col gap-6 pb-4">
      <AppHeader showLogo={false} title={msgs.settings} showSettings={false} />
      <Link
        href="/home"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Retour
      </Link>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-heading text-base font-semibold">{msgs.appLanguage}</h2>
          <p className="text-xs text-muted-foreground">{msgs.appLanguageHint}</p>
        </div>
        <div className="flex flex-col gap-2">
          {APP_UI_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleAppLanguage(lang.code as AppLanguage)}
              className={cn(
                "flex h-12 items-center justify-between rounded-xl border px-4 text-left text-base transition-colors",
                appLanguage === lang.code
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <span>{lang.label}</span>
              {appLanguage === lang.code && (
                <span className="text-xs font-medium">✓</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 border-t border-border pt-6">
        <h2 className="font-heading text-base font-semibold">Profil contributeur</h2>
        <p className="text-xs text-muted-foreground">
          Pays, ethnie et langues de contribution
        </p>
        <ProfileSetupForm variant="settings" />
      </section>
    </div>
  );
}

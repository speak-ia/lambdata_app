"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LambdataLogo } from "@/components/branding/lambdata-logo";
import {
  AFRICAN_COUNTRIES,
  AFRICAN_ETHNICITIES,
  AFRICAN_LANGUAGES,
} from "@/lib/constants";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";

interface ProfileSetupFormProps {
  /** Étape après inscription (étape 2) */
  variant?: "onboarding" | "settings";
  onComplete?: () => void;
}

export function ProfileSetupForm({
  variant = "onboarding",
  onComplete,
}: ProfileSetupFormProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const appLanguage = useAppStore((s) => s.appLanguage);
  const msgs = t(appLanguage);

  const [country, setCountry] = useState(user?.country ?? "");
  const [ethnicity, setEthnicity] = useState(user?.ethnicity ?? "");
  const [languages, setLanguages] = useState<string[]>(user?.languages ?? []);

  const toggleLanguage = (code: string) => {
    setLanguages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!country) {
      toast.error(msgs.selectCountry);
      return;
    }
    if (!ethnicity) {
      toast.error(msgs.selectEthnicity);
      return;
    }
    if (languages.length === 0) {
      toast.error(msgs.selectAtLeastOneLanguage);
      return;
    }

    if (!user) {
      toast.error("Session expirée. Reconnectez-vous.");
      router.replace("/login");
      return;
    }

    setUser({
      ...user,
      country,
      ethnicity,
      languages,
      profileCompleted: true,
    });

    if (variant === "onboarding") {
      toast.success("Profil contributeur enregistré");
      router.replace("/home");
    } else {
      toast.success(msgs.saved);
      onComplete?.();
    }
  };

  const selectClass =
    "h-12 w-full rounded-xl border border-input bg-background px-3 text-base";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {variant === "onboarding" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <LambdataLogo size="md" />
          <h1 className="font-heading text-xl font-bold">{msgs.profileStepTitle}</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            {msgs.profileStepSubtitle}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="country">{msgs.country}</Label>
        <select
          id="country"
          className={selectClass}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        >
          <option value="">—</option>
          {AFRICAN_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ethnicity">{msgs.ethnicity}</Label>
        <select
          id="ethnicity"
          className={selectClass}
          value={ethnicity}
          onChange={(e) => setEthnicity(e.target.value)}
          required
        >
          <option value="">—</option>
          {AFRICAN_ETHNICITIES.map((e) => (
            <option key={e.code} value={e.code}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <Label>{msgs.contributionLanguages}</Label>
        <p className="text-xs text-muted-foreground">
          Sélectionnez toutes les langues dans lesquelles vous pouvez contribuer.
        </p>
        <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto pr-1">
          {AFRICAN_LANGUAGES.map((lang) => {
            const selected = languages.includes(lang.code);
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => toggleLanguage(lang.code)}
                className={cn(
                  "rounded-full border px-3 py-2 text-sm transition-colors",
                  selected
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-muted/50 text-foreground hover:bg-muted",
                )}
                aria-pressed={selected}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      <Button type="submit" size="lg" className="h-12 w-full text-base font-semibold">
        {variant === "onboarding" ? msgs.continue : msgs.saved}
      </Button>
    </form>
  );
}

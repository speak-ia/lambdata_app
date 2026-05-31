"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppHeader } from "@/components/layout/app-header";
import { useAuthStore } from "@/store/auth-store";
import { signOutFirebase } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import {
  AFRICAN_COUNTRIES,
  AFRICAN_ETHNICITIES,
  AFRICAN_LANGUAGES,
} from "@/lib/constants";
import { LogOut, Moon, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/app-store";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, setTheme } = useAppStore();

  const country = AFRICAN_COUNTRIES.find((c) => c.code === user?.country);
  const ethnicity = AFRICAN_ETHNICITIES.find((e) => e.code === user?.ethnicity);

  return (
    <div className="flex flex-col gap-6 pb-4">
      <AppHeader showLogo={false} title="Profil" showSettings={false} />
      <div className="flex flex-col items-center gap-3">
        <Avatar className="size-24">
          {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {user?.displayName?.[0] ?? "?"}
          </AvatarFallback>
        </Avatar>
        <h1 className="font-heading text-xl font-bold">{user?.displayName}</h1>
        <p className="text-center text-muted-foreground">
          {country?.flag} {country?.label ?? user?.country}
          {ethnicity ? ` · ${ethnicity.label}` : ""} · Niveau {user?.level}
        </p>
        {user?.isGuest && (
          <p className="text-sm text-sand-foreground">Mode invité</p>
        )}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <p className="text-sm font-medium">Langues de contribution</p>
          <div className="flex flex-wrap gap-2">
            {user?.languages.map((code) => {
              const lang = AFRICAN_LANGUAGES.find((l) => l.code === code);
              return (
                <span
                  key={code}
                  className="rounded-full bg-muted px-3 py-1 text-sm"
                >
                  {lang?.label ?? code}
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Link
        href="/settings"
        className="inline-flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-4 text-sm font-medium hover:bg-muted/50"
      >
        Paramètres
        <Settings className="size-4" />
      </Link>

      <Button
        variant="outline"
        className="h-12 justify-between"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        Thème
        {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>

      <Button
        variant="destructive"
        className="h-12"
        onClick={async () => {
          if (isFirebaseConfigured() && !user?.isGuest) {
            try {
              await signOutFirebase();
            } catch {
              /* ignore */
            }
          }
          logout();
          router.replace("/login");
        }}
      >
        <LogOut className="size-4" />
        Déconnexion
      </Button>
    </div>
  );
}

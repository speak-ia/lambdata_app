"use client";

import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";

const greetings: Record<string, string> = {
  fr: "Bonjour",
  en: "Hello",
  ar: "مرحبا",
  pt: "Olá",
  sw: "Habari",
};

export function GreetingCard() {
  const user = useAuthStore((s) => s.user);
  const appLanguage = useAppStore((s) => s.appLanguage);
  const name = user?.displayName?.split(" ")[0] ?? "Contributeur";

  return (
    <p className="text-2xl font-medium tracking-tight text-foreground">
      {greetings[appLanguage] ?? "Bonjour"},{" "}
      <span className="font-heading font-semibold text-primary">{name}</span>
    </p>
  );
}

"use client";

import { useAuthStore } from "@/store/auth-store";

export function GreetingCard() {
  const user = useAuthStore((s) => s.user);
  const name = user?.displayName?.split(" ")[0] ?? "Contributeur";

  return (
    <p className="text-2xl font-medium tracking-tight text-foreground">
      Bonjour,{" "}
      <span className="font-heading font-semibold text-primary">{name}</span>
    </p>
  );
}

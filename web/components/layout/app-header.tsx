"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LambdataLogo } from "@/components/branding/lambdata-logo";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  showLogo?: boolean;
  title?: string;
  className?: string;
  showSettings?: boolean;
}

export function AppHeader({
  showLogo = true,
  title,
  className,
  showSettings = true,
}: AppHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const initials = user?.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={cn(
        "flex items-center justify-between py-4",
        className,
      )}
    >
      {showLogo ? (
        <LambdataLogo size="sm" />
      ) : (
        <span className="font-heading text-lg font-semibold">{title}</span>
      )}
      <div className="flex items-center gap-2">
        {showSettings && (
          <Link
            href="/settings"
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Paramètres"
          >
            <Settings className="size-5" />
          </Link>
        )}
        <Link
          href="/profile"
          className="rounded-full ring-2 ring-transparent transition hover:ring-primary/30"
        >
          <Avatar className="size-10">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {initials ?? "?"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/home", label: "Accueil", icon: Home },
  { href: "/achievements", label: "Réussites", icon: Trophy },
  { href: "/leaderboards", label: "Classement", icon: Medal },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-card/95 backdrop-blur-md safe-bottom"
      aria-label="Navigation principale"
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-[72px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn("size-6", active && "fill-primary/15")}
                strokeWidth={active ? 2.5 : 2}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/layout/app-header";
import { Crown } from "lucide-react";
import {
  buildLeaderboard,
  countryFlag,
  type LeaderboardModule,
} from "@/lib/leaderboard";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const MODULE_LABELS: Record<LeaderboardModule, string> = {
  global: "Global",
  translation: "Traduction",
  audio: "Voix",
  validation: "Validation",
};

export default function LeaderboardsPage() {
  const user = useAuthStore((s) => s.user);
  const [module, setModule] = useState<LeaderboardModule>("global");

  const entries = useMemo(
    () => buildLeaderboard(module, user),
    [module, user],
  );

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const isYou = (id: string) => user?.id === id && !user?.isGuest;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 pb-4"
    >
      <AppHeader showLogo={false} title="Classement" />

      <Tabs
        value={module}
        onValueChange={(v) => setModule(v as LeaderboardModule)}
      >
        <TabsList className="grid w-full grid-cols-4 text-[11px]">
          {(Object.keys(MODULE_LABELS) as LeaderboardModule[]).map((key) => (
            <TabsTrigger key={key} value={key} className="px-1">
              {MODULE_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={module} className="mt-4 flex flex-col gap-6">
          <p className="text-center font-heading text-lg font-semibold text-primary">
            {MODULE_LABELS[module]}
          </p>

          {top3.length >= 3 && (
            <div className="flex items-end justify-center gap-3 px-2">
              {[top3[1], top3[0], top3[2]].map((entry, i) => (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex flex-col items-center gap-1",
                    i === 1 && "scale-110",
                    isYou(entry.userId) && "rounded-xl ring-2 ring-primary/40",
                  )}
                >
                  {i === 1 && <Crown className="size-5 text-gold" />}
                  <Avatar className={i === 1 ? "size-16" : "size-12"}>
                    <AvatarFallback>{entry.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <p className="max-w-[80px] truncate text-xs font-medium">
                    {entry.displayName}
                    {isYou(entry.userId) ? " (vous)" : ""}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {entry.points.toLocaleString("fr-FR")} pts
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {rest.map((entry) => (
              <Card
                key={entry.userId}
                className={cn(
                  "border-0 shadow-sm",
                  isYou(entry.userId) && "ring-2 ring-primary/30",
                )}
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                    {entry.rank}
                  </span>
                  <Avatar className="size-10">
                    <AvatarFallback>{entry.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {entry.displayName}
                      {isYou(entry.userId) ? " · vous" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.points.toLocaleString("fr-FR")} points
                    </p>
                  </div>
                  <span className="text-lg">{countryFlag(entry.country)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

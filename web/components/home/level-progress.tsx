"use client";

import { Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/auth-store";

export function LevelProgress() {
  const user = useAuthStore((s) => s.user);
  const level = user?.level ?? 1;
  const xp = user?.xp ?? 0;
  const xpMax = user?.xpToNextLevel ?? 10000;
  const percent = Math.min(100, Math.round((xp / xpMax) * 100));

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/15 via-card to-sand/20 shadow-md">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Niveau actuel</p>
            <p className="font-heading text-3xl font-bold text-primary">
              Niveau {level}
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-full bg-gold/30">
            <Rocket className="size-6 text-gold-foreground" />
          </div>
        </div>
        <Progress value={percent} className="h-2.5" />
        <p className="text-right text-sm text-muted-foreground">
          {xp.toLocaleString("fr-FR")} / {xpMax.toLocaleString("fr-FR")} XP
        </p>
      </CardContent>
    </Card>
  );
}

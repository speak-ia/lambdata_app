"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppHeader } from "@/components/layout/app-header";
import { useAuthStore } from "@/store/auth-store";
import { useProgressStore } from "@/store/progress-store";
import {
  BADGE_DEFINITIONS,
  computeBadgeLevel,
  computeBadgePercent,
} from "@/lib/badges";
import {
  Camera,
  Globe,
  Mic,
  Languages,
  CheckCircle2,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Mic,
  Languages,
  Camera,
  Globe,
  CheckCircle2,
  Trophy,
};

export default function AchievementsPage() {
  const user = useAuthStore((s) => s.user);
  const daily = useProgressStore((s) => s.getTodayCounts());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 pb-4"
    >
      <AppHeader showLogo={false} title="Réussites" />
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="mt-4 flex flex-col gap-3">
          <Card>
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Niveau</span>
                <span className="font-semibold">{user?.level ?? 1}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">XP total</span>
                <span className="font-semibold">
                  {(user?.xp ?? 0).toLocaleString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contributions</span>
                <span className="font-semibold">{user?.contributions ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Validations</span>
                <span className="font-semibold">{user?.agreements ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Série</span>
                <span className="font-semibold">{user?.streak ?? 0} jours</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-muted/40">
            <CardContent className="p-4 text-sm text-muted-foreground">
              Aujourd&apos;hui : {daily.audio} audio, {daily.translation}{" "}
              traductions, {daily.validation} validations, {daily.image} images
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="badges" className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {BADGE_DEFINITIONS.map((badge) => {
              const Icon = iconMap[badge.icon] ?? Trophy;
              const progress = user
                ? badge.getProgress(user, daily)
                : 0;
              const level = computeBadgeLevel(progress, badge.target);
              const percent = computeBadgePercent(progress, badge.target);

              return (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <div className="relative flex size-20 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-8 text-primary" />
                    {level > 0 && (
                      <span className="absolute -bottom-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {level}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium leading-tight">
                    {badge.name}
                  </p>
                  {percent < 100 && (
                    <Progress value={percent} className="h-1 w-full" />
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

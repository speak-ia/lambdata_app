"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppHeader } from "@/components/layout/app-header";
import { useAuthStore } from "@/store/auth-store";
import {
  Camera,
  Globe,
  Mic,
  Pencil,
  Star,
  Trophy,
} from "lucide-react";

const BADGES = [
  { name: "Photographe", icon: Camera, level: 8, progress: 80 },
  { name: "Explorateur", icon: Globe, level: 5, progress: 50 },
  { name: "Voix locale", icon: Mic, level: 12, progress: 100 },
  { name: "Éditeur", icon: Pencil, level: 3, progress: 30 },
  { name: "Ambassadeur", icon: Star, level: 1, progress: 10 },
  { name: "Champion", icon: Trophy, level: 0, progress: 0 },
];

export default function AchievementsPage() {
  const user = useAuthStore((s) => s.user);

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
                <span className="text-muted-foreground">Série</span>
                <span className="font-semibold">{user?.streak ?? 0} jours</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="badges" className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {BADGES.map(({ name, icon: Icon, level, progress }) => (
              <div
                key={name}
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
                <p className="text-xs font-medium leading-tight">{name}</p>
                {progress < 100 && (
                  <Progress value={progress} className="h-1 w-full" />
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

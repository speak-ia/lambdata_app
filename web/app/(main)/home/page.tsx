"use client";

import { motion } from "framer-motion";
import { AppHeader } from "@/components/layout/app-header";
import { GreetingCard } from "@/components/home/greeting-card";
import { LevelProgress } from "@/components/home/level-progress";
import { StatsRow } from "@/components/home/stats-row";
import { TaskGrid } from "@/components/home/task-grid";
import { DailyMissions } from "@/components/home/daily-missions";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";

export default function HomePage() {
  const streak = useAuthStore((s) => s.user?.streak ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 pb-4"
    >
      <AppHeader />
      <GreetingCard />
      {streak > 0 && (
        <Badge
          variant="secondary"
          className="w-fit bg-gold/20 text-gold-foreground"
        >
          🔥 Série de {streak} jours
        </Badge>
      )}
      <LevelProgress />
      <StatsRow />
      <DailyMissions />
      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">
          Missions de contribution
        </h2>
        <TaskGrid />
      </section>
    </motion.div>
  );
}

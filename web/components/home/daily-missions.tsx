"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { buildDailyMissions } from "@/lib/daily-missions";
import { useProgressStore } from "@/store/progress-store";
import { CheckCircle2 } from "lucide-react";

const MISSION_LINKS: Record<string, string> = {
  "audio-3": "/tasks/audio",
  "translation-2": "/tasks/translation",
  "validation-5": "/tasks/validation",
};

export function DailyMissions() {
  const daily = useProgressStore((s) => s.getTodayCounts());
  const missions = buildDailyMissions(daily);

  return (
    <section>
      <h2 className="mb-3 font-heading text-lg font-semibold">
        Missions du jour
      </h2>
      <div className="flex flex-col gap-2">
        {missions.map((m) => (
          <Link key={m.id} href={MISSION_LINKS[m.id] ?? "/home"}>
            <Card className="border-0 shadow-sm transition active:scale-[0.99]">
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium leading-tight">{m.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.description} · +{m.xpReward} XP
                    </p>
                  </div>
                  {m.completed && (
                    <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  )}
                </div>
                <Progress
                  value={(m.progress / m.target) * 100}
                  className="h-1.5"
                />
                <p className="text-right text-xs text-muted-foreground">
                  {m.progress}/{m.target}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

import type { DailyCounts } from "@/store/progress-store";
import type { DailyMission } from "@/types";

export function buildDailyMissions(daily: DailyCounts): DailyMission[] {
  return [
    {
      id: "audio-3",
      title: "3 enregistrements vocaux",
      description: "Lisez des phrases dans vos langues",
      xpReward: 75,
      progress: Math.min(3, daily.audio),
      target: 3,
      completed: daily.audio >= 3,
    },
    {
      id: "translation-2",
      title: "2 traductions",
      description: "Traduisez entre vos langues de contribution",
      xpReward: 60,
      progress: Math.min(2, daily.translation),
      target: 2,
      completed: daily.translation >= 2,
    },
    {
      id: "validation-5",
      title: "5 validations",
      description: "Validez des images culturelles",
      xpReward: 25,
      progress: Math.min(5, daily.validation),
      target: 5,
      completed: daily.validation >= 5,
    },
  ];
}

import type { UserProfile } from "@/types";
import type { DailyCounts } from "@/store/progress-store";

export interface BadgeDefinition {
  id: string;
  name: string;
  icon: string;
  target: number;
  getProgress: (user: UserProfile, daily: DailyCounts) => number;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "voice",
    name: "Voix locale",
    icon: "Mic",
    target: 10,
    getProgress: (u, d) => u.contributions + d.audio * 2,
  },
  {
    id: "translator",
    name: "Traducteur",
    icon: "Languages",
    target: 15,
    getProgress: (u, d) => d.translation * 3 + Math.floor(u.contributions / 3),
  },
  {
    id: "validator",
    name: "Validateur",
    icon: "CheckCircle2",
    target: 20,
    getProgress: (u) => u.agreements,
  },
  {
    id: "photographer",
    name: "Photographe",
    icon: "Camera",
    target: 8,
    getProgress: (u, d) => d.image * 4,
  },
  {
    id: "explorer",
    name: "Explorateur",
    icon: "Globe",
    target: 5,
    getProgress: (u) => (u.languages?.length ?? 0) + (u.level > 1 ? 2 : 0),
  },
  {
    id: "champion",
    name: "Champion",
    icon: "Trophy",
    target: 5,
    getProgress: (u) => Math.min(u.level, 5),
  },
];

export function computeBadgeLevel(progress: number, target: number): number {
  if (progress <= 0) return 0;
  return Math.min(12, Math.max(1, Math.floor((progress / target) * 6)));
}

export function computeBadgePercent(progress: number, target: number): number {
  return Math.min(100, Math.round((progress / target) * 100));
}

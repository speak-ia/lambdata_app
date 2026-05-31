import { AFRICAN_COUNTRIES } from "@/lib/constants";
import type { LeaderboardEntry, UserProfile } from "@/types";

const BASE_POOL: Omit<LeaderboardEntry, "rank">[] = [
  { userId: "1", displayName: "Fatou N.", country: "SN", points: 1502445 },
  { userId: "2", displayName: "Ibrahim K.", country: "ML", points: 1420100 },
  { userId: "3", displayName: "Awa T.", country: "CI", points: 1380500 },
  { userId: "4", displayName: "Moussa B.", country: "BF", points: 980200 },
  { userId: "5", displayName: "Kadiatou S.", country: "GN", points: 875400 },
  { userId: "6", displayName: "Amadou D.", country: "NG", points: 720100 },
  { userId: "7", displayName: "Aïcha M.", country: "MA", points: 650000 },
];

export type LeaderboardModule = "global" | "translation" | "audio" | "validation";

const MODULE_MULTIPLIER: Record<LeaderboardModule, number> = {
  global: 1,
  translation: 0.92,
  audio: 0.88,
  validation: 0.85,
};

export function buildLeaderboard(
  module: LeaderboardModule,
  currentUser: UserProfile | null,
): LeaderboardEntry[] {
  const mult = MODULE_MULTIPLIER[module];
  const entries: LeaderboardEntry[] = BASE_POOL.map((e, i) => ({
    ...e,
    rank: i + 1,
    points: Math.round(e.points * mult),
  }));

  if (currentUser && !currentUser.isGuest) {
    const userPoints =
      currentUser.xp +
      currentUser.contributions * 120 +
      currentUser.agreements * 40;
    const scaled = Math.round(userPoints * mult);
    const existing = entries.findIndex((e) => e.userId === currentUser.id);
    if (existing >= 0) {
      entries[existing] = {
        ...entries[existing],
        displayName: currentUser.displayName,
        country: currentUser.country,
        points: scaled,
      };
    } else {
      entries.push({
        rank: 0,
        userId: currentUser.id,
        displayName: currentUser.displayName,
        country: currentUser.country,
        points: scaled,
      });
    }
  }

  entries.sort((a, b) => b.points - a.points);
  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

export function countryFlag(code: string): string {
  return AFRICAN_COUNTRIES.find((c) => c.code === code)?.flag ?? "🌍";
}

import { XP_PER_LEVEL } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";

export const XP_BY_MODULE = {
  audio: 75,
  translation: 60,
  validation: 25,
  image: 50,
} as const;

export type RewardModule = keyof typeof XP_BY_MODULE;

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Met à jour XP, niveau, compteurs et série (local, sans Storage) */
export function applyContributionReward(module: RewardModule) {
  const user = useAuthStore.getState().user;
  const updateUser = useAuthStore.getState().updateUser;
  if (!user) return;

  const xpGain = XP_BY_MODULE[module];
  let xp = user.xp + xpGain;
  let level = user.level;
  let xpToNextLevel = user.xpToNextLevel;

  while (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level += 1;
    xpToNextLevel = XP_PER_LEVEL;
  }

  const today = new Date().toISOString().slice(0, 10);
  const lastDay = user.lastActiveDate;
  let streak = user.streak;
  if (lastDay !== today) {
    streak = lastDay === yesterdayISO() ? streak + 1 : 1;
  }

  updateUser({
    xp,
    level,
    xpToNextLevel,
    streak,
    lastActiveDate: today,
    contributions: user.contributions + 1,
    agreements: module === "validation" ? user.agreements + 1 : user.agreements,
  });
}

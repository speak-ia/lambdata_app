import { apiFetch } from "@/lib/api-client";
import {
  applyContributionReward,
  XP_BY_MODULE,
  type RewardModule,
} from "@/lib/contribution-rewards";
import { useProgressStore } from "@/store/progress-store";
import type { ContributionModule } from "@/types";

const API_TYPE: Record<RewardModule, string> = {
  audio: "AUDIO",
  translation: "TRANSLATION",
  validation: "VALIDATION",
  image: "IMAGE",
};

export function recordContributionSuccess(module: RewardModule) {
  applyContributionReward(module);
  useProgressStore.getState().increment(module as ContributionModule);
}

export async function recordAndSyncContribution(
  module: RewardModule,
  token: string | null | undefined,
  metadata: Record<string, unknown>,
) {
  recordContributionSuccess(module);

  if (!token) return;

  try {
    await apiFetch<{ id: string }>("/api/v1/contributions", {
      method: "POST",
      token,
      body: JSON.stringify({
        type: API_TYPE[module],
        metadata,
        xpEarned: XP_BY_MODULE[module],
      }),
    });
  } catch {
    /* API hors ligne : récompense locale déjà appliquée */
  }
}

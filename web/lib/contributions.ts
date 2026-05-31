import { apiFetch } from "@/lib/api-client";

export async function registerImageContribution(
  token: string,
  payload: {
    storagePath: string;
    downloadUrl: string;
    category: string;
    language: string;
    country?: string;
  },
) {
  return apiFetch<{ id: string }>("/api/v1/contributions", {
    method: "POST",
    token,
    body: JSON.stringify({
      type: "IMAGE",
      metadata: payload,
      xpEarned: 50,
    }),
  });
}

export async function registerValidationVote(
  token: string,
  payload: {
    taskId: string;
    answer: boolean;
    questionLanguage: string;
    imageUrl: string;
  },
) {
  return apiFetch<{ id: string }>("/api/v1/contributions", {
    method: "POST",
    token,
    body: JSON.stringify({
      type: "VALIDATION",
      metadata: payload,
      xpEarned: 25,
    }),
  });
}

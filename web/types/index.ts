export type AuthMode = "login" | "register" | "guest";

export type ContributionModule =
  | "audio"
  | "translation"
  | "image"
  | "video"
  | "validation"
  | "text";

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  displayName: string;
  avatarUrl?: string;
  country: string;
  languages: string[];
  level: number;
  xp: number;
  xpToNextLevel: number;
  agreements: number;
  contributions: number;
  badges: Badge[];
  streak: number;
  isGuest: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  level: number;
  earnedAt?: string;
}

export interface TaskModule {
  id: ContributionModule;
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  available: boolean;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  country: string;
  points: number;
}

export interface OfflineUploadItem {
  id: string;
  module: ContributionModule;
  payload: Record<string, unknown>;
  createdAt: number;
  retries: number;
  status: "pending" | "uploading" | "failed" | "done";
}

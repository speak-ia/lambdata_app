import type { UserProfile } from "@/types";

export function needsProfileSetup(user: UserProfile | null): boolean {
  if (!user || user.isGuest) return false;
  if (user.profileCompleted) return false;
  if (
    user.languages.length > 0 &&
    user.country &&
    user.ethnicity
  ) {
    return false;
  }
  return true;
}

export function getPostAuthPath(user: UserProfile | null): string {
  if (needsProfileSetup(user)) return "/register/profile";
  return "/home";
}

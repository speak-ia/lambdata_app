import { AFRICAN_LANGUAGES } from "@/lib/constants";
import type { AppLanguage } from "@/types";

export function getLanguageLabel(code: string): string {
  return AFRICAN_LANGUAGES.find((l) => l.code === code)?.label ?? code.toUpperCase();
}

/** Langues de contribution filtrées (codes valides uniquement) */
export function resolveContributionLanguages(codes: string[]): string[] {
  const valid = new Set<string>(AFRICAN_LANGUAGES.map((l) => l.code));
  return codes.filter((c) => valid.has(c));
}

export function defaultSourceLanguage(
  appLanguage: AppLanguage,
  contributionLanguages: string[],
): string {
  const langs = resolveContributionLanguages(contributionLanguages);
  if (langs.includes(appLanguage)) return appLanguage;
  return langs[0] ?? appLanguage;
}

export function defaultTargetLanguage(
  source: string,
  contributionLanguages: string[],
): string {
  const langs = resolveContributionLanguages(contributionLanguages);
  return langs.find((c) => c !== source) ?? langs[0] ?? source;
}

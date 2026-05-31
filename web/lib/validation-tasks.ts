import { defaultSourceLanguage } from "@/lib/languages";
import type { AppLanguage } from "@/types";

export interface CulturalValidationTask {
  id: string;
  imageUrl: string;
  /** Langues pour lesquelles cette validation est pertinente */
  languages: string[];
  /** Question par code langue (uniquement langues listées dans `languages`) */
  questions: Record<string, string>;
  storagePath?: string;
}

/** Jeux de validation — à terme chargés depuis GCS / API */
export const CULTURAL_VALIDATION_TASKS: CulturalValidationTask[] = [
  {
    id: "thieb-1",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    languages: ["fr", "wo", "en"],
    questions: {
      fr: "Ce plat s'appelle-t-il « thiéboudienne » ?",
      wo: "Ndax mbaxana bi ñoo ko tudd thiéboudienne ?",
      en: "Is this dish called thiéboudienne?",
    },
  },
  {
    id: "djembe-1",
    imageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
    languages: ["fr", "wo", "dyu", "bm", "ff", "en"],
    questions: {
      fr: "Cet objet est-il un djembé ?",
      wo: "Njàmbat bi dafa nekk djembe ?",
      dyu: "Yala nin ye djembe ye wa ?",
      bm: "Yala nin ye djembe ye wa ?",
      ff: "Ko ɗum in djembe?",
      en: "Is this object a djembe?",
    },
  },
  {
    id: "millet-1",
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    languages: ["fr", "bm", "dyu", "mos", "ha"],
    questions: {
      fr: "S'agit-il de mil (céréale) ?",
      bm: "Yala nin ye kaba ye wa ?",
      dyu: "Yala nin ye kaba ye wa ?",
      mos: "Paam neere n maan ?",
      ha: "Shin wannan gero ne?",
    },
  },
  {
    id: "market-1",
    imageUrl:
      "https://images.unsplash.com/photo-1488459716781-31db77592ef9?w=400&h=300&fit=crop",
    languages: ["fr", "sw", "en", "pt"],
    questions: {
      fr: "Est-ce un marché en plein air ?",
      sw: "Je, hii ni soko la nje?",
      en: "Is this an outdoor market?",
      pt: "Isto é um mercado ao ar livre?",
    },
  },
];

/** Tâches où l'utilisateur peut répondre (intersection langues) */
export function filterValidationTasksForUser(
  userLanguages: string[],
): CulturalValidationTask[] {
  const set = new Set(userLanguages);
  return CULTURAL_VALIDATION_TASKS.filter((task) =>
    task.languages.some((lang) => set.has(lang) && task.questions[lang]),
  );
}

/** Langues de question possibles pour cette tâche et ce profil */
export function availableQuestionLanguages(
  task: CulturalValidationTask,
  userLanguages: string[],
): string[] {
  const set = new Set(userLanguages);
  return task.languages.filter((lang) => set.has(lang) && task.questions[lang]);
}

/** Langue d'affichage : langue app si possible, sinon première langue commune */
export function pickQuestionLanguage(
  task: CulturalValidationTask,
  appLanguage: AppLanguage,
  userLanguages: string[],
): string | null {
  const available = availableQuestionLanguages(task, userLanguages);
  if (available.length === 0) return null;
  if (available.includes(appLanguage)) return appLanguage;
  return (
    defaultSourceLanguage(appLanguage, available) ??
    available[0] ??
    null
  );
}

export function getTaskQuestion(
  task: CulturalValidationTask,
  lang: string,
): string {
  return task.questions[lang] ?? task.questions[task.languages[0]] ?? "";
}

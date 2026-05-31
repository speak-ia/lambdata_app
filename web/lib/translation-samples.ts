/** Phrases de démo par langue source (à remplacer par l’API plus tard) */
export const TRANSLATION_SAMPLES: Record<string, string[]> = {
  fr: [
    "Bonjour, comment allez-vous ?",
    "Le riz est prêt.",
    "Merci pour votre contribution.",
  ],
  en: [
    "Hello, how are you?",
    "The rice is ready.",
    "Thank you for your contribution.",
  ],
  ar: [
    "مرحبا، كيف حالك؟",
    "الأرز جاهز.",
    "شكرا على مساهمتك.",
  ],
  pt: [
    "Olá, como está?",
    "O arroz está pronto.",
    "Obrigado pela sua contribuição.",
  ],
  sw: [
    "Habari, hujambo?",
    "Wali uko tayari.",
    "Asante kwa mchango wako.",
  ],
  wo: [
    "Nanga def?",
    "Malo bi pare na.",
  ],
  bm: [
    "I ni ce",
    "Malo bɛna.",
  ],
  ha: [
    "Sannu, yaya kuke?",
    "Shinkafa ta shirya.",
  ],
  yo: [
    "Bawo ni?",
    "Iresi ti setan.",
  ],
};

export function getSamplePhrase(lang: string, index: number): string {
  const list = TRANSLATION_SAMPLES[lang] ?? TRANSLATION_SAMPLES.fr;
  return list[index % list.length];
}

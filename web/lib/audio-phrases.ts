/** Phrases à lire à voix haute, par langue de contribution */
export const AUDIO_PHRASES: Record<string, string[]> = {
  fr: [
    "Les pluies du Sahel nourrissent nos récoltes.",
    "Le marché de Dakar s'anime à l'aube.",
    "Merci pour votre contribution à Lambdata.",
  ],
  wo: [
    "Tawat yi di wër ci Sahel.",
    "Marche bi ci Dakar dafay mel.",
  ],
  bm: [
    "Sanjiw fanga ka ɲɛɲiniw sɔrɔ Sahel kɔnɔ.",
    "Dugu mara ka di Bamakɔ.",
  ],
  dyu: [
    "Sanjiw bɛ sɔrɔ ka ɲɛ Sahel kɔnɔ.",
    "Marche in ka di su fɛ.",
  ],
  en: [
    "The rains of the Sahel nourish our harvests.",
    "The market comes alive at dawn.",
  ],
  sw: [
    "Mvua za Sahel hulisha mavuno yetu.",
    "Soko linaamka alfajiri.",
  ],
  ha: [
    "Ruwan sama na Sahel suna ciyar da amfanin gona.",
  ],
};

export function getAudioPhrasesForLanguages(languageCodes: string[]): {
  lang: string;
  text: string;
}[] {
  const items: { lang: string; text: string }[] = [];
  for (const lang of languageCodes) {
    const list = AUDIO_PHRASES[lang];
    if (!list) continue;
    for (const text of list) {
      items.push({ lang, text });
    }
  }
  if (items.length === 0) {
    for (const text of AUDIO_PHRASES.fr) {
      items.push({ lang: "fr", text });
    }
  }
  return items;
}

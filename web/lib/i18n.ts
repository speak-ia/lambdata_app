import type { AppLanguage } from "@/types";

const messages: Record<
  AppLanguage,
  {
    settings: string;
    appLanguage: string;
    appLanguageHint: string;
    saved: string;
    contributionLanguages: string;
    country: string;
    ethnicity: string;
    profileStepTitle: string;
    profileStepSubtitle: string;
    continue: string;
    selectAtLeastOneLanguage: string;
    selectCountry: string;
    selectEthnicity: string;
  }
> = {
  fr: {
    settings: "Paramètres",
    appLanguage: "Langue de l'application",
    appLanguageHint: "Interface et textes généraux",
    saved: "Préférences enregistrées",
    contributionLanguages: "Langues de contribution",
    country: "Pays",
    ethnicity: "Ethnie / communauté",
    profileStepTitle: "Votre profil contributeur",
    profileStepSubtitle:
      "Aidez-nous à orienter les missions vers vos langues et votre contexte.",
    continue: "Continuer",
    selectAtLeastOneLanguage: "Choisissez au moins une langue de contribution",
    selectCountry: "Choisissez votre pays",
    selectEthnicity: "Choisissez une ethnie ou communauté",
  },
  en: {
    settings: "Settings",
    appLanguage: "App language",
    appLanguageHint: "Interface and general labels",
    saved: "Preferences saved",
    contributionLanguages: "Contribution languages",
    country: "Country",
    ethnicity: "Ethnicity / community",
    profileStepTitle: "Your contributor profile",
    profileStepSubtitle:
      "Help us match missions to your languages and context.",
    continue: "Continue",
    selectAtLeastOneLanguage: "Pick at least one contribution language",
    selectCountry: "Select your country",
    selectEthnicity: "Select an ethnicity or community",
  },
  ar: {
    settings: "الإعدادات",
    appLanguage: "لغة التطبيق",
    appLanguageHint: "واجهة التطبيق والنصوص العامة",
    saved: "تم حفظ التفضيلات",
    contributionLanguages: "لغات المساهمة",
    country: "البلد",
    ethnicity: "العرق / المجتمع",
    profileStepTitle: "ملفك كمساهم",
    profileStepSubtitle: "ساعدنا في توجيه المهام إلى لغاتك وسياقك.",
    continue: "متابعة",
    selectAtLeastOneLanguage: "اختر لغة مساهمة واحدة على الأقل",
    selectCountry: "اختر بلدك",
    selectEthnicity: "اختر عرقًا أو مجتمعًا",
  },
  pt: {
    settings: "Definições",
    appLanguage: "Idioma da aplicação",
    appLanguageHint: "Interface e textos gerais",
    saved: "Preferências guardadas",
    contributionLanguages: "Línguas de contribuição",
    country: "País",
    ethnicity: "Etnia / comunidade",
    profileStepTitle: "O seu perfil de contribuidor",
    profileStepSubtitle:
      "Ajude-nos a direcionar missões às suas línguas e contexto.",
    continue: "Continuar",
    selectAtLeastOneLanguage: "Escolha pelo menos uma língua de contribuição",
    selectCountry: "Escolha o seu país",
    selectEthnicity: "Escolha uma etnia ou comunidade",
  },
  sw: {
    settings: "Mipangilio",
    appLanguage: "Lugha ya programu",
    appLanguageHint: "Kiolesura na maandishi ya jumla",
    saved: "Mapendeleo yamehifadhiwa",
    contributionLanguages: "Lugha za kuchangia",
    country: "Nchi",
    ethnicity: "Kabila / jamii",
    profileStepTitle: "Wasifu wako wa mchangiaji",
    profileStepSubtitle:
      "Tusaidie kuelekeza kazi kwa lugha na muktadha wako.",
    continue: "Endelea",
    selectAtLeastOneLanguage: "Chagua angalau lugha moja ya kuchangia",
    selectCountry: "Chagua nchi yako",
    selectEthnicity: "Chagua kabila au jamii",
  },
};

export function t(lang: AppLanguage) {
  return messages[lang] ?? messages.fr;
}

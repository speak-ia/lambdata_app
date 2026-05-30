import type { TaskModule } from "@/types";

export const APP_NAME = "Lambdata";
export const APP_TAGLINE =
  "Infrastructure africaine souveraine de collecte de données IA";

export const AFRICAN_LANGUAGES = [
  { code: "bm", label: "Bambara" },
  { code: "fr", label: "Français" },
  { code: "en", label: "Anglais" },
  { code: "wo", label: "Wolof" },
  { code: "ff", label: "Peulh" },
  { code: "dyu", label: "Dioula" },
  { code: "ha", label: "Hausa" },
] as const;

export const AFRICAN_COUNTRIES = [
  { code: "SN", label: "Sénégal", flag: "🇸🇳" },
  { code: "ML", label: "Mali", flag: "🇲🇱" },
  { code: "CI", label: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "BF", label: "Burkina Faso", flag: "🇧🇫" },
  { code: "GN", label: "Guinée", flag: "🇬🇳" },
  { code: "NG", label: "Nigeria", flag: "🇳🇬" },
  { code: "CM", label: "Cameroun", flag: "🇨🇲" },
  { code: "KE", label: "Kenya", flag: "🇰🇪" },
] as const;

export const TASK_MODULES: TaskModule[] = [
  {
    id: "audio",
    title: "Collecte vocale",
    description: "Enregistrez des phrases dans vos langues",
    icon: "Mic",
    color: "from-violet-400/30 to-violet-600/10",
    href: "/tasks/audio",
    available: true,
  },
  {
    id: "translation",
    title: "Traduction",
    description: "Traduisez phrase par phrase",
    icon: "Languages",
    color: "from-sky-400/30 to-sky-600/10",
    href: "/tasks/translation",
    available: true,
  },
  {
    id: "image",
    title: "Images culturelles",
    description: "Capturez et annotez des images",
    icon: "Camera",
    color: "from-amber-400/30 to-amber-600/10",
    href: "/tasks/image",
    available: true,
  },
  {
    id: "video",
    title: "Vidéos courtes",
    description: "Contribuez des vidéos locales",
    icon: "Video",
    color: "from-rose-400/30 to-rose-600/10",
    href: "/tasks/video",
    available: false,
  },
  {
    id: "validation",
    title: "Validation communautaire",
    description: "Validez les contributions des autres",
    icon: "CheckCircle2",
    color: "from-emerald-400/30 to-emerald-600/10",
    href: "/tasks/validation",
    available: true,
  },
  {
    id: "text",
    title: "Texte & correction",
    description: "Corrigez et classifiez du texte",
    icon: "FileText",
    color: "from-teal-400/30 to-teal-600/10",
    href: "/tasks/text",
    available: false,
  },
];

export const XP_PER_LEVEL = 10000;

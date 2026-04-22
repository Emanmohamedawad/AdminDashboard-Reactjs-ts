import enTranslations from "./en.json";
import arTranslations from "./ar.json";

export type Language = "en" | "ar";

export interface Translation {
  [key: string]: string | Translation;
}

export const translations: Record<Language, Translation> = {
  en: enTranslations,
  ar: arTranslations,
};

export const defaultLanguage: Language = "en";

export const languages = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
] as const;

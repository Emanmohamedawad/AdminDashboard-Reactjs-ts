import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { translations, defaultLanguage, type Language } from "../i18n";

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage first
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage) {
      console.log("Loading saved language:", savedLanguage);
      return savedLanguage;
    }
    // Check browser language
    const browserLanguage = navigator.language.split("-")[0] as Language;
    if (browserLanguage === "ar") {
      console.log("Detected Arabic browser language");
      return "ar";
    }
    console.log("Using default language:", defaultLanguage);
    return defaultLanguage;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("language", language);
    console.log("Language changed to:", language);
    // Update document direction for RTL support
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>) => {
    let translation: string | undefined;

    // Handle nested keys (e.g., "common.dashboard")
    const keys = key.split(".");
    let current: string | Record<string, unknown> = translations[language];

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = (current as Record<string, unknown>)[k] as
          | string
          | Record<string, unknown>;
      } else {
        current = key; // fallback to key if not found
        break;
      }
    }

    translation = typeof current === "string" ? current : key;

    // Replace parameters in translation string
    if (params && typeof translation === "string") {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation!.replace(
          `{{${paramKey}}}`,
          String(paramValue),
        );
      });
    }

    return translation;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

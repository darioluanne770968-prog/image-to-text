"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Locale } from "./translations";

// All supported locales
const SUPPORTED_LOCALES: Locale[] = ["en", "zh", "es", "pt", "id", "fr", "de"];

type Translations = (typeof translations)[Locale];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Map browser language codes to our supported locales
function detectLocaleFromBrowser(browserLang: string): Locale | null {
  // Direct matches and common variants
  if (browserLang.startsWith("zh")) return "zh";
  if (browserLang.startsWith("es")) return "es";
  if (browserLang.startsWith("pt")) return "pt";
  if (browserLang.startsWith("id")) return "id";
  if (browserLang.startsWith("fr")) return "fr";
  if (browserLang.startsWith("de")) return "de";
  if (browserLang.startsWith("en")) return "en";
  return null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
      setLocaleState(savedLocale);
    } else {
      // Detect browser language and map to supported locale
      const browserLang = navigator.language.toLowerCase();
      const detectedLocale = detectLocaleFromBrowser(browserLang);
      if (detectedLocale) {
        setLocaleState(detectedLocale);
      }
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

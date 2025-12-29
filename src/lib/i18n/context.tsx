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

type Translations = typeof translations.en | typeof translations.zh;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale && (savedLocale === "en" || savedLocale === "zh")) {
      setLocaleState(savedLocale);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("zh")) {
        setLocaleState("zh");
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

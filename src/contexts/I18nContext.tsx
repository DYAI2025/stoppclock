import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dict, Lang } from "@/i18n";

type I18nContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = "stoppclock-lang";

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "en" || saved === "de") return saved;
    // Derive from browser
    const nav = navigator.language || navigator.languages?.[0] || "en";
    return nav.startsWith("de") ? "de" : "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string, params?: Record<string, string | number>) => {
    const entry = (dict as any)[key];
    let text: string = entry ? entry[lang] ?? entry["en"] ?? key : key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return text;
  };

  const value = useMemo<I18nContextType>(() => ({
    lang,
    setLang,
    t,
    locale: lang === "de" ? "de-DE" : "en-US",
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};


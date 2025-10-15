import React from "react";
import { useI18n } from "@/contexts/I18nContext";

const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useI18n();
  return (
    <div className="fixed top-2 right-2 z-40 text-xs text-muted-foreground/80">
      <button
        className="px-2 py-1 rounded hover:underline"
        onClick={() => setLang(lang === "en" ? "de" : "en")}
        aria-label="Toggle language"
      >
        {lang === "en" ? "EN • DE" : "DE • EN"}
      </button>
    </div>
  );
};

export default LanguageToggle;


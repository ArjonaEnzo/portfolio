"use client";
import React, { useContext } from "react";

type Language = "ESP" | "ENG";
type LanguageContextProviderProps = {
  children: React.ReactNode;
};

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
};
const LanguageContext = React.createContext<LanguageContextType | null>(null);

export default function LanguageContextProvider({
  children,
}: LanguageContextProviderProps) {
  const [language, setLanguage] = React.useState<Language>("ESP");

  // Pick the initial language: ?lang=en|es in the link wins (so a job
  // application can point to the English version), then the visitor's last
  // choice, then the browser language. Spanish is only the SSR fallback.
  React.useEffect(() => {
    try {
      const param = new URLSearchParams(window.location.search)
        .get("lang")
        ?.toLowerCase();
      if (param === "en" || param === "es") {
        setLanguage(param === "en" ? "ENG" : "ESP");
        return;
      }
      const stored = window.localStorage.getItem("language");
      if (stored === "ENG" || stored === "ESP") {
        setLanguage(stored);
        return;
      }
      const browser = (navigator.language || "").toLowerCase();
      setLanguage(browser.startsWith("es") ? "ESP" : "ENG");
    } catch {}
  }, []);

  // Keep <html lang> in sync for screen readers and search engines.
  React.useEffect(() => {
    document.documentElement.lang = language === "ENG" ? "en" : "es";
  }, [language]);

  const toggleLanguage = () => {
    const next: Language = language === "ESP" ? "ENG" : "ESP";
    setLanguage(next);
    try {
      window.localStorage.setItem("language", next);
    } catch {}
  };
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error(
      "useLanguage must be used within a LanguageContextProvider"
    );
  }
  return context;
}

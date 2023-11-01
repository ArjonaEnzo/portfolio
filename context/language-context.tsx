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
  const toggleLanguage = () => {
    if (language === "ESP") {
      setLanguage("ENG");
    } else {
      setLanguage("ESP");
    }
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

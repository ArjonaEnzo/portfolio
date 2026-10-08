"use client";
import { useTheme } from "@/context/theme-context";
import { useLanguage } from "@/context/language-context";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();

  const label =
    theme === "light"
      ? language === "ENG"
        ? "Switch to dark mode"
        : "Cambiar a modo oscuro"
      : language === "ENG"
      ? "Switch to light mode"
      : "Cambiar a modo claro";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="fixed bottom-4 right-4 bg-frieren-600 w-[2.5rem] h-[2.5rem] md:bottom-5 md:right-5 md:w-[3rem] md:h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-frieren-600 border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-fern-700 dark:border-fern-700"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <BsSun aria-hidden="true" />
      ) : (
        <BsMoon aria-hidden="true" />
      )}
    </button>
  );
}

"use client";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";
import React from "react";
import ES from "@/public/ES.png";
import EN from "@/public/EN.png";

export default function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage();
  const label =
    language === "ESP" ? "Switch to English" : "Cambiar a español";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={label}
      title={label}
      className="fixed bottom-[4.25rem] right-4 w-[2.5rem] h-[2.5rem] md:bottom-auto md:top-5 md:right-5 md:w-[3rem] md:h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-frieren-400 border-opacity-40 dark:border-fern-700 dark:border-opacity-60 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all cursor-pointer"
    >
      <Image
        src={language === "ESP" ? ES : EN}
        width={60}
        alt=""
        className="h-7 w-7 md:h-9 md:w-9"
      />
    </button>
  );
}

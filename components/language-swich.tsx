"use client";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";
import React from "react";
import ES from "@/public/ES.png";
import EN from "@/public/EN.png";
export default function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <div
      onClick={toggleLanguage}
      className="fixed bottom-20 md:top-5 right-5 w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem]  border border-violet-600 border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all  cursor-pointer"
    >
      <Image src={language === "ESP" ? ES : EN} width={60} alt="Lang" />
    </div>
  );
}

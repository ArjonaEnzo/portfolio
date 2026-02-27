"use client";
import React from "react";
import { useLanguage } from "@/context/language-context";

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="mb-10 px-4 text-center text-frieren-950">
      <small className="mb-2 block text-xs dark:text-white/70">
        {language === "ENG"
          ? "Designed & coded with 🧉 from Mendoza, Argentina to the world."
          : "Diseñado y codeado con 🧉 desde Mendoza, Argentina para el mundo."}
      </small>
      <p className="text-xs dark:text-white/70">
        <span className="font-semibold dark:text-white/70">
          {language === "ENG" ? "Built with:" : "Construido con:"}
        </span>{" "}
        React & Next.js, TypeScript, Tailwind CSS, Framer Motion, Resend, Vercel.
      </p>
    </footer>
  );
}

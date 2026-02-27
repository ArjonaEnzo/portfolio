"use client";
import { useTheme } from "@/context/theme-context";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwich() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="fixed bottom-5 right-5 bg-frieren-600 w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-frieren-600 border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-fern-700 dark:border-fern-700"
      onClick={toggleTheme}
    >
      {theme === "light" ? <BsSun /> : <BsMoon />}
    </button>
  );
}

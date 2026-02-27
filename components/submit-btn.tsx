"use client";
import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { useLanguage } from "@/context/language-context";

export const SubmitBtn = () => {
  const { pending } = useFormStatus();
  const { language } = useLanguage();

  return (
    <button
      type="submit"
      className="group flex items-center justify-center gap-2 h-[3rem] w-[8rem] bg-frieren-700 text-white rounded-full outline-none transition-all focus:scale-110 hover:scale-110 hover:bg-frieren-800 active:scale-105 disabled:scale-100 disabled:bg-opacity-75 dark:bg-fern-800 dark:hover:bg-fern-900 dark:text-white"
      disabled={pending}
    >
      {pending ? (
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
      ) : (
        <>
          {language === "ENG" ? "Submit" : "Enviar"}
          <FaPaperPlane className="text-xs opacity-70 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
        </>
      )}
    </button>
  );
};

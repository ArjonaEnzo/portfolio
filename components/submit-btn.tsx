"use client";
import React from "react";
import { TbSend } from "react-icons/tb";
import { useFormStatus } from "react-dom";
import { useLanguage } from "@/context/language-context";

export const SubmitBtn = () => {
  const { pending } = useFormStatus();
  const { language } = useLanguage();

  return (
    <button
      type="submit"
      className="cl-btn mt-2 inline-flex h-11 items-center justify-center gap-2 self-start px-5 disabled:opacity-70"
      disabled={pending}
    >
      {pending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-b-transparent" aria-hidden />
      ) : (
        <TbSend aria-hidden />
      )}
      {language === "ENG" ? "Send" : "Enviar"}
    </button>
  );
};

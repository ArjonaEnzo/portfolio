"use client";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

/** Fixed pill on the classic portfolio that opens the 3D room. */
export default function DeskSwitch() {
  const { language } = useLanguage();
  const label = language === "ENG" ? "Open the 3D room" : "Abrir el cuarto 3D";
  return (
    <Link
      href="/desk"
      // The 3D room is heavy and opt-in: don't fetch it while browsing the classic page.
      prefetch={false}
      aria-label={label}
      title={label}
      className="fixed bottom-4 left-4 z-40 flex h-[2.5rem] items-center gap-2 rounded-full border border-frieren-600 border-opacity-40 bg-frieren-600 bg-opacity-80 px-4 text-sm font-medium shadow-2xl backdrop-blur-[0.5rem] transition-all hover:scale-[1.08] active:scale-105 dark:border-fern-700 dark:bg-fern-700 md:bottom-5 md:left-5 md:h-[3rem]"
    >
      <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[#f0a6ca]" />
      {language === "ENG" ? "3D room" : "Cuarto 3D"}
    </Link>
  );
}

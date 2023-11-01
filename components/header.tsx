"use client";
import React from "react";
import { motion } from "framer-motion";
import { links, linksESP } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useLanguage } from "@/context/language-context";

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

  const { language, toggleLanguage } = useLanguage();
  const header = language === "ESP" ? linksESP : links;
  return (
    <header className="z-[100] relative">
      <motion.div
        className={clsx(
          "fixed top-0 left-1/2 h-[4.5rem] w-full rounded-none border border-violet-400 border-opacity-40 bg-violet-400 bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6 sm:h-[3.25rem] sm:w-[36rem] sm:rounded-full ",
          { "sm:w-[41.5rem]": language === "ESP" }
        )}
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      ></motion.div>
      <nav className="flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0">
        <ul className="flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-black sm:w-[40rem] sm:flex-nowrap sm:gap-5">
          {header.map((link) => (
            <motion.li
              onClick={() => {
                setActiveSection(link.name);
                setTimeOfLastClick(Date.now);
              }}
              className="h-3/4 flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className={clsx(
                  "flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition dark:text-white/70",
                  {
                    "text-gray-950": activeSection === link.name,
                  }
                )}
                href={link.hash}
              >
                {link.name}

                {link.name === activeSection && (
                  <motion.span
                    className="bg-violet-500 rounded-full absolute inset-0 -z-10 "
                    layoutId="activeSection"
                    transition={{
                      type: " spring ",
                      stiffness: 380,
                      damping: 30,
                    }}
                  ></motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

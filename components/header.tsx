"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { links, linksESP } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useLanguage } from "@/context/language-context";

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

  const { language } = useLanguage();
  const header = language === "ESP" ? linksESP : links;

  const { scrollY } = useScroll();
  const headerShadow = useTransform(
    scrollY,
    [0, 80],
    ["0 1px 3px rgba(0,0,0,0.04)", "0 6px 28px rgba(0,0,0,0.14)"]
  );

  return (
    <header className="z-[100] relative">
      <motion.div
        className={clsx(
          "fixed top-0 left-1/2 h-[4.5rem] w-full bg-white/60 backdrop-blur-[0.5rem] border border-white/40 sm:top-6 sm:h-[3.25rem] sm:w-[36rem] sm:rounded-full dark:bg-fern-950/60 dark:border-white/10",
          { "sm:w-[41.5rem]": language === "ESP" }
        )}
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        style={{ boxShadow: headerShadow }}
      ></motion.div>
      <nav className="fixed top-0 left-0 right-0 h-[4.5rem] flex items-center py-3 overflow-x-auto no-scrollbar sm:top-6 sm:left-1/2 sm:right-auto sm:h-[3.25rem] sm:py-0 sm:-translate-x-1/2 sm:overflow-x-visible">
        <ul className="flex flex-nowrap items-center gap-x-1 mx-auto px-2 text-[0.9rem] font-medium text-frieren-950 sm:gap-5 sm:px-0">
          {header.map((link) => (
            <motion.li
              onClick={() => {
                setActiveSection(link.name);
                setTimeOfLastClick(Date.now());
              }}
              className="flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className={clsx(
                  "flex w-full items-center justify-center whitespace-nowrap px-3 py-2 rounded-full hover:bg-frieren-200/60 dark:hover:bg-fern-800/60 transition dark:text-white/70",
                  {
                    "text-frieren-950 dark:text-white": activeSection === link.name,
                  }
                )}
                href={link.hash}
              >
                {link.name}

                {link.name === activeSection && (
                  <motion.span
                    className="bg-frieren-500 rounded-full absolute inset-0 -z-10 dark:bg-fern-700"
                    layoutId="activeSection"
                    transition={{
                      type: "spring",
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

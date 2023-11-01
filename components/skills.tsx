"use client";
import React from "react";
import { SectionHeading } from "./section-heading";
import { skillsData } from "@/lib/data";
import { useSectioninView } from "@/lib/hooks";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function Skills() {
  const { language, toggleLanguage } = useLanguage();
  const sectionName = language === "ENG" ? "Skills" : "Habilidades";
  const { ref } = useSectioninView(sectionName);

  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * index,
      },
    }),
  };

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40"
    >
      <SectionHeading>
        {language === "ENG" ? "My skills" : "Mis habilidades"}
      </SectionHeading>
      <ul className="flex flex-wrap justify-center gap-2 text-lg text-black dark:text-white/70">
        {skillsData.map((skill, index) => (
          <motion.li
            className="bg-violet-900 borderBlack rounded-xl px-5 py-3"
            key={index}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            custom={index}
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

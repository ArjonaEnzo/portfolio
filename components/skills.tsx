"use client";
import React from "react";
import { SectionHeading } from "./section-heading";
import { skillsData } from "@/lib/data";
import { skillIcons } from "@/lib/skills-icons";
import { useSectioninView } from "@/lib/hooks";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function Skills() {
  const { language } = useLanguage();
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
      <ul className="flex flex-wrap justify-center gap-2 text-lg text-white dark:text-white/80">
        {skillsData.map((skill, index) => {
          const Icon = skillIcons[skill];
          return (
            <motion.li
              className="bg-frieren-700 borderBlack rounded-xl px-5 py-3 flex items-center gap-2 dark:bg-fern-800 dark:hover:shadow-md dark:hover:shadow-fern-500/25 transition-shadow"
              key={index}
              variants={fadeInAnimationVariants}
              initial="initial"
              whileInView="animate"
              whileHover={{ scale: 1.07, transition: { type: "spring", stiffness: 400, damping: 17 } }}
              viewport={{
                once: true,
              }}
              custom={index}
            >
              {Icon && <Icon className="text-base opacity-80" />}
              {skill}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

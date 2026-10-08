"use client";
import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { SectionHeading } from "./section-heading";
import { skillGroups, skillGroupLabels } from "@/lib/skills";
import { useSectionInView } from "@/lib/hooks";
import { useLanguage } from "@/context/language-context";

const fadeInAnimationVariants = {
  initial: { opacity: 0, y: 40 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.03 * index },
  }),
};

export default function Skills() {
  const { language } = useLanguage();
  const sectionName = language === "ENG" ? "Skills" : "Habilidades";
  const { ref } = useSectionInView(sectionName, 0.3);
  const labels = skillGroupLabels[language];

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-28 max-w-[60rem] scroll-mt-28 text-center sm:mb-40"
    >
      <SectionHeading>
        {language === "ENG" ? "Skills" : "Habilidades"}
      </SectionHeading>

      <div className="flex flex-col gap-8">
        {skillGroups.map((group) => {
          const isCore = group.id === "core";
          return (
            <div key={group.id}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-frieren-700 dark:text-white/60">
                {labels[group.id]}
              </h3>
              <ul className="flex flex-wrap justify-center gap-2">
                {group.skills.map((skill, index) => {
                  const Icon = skill.icon;
                  return (
                    <motion.li
                      key={skill.name}
                      className={clsx(
                        "flex items-center gap-2 whitespace-nowrap rounded-xl borderBlack transition-shadow",
                        isCore
                          ? "bg-frieren-700 px-5 py-3 text-base text-white dark:bg-fern-800 dark:text-white/90 dark:hover:shadow-md dark:hover:shadow-fern-500/25"
                          : "bg-frieren-100/80 px-4 py-2 text-sm text-frieren-950 dark:bg-fern-900/80 dark:text-white/80"
                      )}
                      variants={fadeInAnimationVariants}
                      initial="initial"
                      whileInView="animate"
                      whileHover={{
                        scale: 1.06,
                        transition: { type: "spring", stiffness: 400, damping: 17 },
                      }}
                      viewport={{ once: true }}
                      custom={index}
                    >
                      {Icon && <Icon className="text-base opacity-80" aria-hidden="true" />}
                      {skill.name}
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

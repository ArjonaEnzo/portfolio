"use client";
import React from "react";
import { motion } from "framer-motion";
import { CgWorkAlt } from "react-icons/cg";
import { LuGraduationCap } from "react-icons/lu";
import { SectionHeading } from "./section-heading";
import {
  experienceData,
  experienceLabels,
  type ExperienceItem,
  type ExperienceKind,
} from "@/lib/experience";
import { useSectionInView } from "@/lib/hooks";
import { useLanguage } from "@/context/language-context";

function ExperienceColumn({
  kind,
  title,
  items,
  currentLabel,
}: {
  kind: ExperienceKind;
  title: string;
  items: readonly ExperienceItem[];
  currentLabel: string;
}) {
  const Icon = kind === "work" ? CgWorkAlt : LuGraduationCap;

  return (
    <div>
      <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-frieren-900 dark:text-white/90">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-frieren-600 text-white dark:bg-fern-600">
          <Icon aria-hidden="true" />
        </span>
        {title}
      </h3>

      <ol className="relative ml-4 border-l border-frieren-300/70 dark:border-fern-700">
        {items.map((item, index) => (
          <motion.li
            key={`${item.organization}-${item.period}`}
            className="relative mb-8 pl-6 last:mb-0"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <span
              aria-hidden="true"
              className="absolute -left-[0.4rem] top-2 h-3 w-3 rounded-full border-2 border-frieren-50 bg-frieren-600 dark:border-[#0d0a1a] dark:bg-fern-400"
            />
            <div className="tile-fx rounded-2xl border border-black/5 bg-frieren-800 p-5 text-white shadow-md shadow-frieren-900/10 dark:border-white/5 dark:bg-fern-900">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-xs font-medium uppercase tracking-widest text-white/75">
                  {item.period}
                </p>
                {item.current && (
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white">
                    {currentLabel}
                  </span>
                )}
              </div>
              <h4 className="mt-1 text-base font-semibold leading-snug text-white text-balance">
                {item.role}
              </h4>
              <p className="text-sm font-medium text-white/70">
                {item.organization}
                {item.location ? ` · ${item.location}` : ""}
              </p>
              {item.highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-white/80">
                  {item.highlights.map((text) => (
                    <li key={text} className="flex gap-2">
                      <span aria-hidden="true" className="mt-[0.55rem] h-1 w-1 flex-shrink-0 rounded-full bg-white/60" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default function Experience() {
  const { language } = useLanguage();
  const labels = experienceLabels[language];
  const sectionName = language === "ENG" ? "Experience" : "Experiencia";
  const { ref } = useSectionInView(sectionName, 0.2);

  const items = experienceData[language];
  const work = items.filter((i) => i.kind === "work");
  const education = items.filter((i) => i.kind === "education");

  return (
    <section
      id="experience"
      ref={ref}
      className="scroll-mt-28 mb-28 w-full max-w-[72rem] px-0 sm:px-4 sm:mb-40"
    >
      <SectionHeading>{labels.heading}</SectionHeading>
      <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-10">
        <ExperienceColumn
          kind="work"
          title={labels.work}
          items={work}
          currentLabel={labels.current}
        />
        <ExperienceColumn
          kind="education"
          title={labels.education}
          items={education}
          currentLabel={labels.current}
        />
      </div>
    </section>
  );
}

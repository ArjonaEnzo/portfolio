"use client";

import React from "react";
import { SectionHeading } from "./section-heading";
import Project from "./project";
import { getProjects } from "@/lib/projects";
import { useSectionInView } from "@/lib/hooks";
import { useLanguage } from "@/context/language-context";

export const Projects = () => {
  const { language } = useLanguage();
  const isEnglish = language === "ENG";
  const sectionName = isEnglish ? "Projects" : "Proyectos";
  const { ref } = useSectionInView(sectionName, 0.3);

  const projects = getProjects(language);
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section
      ref={ref}
      id="projects"
      className="scroll-mt-28 mb-28 w-full max-w-[72rem] mx-auto px-0 sm:px-4"
    >
      <SectionHeading>{isEnglish ? "Projects" : "Proyectos"}</SectionHeading>
      <p className="-mt-4 mb-10 text-center text-frieren-800 dark:text-white/70 max-w-[40rem] mx-auto">
        {isEnglish
          ? "Real products with real users. Each card shows the problem, what I built and the result."
          : "Productos reales con usuarios reales. Cada card muestra el problema, qué construí y el resultado."}
      </p>

      <div className="flex flex-col gap-8">
        {featured.map((project) => (
          <Project key={project.slug} project={project} />
        ))}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((project) => (
            <Project key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

"use client";
import React from "react";
import { SectionHeading } from "./section-heading";
import { projectsData, projectsDataEsp } from "@/lib/data";
import Project from "./project";

import { useSectioninView } from "@/lib/hooks";
import { useLanguage } from "@/context/language-context";
export const Projects = () => {
  const { language, toggleLanguage } = useLanguage();
  const sectionName = language === "ENG" ? "Projects" : "Proyectos";
  const { ref } = useSectioninView(sectionName, 0.5);

  const projects = language === "ENG" ? projectsData : projectsDataEsp;

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28">
      <SectionHeading>
        {language === "ENG" ? "My Projects" : "Mis proyectos"}
      </SectionHeading>
      <div>
        {projects.map((projects, index) => (
          <React.Fragment key={index}>
            <Project {...projects} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

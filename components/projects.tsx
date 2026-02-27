"use client";

import React, { useState, useEffect, useRef } from "react";
import { SectionHeading } from "./section-heading";
import { projectsData, projectsDataEsp } from "@/lib/data";
import Project from "./project";
import { useSectioninView } from "@/lib/hooks";
import { useLanguage } from "@/context/language-context";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Projects = () => {
  const { language } = useLanguage();

  const sectionName = language === "ENG" ? "Projects" : "Proyectos";
  const { ref } = useSectioninView(sectionName, 0.5);

  const scrollRef = useRef<HTMLDivElement>(null);

  const currentProjects = language === "ENG" ? projectsData : projectsDataEsp;
  const allLabel = language === "ENG" ? "All" : "Todos";

  const [activeFilter, setActiveFilter] = useState(allLabel);

  useEffect(() => {
    setActiveFilter(allLabel);
  }, [language, allLabel]);

  const uniqueTags = [
    allLabel,
    ...Array.from(new Set(currentProjects.flatMap((project) => project.tags))),
  ];

  const filteredProjects =
    activeFilter === allLabel
      ? currentProjects
      : currentProjects.filter((project) =>
          project.tags.includes(activeFilter),
        );

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={ref}
      id="projects"
      className="scroll-mt-28 mb-28 w-full max-w-[95vw] mx-auto relative"
    >
      <SectionHeading>
        {language === "ENG" ? "My Projects" : "Mis proyectos"}
      </SectionHeading>

      <div className="flex justify-center mb-8">
        <div className="relative">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="appearance-none bg-frieren-50 dark:bg-gray-800 border border-frieren-200 dark:border-white/10 rounded-full px-6 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-frieren-500 dark:focus:ring-fern-500 transition-all cursor-pointer shadow-sm"
          >
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-frieren-400">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 bg-frieren-50 dark:bg-gray-800 p-3 rounded-full shadow-lg border border-frieren-200/50 hover:scale-110 transition opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center text-frieren-600 dark:text-fern-400"
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-4 w-full no-scrollbar scroll-smooth"
        >
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="snap-center shrink-0 w-[85vw] md:w-[42rem]"
            >
              <Project {...project} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 bg-frieren-50 dark:bg-gray-800 p-3 rounded-full shadow-lg border border-frieren-200/50 hover:scale-110 transition opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center text-frieren-600 dark:text-fern-400"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

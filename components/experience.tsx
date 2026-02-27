"use client";
import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { SectionHeading } from "./section-heading";
import { experiencesData, experiencesDataEsp } from "@/lib/data";
import { useSectioninView } from "@/lib/hooks";
import { useLanguage } from "@/context/language-context";
import { useTheme } from "@/context/theme-context";

export default function Experience() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const sectionName = language === "ENG" ? "Experience" : "Experiencia";
  const { ref } = useSectioninView(sectionName);
  const experience = language === "ENG" ? experiencesData : experiencesDataEsp;

  const isDark = theme === "dark";

  return (
    <section id="experience" className="scroll-mt-28 mb-28 sm:mb-40" ref={ref}>
      <SectionHeading>
        {language === "ENG" ? "My experience" : "Mi experiencia"}
      </SectionHeading>
      <VerticalTimeline lineColor={isDark ? "#413558" : "#63478e"}>
        {experience.map((experienceItem, index) => (
          <React.Fragment key={index}>
            <VerticalTimelineElement
              className="vertical-timeline-element"
              visible={true}
              contentStyle={{
                background: isDark ? "#362d49" : "#533b75",
                boxShadow: "none",
                border: `1px solid ${isDark ? "#2d263b" : "#43315e"}`,
                textAlign: "left",
                padding: "1.3rem 2rem",
              }}
              contentArrowStyle={{
                borderRight: `0.4rem solid ${isDark ? "#2d263b" : "#43315e"}`,
              }}
              date={experienceItem.date}
              icon={experienceItem.icon}
              iconStyle={{
                background: isDark ? "#50416d" : "#7a5caa",
                fontSize: "1.5rem",
                color: isDark ? "#f4f3f7" : "#f4f3f7",
              }}
            >
              <h3 className="font-semibold capitalize">
                {experienceItem.title}
              </h3>
              <p className="!mt-1 !font-normal text-white/90 dark:text-white/70 text-pretty leading-relaxed break-words select-text">
                {experienceItem.description}
              </p>
            </VerticalTimelineElement>
          </React.Fragment>
        ))}
      </VerticalTimeline>
    </section>
  );
}

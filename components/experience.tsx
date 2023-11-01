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

export default function Experience() {
  const { language, toggleLanguage } = useLanguage();
  const sectionName = language === "ENG" ? "Experience" : "Experiencia";
  const { ref } = useSectioninView(sectionName);
  const experience = language === "ENG" ? experiencesData : experiencesDataEsp;
  return (
    <section id="experience" className="scroll-mt-28 mb-28 sm:mb-40" ref={ref}>
      <SectionHeading>
        {language === "ENG" ? "My experience" : "Mi experiencia"}
      </SectionHeading>
      <VerticalTimeline lineColor="#4c1d95">
        {experience.map((experienceItem, index) => (
          <React.Fragment key={index}>
            <VerticalTimelineElement
              className="vertical-timeline-element"
              visible={true}
              contentStyle={{
                background: "#4c1d95",
                boxShadow: "none",
                border: "1px solid #1e1b4b",
                textAlign: "left",
                padding: "1.3rem 2rem",
              }}
              contentArrowStyle={{
                borderRight: "0.4rem solid #1e1b4b",
              }}
              date={experienceItem.date}
              icon={experienceItem.icon}
              iconStyle={{
                background: "#6d28d9",
                fontSize: "1.5rem",
                color: "black",
              }}
            >
              <h3 className="font-semibold capitalize">
                {experienceItem.title}
              </h3>
              <p className="!mt-1 !font-normal text-black dark:text-white/70">
                {experienceItem.description}
              </p>
            </VerticalTimelineElement>
          </React.Fragment>
        ))}
      </VerticalTimeline>
    </section>
  );
}

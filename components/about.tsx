"use client";
import React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { useSectioninView } from "@/lib/hooks";
import { useLanguage } from "@/context/language-context";

export default function About() {
  const { language, toggleLanguage } = useLanguage();
  const sectionName = language === "ENG" ? "About" : "Sobre mi";
  const { ref } = useSectioninView(sectionName, 1);

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>
        {language === "ENG" ? "About me" : "Sobre mi"}
      </SectionHeading>
      {language === "ENG" ? (
        <>
          <p className="mb-3">
            I´m a person passionate about learning and growth, both on a
            personal level as well as{" "}
            <span className="font-medium">professional</span>
            ,I entered the world of technology with little prior knowledge
            through the SoyHenry BootCamp, to which I enrolled and learned{" "}
            <span className="font-medium">FullStack Developer development</span>
            . <span className="italic">Upon finishing it, I discovered </span> a
            real <span className="underline">passion</span> and constant
            challenge, which inspires me to always give my best. Currently, I´m
            studying{" "}
            <span className="font-medium">
              React, Next.js, Node.js, and TypeScript
            </span>
          </p>

          <p>
            <span className="italic">When I'm not programming</span>,I enjoy
            spending time with my family or friends, going to the gym and{" "}
            <span className="font-medium">read</span>. I feel that they are
            essential and contribute a lot to my{" "}
            <span className="font-medium">life.</span>
          </p>
        </>
      ) : (
        <>
          <p className="mb-3">
            Soy una persona apasionada por el aprendizaje y el crecimiento,
            tanto a nivel personal como{" "}
            <span className="font-medium">profesional</span>
            ,Ingresé al mundo de la tecnología sin apenas conocimientos previos
            a través del BootCamp de SoyHenry al cual me inscribi y alprendi el{" "}
            <span className="font-medium">
              desarrollo FullStack Developer
            </span>. <span className="italic">Al terminarlo descubrí </span> una
            verdadera <span className="underline">pasión</span> y desafío
            constante, lo que me inspira a dar siempre lo mejor de mí.
            Actualmente estudio{" "}
            <span className="font-medium">
              React, Next.js, Node.js, and TypeScript
            </span>
          </p>

          <p>
            <span className="italic">Cuando no programo me gusta</span>, pasar
            tiempo con mi familia o amigos, ir al gimnacio y{" "}
            <span className="font-medium">leer</span>.Siento que son
            fundamentales y aportan mucho a mi{" "}
            <span className="font-medium">vida.</span>
          </p>
        </>
      )}
    </motion.section>
  );
}

"use client";
import React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { useSectioninView } from "@/lib/hooks";
import { useLanguage } from "@/context/language-context";

export default function About() {
  const { language } = useLanguage();
  const sectionName = language === "ENG" ? "About" : "Sobre mi";
  const { ref } = useSectioninView(sectionName, 1);

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center text-lg leading-8 sm:mb-40 scroll-mt-28"
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
          <p className="mb-3 text-pretty leading-relaxed break-words select-text">
            My journey started in a{" "}
            <span className="font-medium">technical school</span> and was forged
            through an intensive bootcamp at{" "}
            <span className="font-medium">Henry</span>. Today, I apply that same
            discipline to web development. I love{" "}
            <span className="font-medium">fast technology</span>, clean code,
            and helping businesses land{" "}
            <span className="font-medium">real clients</span>.
          </p>

          <p className="text-pretty leading-relaxed break-words select-text">
            <span className="italic">When I&apos;m not coding</span>, I&apos;m
            likely training, enjoying a good{" "}
            <span className="font-medium">mate</span>, or building a new side
            project.
          </p>
        </>
      ) : (
        <>
          <p className="mb-3 text-pretty leading-relaxed break-words select-text">
            Comencé mi camino en una{" "}
            <span className="font-medium">escuela técnica</span> y me
            perfeccioné en el bootcamp de{" "}
            <span className="font-medium">Henry</span>. Hoy aplico esa misma
            disciplina desarrollando webs. Me gusta la tecnología que funciona{" "}
            <span className="font-medium">rápido</span>, el código limpio y
            ayudar a negocios a conseguir{" "}
            <span className="font-medium">clientes reales</span>.
          </p>

          <p className="text-pretty leading-relaxed break-words select-text">
            <span className="italic">Cuando no estoy programando</span>,
            seguramente me encuentres entrenando, tomando unos buenos{" "}
            <span className="font-medium">mates</span> o armando algún proyecto
            nuevo.
          </p>
        </>
      )}
    </motion.section>
  );
}

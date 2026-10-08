"use client";
import React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { useSectionInView } from "@/lib/hooks";
import { useLanguage } from "@/context/language-context";

export default function About() {
  const { language } = useLanguage();
  const isEnglish = language === "ENG";
  const sectionName = isEnglish ? "About" : "Sobre mí";
  const { ref } = useSectionInView(sectionName, 1);

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center text-lg leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>{isEnglish ? "About me" : "Sobre mí"}</SectionHeading>
      {isEnglish ? (
        <>
          <p className="mb-3 text-pretty leading-relaxed">
            I&apos;m a full-stack developer from Mendoza, Argentina. I started
            at a technical high school, trained at the{" "}
            <span className="font-medium">Henry</span> bootcamp and am now
            finishing a degree in software development. Since 2023 I&apos;ve
            shipped work for clients and agencies, and I built and
            launched <span className="font-medium">MyRent</span>, a
            rental-management SaaS that landlords use every day.
          </p>
          <p className="mb-3 text-pretty leading-relaxed">
            I care about the parts that make software trustworthy:{" "}
            <span className="font-medium">typed code</span>, database-level
            security, automated tests and CI, and clear error handling. I like
            owning a feature end to end, from the Postgres schema to the last
            pixel.
          </p>
          <p className="text-pretty leading-relaxed">
            <span className="italic">Off the keyboard</span> you&apos;ll find me
            training, sharing a <span className="font-medium">mate</span> or
            poking at a new side project.
          </p>
        </>
      ) : (
        <>
          <p className="mb-3 text-pretty leading-relaxed">
            Soy desarrollador full-stack de Mendoza, Argentina. Arranqué en una
            escuela técnica, me formé en el bootcamp de{" "}
            <span className="font-medium">Henry</span> y hoy estoy terminando
            la tecnicatura en desarrollo de software. Desde 2023 trabajo para
            clientes y agencias, y construí y lancé{" "}
            <span className="font-medium">MyRent</span>, un SaaS de gestión de
            alquileres que propietarios usan todos los días.
          </p>
          <p className="mb-3 text-pretty leading-relaxed">
            Me importa lo que hace confiable al software:{" "}
            <span className="font-medium">código tipado</span>, seguridad a
            nivel de base de datos, tests automatizados con CI y manejo claro
            de errores. Me gusta hacerme cargo de una feature de punta a punta,
            del esquema en Postgres al último píxel.
          </p>
          <p className="text-pretty leading-relaxed">
            <span className="italic">Lejos del teclado</span> me vas a
            encontrar entrenando, compartiendo unos{" "}
            <span className="font-medium">mates</span> o metiéndole a algún
            proyecto nuevo.
          </p>
        </>
      )}
    </motion.section>
  );
}

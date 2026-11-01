"use client";
import Image from "next/image";
import React from "react";
import { m } from "framer-motion";
import Link from "next/link";
import { BsArrowRight, BsGithub, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useLanguage } from "@/context/language-context";
import { SITE } from "@/lib/site";

const CV_PATH = "/cv-enzo-arjona.pdf";
// Hidden until the updated CV is in public/ (the current PDF has outdated items).
const SHOW_CV = false;

export default function Intro() {
  const { language } = useLanguage();
  const isEnglish = language === "ENG";
  const sectionName = isEnglish ? "Home" : "Inicio";

  const { ref } = useSectionInView(sectionName, 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  return (
    <section
      ref={ref}
      className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]"
      id="home"
    >
      <div className="flex items-center justify-center">
        <div className="relative animate-float">
          <m.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            <Image
              src="https://res.cloudinary.com/ddtjwx08b/image/upload/c_fill,g_face,w_400,h_400,f_auto,q_auto/v1697323330/Enzo.jpg"
              alt={
                isEnglish ? "Portrait of Enzo Arjona" : "Retrato de Enzo Arjona"
              }
              width="250"
              height="250"
              quality="85"
              // Shown at 160 px (192 px from sm): without sizes the 2x
              // candidate is 640 px wide on phones.
              sizes="(min-width: 640px) 192px, 160px"
              priority={true}
              className="h-40 w-40 sm:h-48 sm:w-48 rounded-full object-cover border-[0.35rem] border-frieren-200 dark:border-fern-700 shadow-[0_0_30px_rgba(148,124,189,0.40)] dark:shadow-[0_0_30px_rgba(65,53,88,0.60)]"
            />
          </m.div>
          <m.span
            className="absolute text-3xl sm:text-4xl bottom-0 right-0"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 125,
              delay: 0.1,
              duration: 0.7,
            }}
          >
            👋
          </m.span>
        </div>
      </div>

      <m.div
        className="mt-6 mb-8 px-4"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight !leading-tight">
          {isEnglish ? (
            <>
              Hi, I&apos;m{" "}
              <span className="text-frieren-700 dark:text-fern-300">
                Enzo Arjona
              </span>
              .
            </>
          ) : (
            <>
              Hola, soy{" "}
              <span className="text-frieren-700 dark:text-fern-300">
                Enzo Arjona
              </span>
              .
            </>
          )}
        </h1>

        <p className="mt-3 text-lg sm:text-2xl font-semibold text-frieren-900 dark:text-white/90">
          {isEnglish ? "Full-Stack Developer" : "Desarrollador Full-Stack"}
          <span className="text-frieren-500 dark:text-fern-400 font-medium">
            {" "}
            · Next.js, TypeScript, WordPress
          </span>
        </p>

        <p className="mt-5 text-base sm:text-lg leading-relaxed text-frieren-900/90 dark:text-white/80 text-pretty max-w-[40rem] mx-auto">
          {isEnglish ? (
            <>
              I build and run{" "}
              <span className="font-semibold">a SaaS product in production</span>
              : from the data model and auth to payments, PDFs and automated
              billing.
            </>
          ) : (
            <>
              Construyo y mantengo{" "}
              <span className="font-semibold">
                un SaaS en producción
              </span>
              : del modelo de datos y el auth a los pagos, los PDFs y la
              facturación automática.
            </>
          )}
        </p>

        <p className="mt-3 text-sm sm:text-base text-frieren-700 dark:text-white/60">
          {isEnglish
            ? "Mendoza, Argentina · open to remote roles"
            : "Mendoza, Argentina · abierto a trabajo remoto"}
        </p>
      </m.div>

      <m.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 text-base sm:text-lg font-medium"
      >
        <div className="flex items-center gap-3">
          <Link
            href="#contact"
            className="group bg-frieren-800/80 text-frieren-50 px-5 sm:px-7 py-3 flex items-center gap-2 whitespace-nowrap rounded-full outline-none focus:scale-100 hover:scale-105 hover:bg-frieren-900/80 active:scale-105 transition dark:bg-fern-700 dark:text-white"
            onClick={() => {
              setActiveSection("Contact");
              setTimeOfLastClick(Date.now());
            }}
          >
            {isEnglish ? "Contact me" : "Contactame"}
            <BsArrowRight
              className="opacity-70 group-hover:translate-x-1 transition"
              aria-hidden="true"
            />
          </Link>

          {SHOW_CV && (
          <a
            href={CV_PATH}
            download
            className="group bg-frieren-50/70 text-frieren-900 px-5 sm:px-7 py-3 flex items-center gap-2 whitespace-nowrap rounded-full outline-none focus:scale-100 hover:scale-105 active:scale-105 transition border border-frieren-200/60 dark:bg-white/10 dark:text-white/80 dark:border-white/10"
          >
            {isEnglish ? "Download CV" : "Descargar CV"}
            <HiDownload
              className="opacity-70 group-hover:translate-y-0.5 transition"
              aria-hidden="true"
            />
          </a>
          )}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={SITE.linkedin}
            target="_blank"
            aria-label="LinkedIn"
            rel="noopener noreferrer"
            className="bg-frieren-50/50 p-4 text-frieren-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-frieren-950 active:scale-105 transition cursor-pointer border border-frieren-200/60 dark:bg-white/10 dark:text-white/60 dark:border-white/10"
          >
            <BsLinkedin aria-hidden="true" />
          </a>
          <a
            href={SITE.github}
            target="_blank"
            aria-label="GitHub"
            rel="noopener noreferrer"
            className="bg-frieren-50/50 p-4 text-frieren-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-frieren-950 active:scale-105 transition cursor-pointer border border-frieren-200/60 dark:bg-white/10 dark:text-white/60 dark:border-white/10"
          >
            <BsGithub aria-hidden="true" />
          </a>
        </div>
      </m.div>
    </section>
  );
}

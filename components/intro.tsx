"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowRight, BsGithub, BsLinkedin } from "react-icons/bs";
import { useSectioninView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useLanguage } from "@/context/language-context";
export default function Intro() {
  const { language } = useLanguage();
  const sectionName = language === "ENG" ? "Home" : "Início";

  const { ref } = useSectioninView(sectionName, 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  return (
    <section
      ref={ref}
      className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]"
      id="home"
    >
      <div className="flex items-center justify-center ">
        <div className="relative animate-float">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
          >
            <Image
              src="https://res.cloudinary.com/ddtjwx08b/image/upload/v1697323330/Enzo.jpg"
              alt="Enzo_Profile"
              width="250"
              height="250"
              quality="95"
              priority={true}
              className="h-48 w-48 rounded-full object-cover border-[0.35rem] border-frieren-200 dark:border-fern-700 shadow-[0_0_30px_rgba(148,124,189,0.40)] dark:shadow-[0_0_30px_rgba(65,53,88,0.60)]"
            />
          </motion.div>
          <motion.span
            className="absolute text-4xl bottom-0 rigth-0"
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
          </motion.span>
        </div>
      </div>

      <motion.h1
        className="mb-10 mt-4 px text-2x1 font-medium !leading-[1.5] sm:text-4x1"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {language === "ENG" ? (
          <>
            {" "}
            Hi, I&apos;m <span className="font-bold">Enzo Arjona</span>. A Full
            Stack Developer specialized in crafting{" "}
            <span className="font-bold">
              high-performance digital experiences
            </span>
            . I combine the power of{" "}
            <span className="font-bold">React (Next.js)</span> with the
            versatility of <span className="font-bold">WordPress</span> to build
            fast, scalable, and SEO-optimized websites.
          </>
        ) : (
          <>
            {" "}
            ¡Hola! Soy <span className="font-bold">Enzo Arjona</span>.
            Desarrollador Full Stack especializado en crear{" "}
            <span className="font-bold">
              experiencias digitales de alto rendimiento
            </span>
            . Combino el poder de{" "}
            <span className="font-bold">React (Next.js)</span> con la
            versatilidad de <span className="font-bold">WordPress</span> para
            construir sitios rápidos, escalables y optimizados para SEO.
          </>
        )}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
        className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium"
      >
        <Link
          href="#contact"
          className="group bg-frieren-800/80 text-frieren-50 px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-100 hover:scale-105 hover:bg-frieren-900/80 active:scale-105 transition dark:text-white"
          onClick={() => {
            setActiveSection("Contact"), setTimeOfLastClick(Date.now());
          }}
        >
          {language === "ENG" ? (
            <>
              {" "}
              Contact me here <BsArrowRight className="contactMe" />
            </>
          ) : (
            <>
              {" "}
              Contáctame <BsArrowRight className="contactMe" />
            </>
          )}
        </Link>
        <a
          href="https://www.linkedin.com/in/enzoarjona/"
          target="_blank"
          className="bg-frieren-50/50 p-4 text-frieren-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-frieren-950 active:scale-105 transition cursor-pointer border border-frieren-200/60 dark:bg-white/10 dark:text-white/60"
        >
          <BsLinkedin />
        </a>
        <a
          href="https://www.linkedin.com/in/enzoarjona/"
          target="_blank"
          className="bg-frieren-50/50 p-4 text-frieren-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-frieren-950 active:scale-105 transition cursor-pointer border border-frieren-200/60  dark:bg-white/10 dark:text-white/60"
        >
          <BsGithub />
        </a>
      </motion.div>
    </section>
  );
}

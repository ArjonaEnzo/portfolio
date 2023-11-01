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
  const { language, toggleLanguage } = useLanguage();
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
        <div className="relative">
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
              className="h-48 w-48 rounded-full object-cover border-[0.35rem] border-white shadow-xl"
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
            <span className="font-bold">Hello! My name is Enzo.</span> I'm a{" "}
            <span className="font-bold"> full-stack developer</span> and an
            enthusiastic seeker of{" "}
            <span className="font-bold">new challenges</span> to showcase my
            talent. I enjoy programming <span className="italic">and love</span>{" "}
            tasks constantly motivate me. Currently, I'm focusing on React{" "}
            <span className="underline">React (Next.js)</span>.
          </>
        ) : (
          <>
            {" "}
            <span className="font-bold">
              ¡Hola! Mi nombre es Enzo.
            </span> Soy{" "}
            <span className="font-bold">desarrollador full stack</span> y un
            entusiasta buscador de nuevos{" "}
            <span className="font-bold">desafíos</span> para demostrar mi
            talento. Mi pasión por la programación{" "}
            <span className="italic"> y mi amor </span>por los retos me motivan
            constantemente. Actualmente me enfoco en{" "}
            <span className="underline">React (Next.js)</span>.
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
          className="group bg-violet-900/80 text-black px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-100 hover:scale-105 hover:bg-violet-950/80 active:scale-105 transition dark:text-white"
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
          className="bg-white/50 p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950  active:scale-105 transition cursor-pointer border border-black/10 dark:bg-white/10 dark:text-white/60"
        >
          <BsLinkedin />
        </a>
        <a
          href="https://www.linkedin.com/in/enzoarjona/"
          target="_blank"
          className="bg-white/50 p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950  active:scale-105 transition cursor-pointer border border-black/10  dark:bg-white/10 dark:text-white/60"
        >
          <BsGithub />
        </a>
      </motion.div>
    </section>
  );
}

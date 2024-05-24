"use client";
import { projectsData } from "@/lib/data";
import Image from "next/image";
import { useScroll, motion, useTransform } from "framer-motion";
import React, { useRef } from "react";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import { useLanguage } from "@/context/language-context";
import SwiperProjects from "./swiper-projects";
type ProjectProps = (typeof projectsData)[number];

export default function Project({
  title,
  description,
  tags,
  imageUrl,
  images,
  linkTo,
}: ProjectProps) {
  const { language, toggleLanguage } = useLanguage();

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });

  const [showMore, setShowMore] = React.useState(false);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      className="group mb-3 sm:mb-8 last:mb-0 "
    >
      {showMore && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          className="fixed z-[1001] top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/70 backdrop-blur-[0.5rem] transition-all dark:text-gray-950"
        >
          <span id="swiper" className="text-white text-2xl font-semibold">
            {language === "ENG" ? "Slide for more images 👋" : "Ver más 👋"}
          </span>
          <SwiperProjects images={images} />
          <button
            className="fixed right-100 font-semibold top-4 hover:scale-110 active:scale-105 transition-all bg-white w-[5rem] border border-black rounded-full text-xl bg-opacity-80"
            onClick={toggleShowMore}
          >
            {language === "ENG" ? "Close" : "Cerrar"}
          </button>
        </motion.div>
      )}

      <section className=" bg-violet-900 max-w-[42rem] border border-black/5 overflow-hidden sm:pr-8 relative sm:h-[20rem] rounded-lg  hover:bg-violet-800 transition group-even:pl-8 ">
        <div className="pt-4 pb-7 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[50%] flex flex-col h-full group-even:ml-[18rem] ">
          <h3 className="text-2x1 font-semibold">{title}</h3>
          <p className="mt-2 leading-relaxed text-black dark:text-white/70">
            {description}
          </p>
          <ul className="flex flex-wrap mt-4 gap-2 sm:mt-auto">
            {tags.map((tag, index) => (
              <li
                className="bg-indigo-900/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-black rounded-full dark:text-white/70"
                key={index}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <Image
          src={imageUrl}
          alt={title}
          quality={95}
          className="absolute top-8 -right-40 w-[28.25rem] rounded-t-lg shadow-2x1 transition
    group-hover:scale-[1.04]
    group-hover:-translate-x-3
    group-hover:translate-y-3
    group-hover:-rotate-2

    group-even:group-hover:translate-x-3
    group-even:group-hover:translate-y-3
    group-even:group-hover:rotate-2

    group-even:right-[inicial]
    group-even:-left-40 max-h-[15rem] "
        />

        {linkTo && (
          <Link href={linkTo} target="_blank">
            <BiLinkExternal className="absolute right-5 group-even:right-[initial] group-even:left-5 bottom-2 md:block  hidden items-center justify-center bg-white/70 rounded-full  p-1 hover:scale-110 active:scale-105 transition-all font-semibold dark:bg-black/[0.3] dark:text-white/8 dark:border-white border border-black text-3xl " />
          </Link>
        )}
        {images.length ? (
          <button
            className="absolute right-5 group-even:right-[initial] group-even:left-5 bottom-2 md:block  hidden items-center justify-center bg-white/70 rounded-full w-[6rem] hover:scale-110 active:scale-105 transition-all font-semibold dark:bg-black/[0.3] dark:text-white/8 dark:border-white border border-black"
            onClick={toggleShowMore}
          >
            <Link href={`#swiper`}>
              {language === "ENG" ? "See more" : "Ver más"}
            </Link>
          </button>
        ) : null}
      </section>
    </motion.div>
  );
}

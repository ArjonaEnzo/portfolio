"use client";
import Image, { StaticImageData } from "next/image";
import { useScroll, motion, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { BiLinkExternal } from "react-icons/bi";
import { useLanguage } from "@/context/language-context";
import SwiperProjects from "./swiper-projects";

type ProjectProps = {
  title: string;
  description: string;
  tags: readonly string[];
  imageUrl: StaticImageData | string;
  images: readonly string[];
  linkTo?: string;
};

export default function Project({
  title,
  description,
  tags,
  imageUrl,
  images,
  linkTo,
}: ProjectProps) {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });

  const [showMore, setShowMore] = React.useState(false);

  const toggleShowMore = () => {
    if (images.length > 0) {
      setShowMore(!showMore);
    }
  };

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      className="group relative h-full"
    >
      {showMore &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed z-[9999] top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/90 backdrop-blur-md transition-all"
            onClick={(e) => {
              if (e.target === e.currentTarget) toggleShowMore();
            }}
          >
            <span className="text-white/80 text-xl mb-4 font-light">
              {language === "ENG" ? "Gallery View" : "Galería de Imágenes"}
            </span>

            <div className="w-full max-w-4xl px-4 h-[60vh]">
              <SwiperProjects images={[...images]} />
            </div>

            <button
              className="mt-8 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition border border-white/20 backdrop-blur-sm"
              onClick={toggleShowMore}
            >
              {language === "ENG" ? "Close Gallery" : "Cerrar Galería"}
            </button>
          </motion.div>,
          document.body
        )}

      <article className="bg-frieren-800 border border-black/5 overflow-hidden relative rounded-xl hover:shadow-2xl hover:shadow-frieren-800/20 hover:-translate-y-2 transition-all duration-300 flex flex-col md:flex-row h-full dark:bg-fern-900 dark:hover:shadow-fern-900/20">
        <div className="pt-4 pb-7 px-5 md:pt-10 md:px-8 md:w-1/2 flex flex-col h-full z-10">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="mt-4 leading-relaxed text-white/80 mb-6 text-sm md:text-base text-pretty break-words select-text">
            {description}
          </p>
          <ul className="flex flex-wrap gap-2 mt-auto">
            {tags.map((tag, index) => (
              <li
                className="bg-black/30 px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white/90 rounded-full font-medium border border-white/5"
                key={index}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-1/2 relative min-h-[15rem] md:min-h-[20rem] bg-black/20 group-hover:bg-black/10 transition">
          <Image
            src={imageUrl}
            alt={title}
            quality={90}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            onClick={toggleShowMore}
            className={`object-cover object-left-top transition duration-500
              ${images.length > 0 ? "cursor-pointer hover:brightness-110" : "cursor-default"}
              group-hover:scale-105 group-hover:-rotate-1`}
          />

          {images.length > 0 && (
            <div
              onClick={toggleShowMore}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none cursor-pointer"
            >
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 flex items-center gap-2">
                <span>🔍</span>{" "}
                {language === "ENG" ? "View Gallery" : "Ver Galería"}
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 flex gap-3 z-20">
            {linkTo && (
              <a
                href={linkTo}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-frieren-50 p-3 rounded-full hover:scale-110 active:scale-95 transition text-frieren-900 shadow-lg flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <BiLinkExternal className="text-lg" />
              </a>
            )}
          </div>
        </div>
      </article>
    </motion.div>
  );
}

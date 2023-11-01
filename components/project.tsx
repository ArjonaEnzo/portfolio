"use client";
import { projectsData } from "@/lib/data";
import Image from "next/image";
import { useScroll, motion, useTransform } from "framer-motion";
import React, { useRef } from "react";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
type ProjectProps = (typeof projectsData)[number];

export default function Project({
  title,
  description,
  tags,
  imageUrl,
  linkTo,
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  // const isLink = typeof linkTo === "string" && linkTo.trim() !== "";
  return (
    <motion.div
      ref={ref}
      style={{ scale: scaleProgress, opacity: opacityProgress }}
      className="group mb-3 sm:mb-8 last:mb-0 "
    >
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
      </section>
    </motion.div>
  );
}

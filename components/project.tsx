"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BiLinkExternal } from "react-icons/bi";
import { BsGithub, BsPlayCircle, BsImages } from "react-icons/bs";
import clsx from "clsx";
import { useLanguage } from "@/context/language-context";
import {
  linkLabels,
  projectLabels,
  type Project as ProjectData,
  type ProjectLinkKind,
} from "@/lib/projects";
import SwiperProjects from "./swiper-projects";

const linkIcons: Record<ProjectLinkKind, React.ReactNode> = {
  live: <BiLinkExternal aria-hidden="true" />,
  repo: <BsGithub aria-hidden="true" />,
  video: <BsPlayCircle aria-hidden="true" />,
};

type ProjectProps = { project: ProjectData };

export default function Project({ project }: ProjectProps) {
  const { language } = useLanguage();
  const labels = projectLabels[language];
  const hasGallery = project.gallery.length > 0;
  const [galleryOpen, setGalleryOpen] = useState(false);

  // Close the gallery with Escape.
  useEffect(() => {
    if (!galleryOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGalleryOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [galleryOpen]);

  const featured = Boolean(project.featured);

  return (
    // The wrapper reveals on scroll (framer-motion writes an inline transform);
    // the card inside owns the hover lift, so the two don't fight.
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="h-full"
    >
    <article
      className={clsx(
        "tile-fx group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-frieren-800 text-white shadow-lg shadow-frieren-900/10 dark:border-white/5 dark:bg-fern-900 dark:shadow-black/30",
        featured && "lg:flex-row"
      )}
    >
      {galleryOpen &&
        createPortal(
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} — ${labels.gallery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setGalleryOpen(false);
            }}
          >
            <span className="mb-4 text-xl font-light text-white/80">
              {project.title} · {labels.gallery}
            </span>
            <div className="h-[60vh] w-full max-w-5xl px-4">
              <SwiperProjects images={[...project.gallery]} />
            </div>
            <button
              type="button"
              className="mt-8 rounded-full border border-white/20 bg-white/10 px-6 py-2 font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              onClick={() => setGalleryOpen(false)}
            >
              {labels.closeGallery}
            </button>
          </motion.div>,
          document.body
        )}

      {/* Cover */}
      <div
        className={clsx(
          "relative aspect-[16/10] w-full overflow-hidden bg-black/20",
          featured && "lg:aspect-auto lg:w-1/2 lg:min-h-[26rem]"
        )}
      >
        <Image
          src={project.cover}
          alt={`${project.title} — screenshot`}
          fill
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
          quality={85}
          className="object-cover object-left-top transition duration-500 group-hover:scale-[1.03]"
        />
        {hasGallery && (
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="absolute inset-0 flex items-end justify-start p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={`${labels.viewGallery}: ${project.title}`}
          >
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition group-hover:bg-black/70">
              <BsImages aria-hidden="true" />
              {labels.viewGallery} ({project.gallery.length})
            </span>
          </button>
        )}
      </div>

      {/* Body */}
      <div
        className={clsx(
          "flex flex-1 flex-col gap-4 p-5 sm:p-6",
          featured && "lg:w-1/2 lg:p-8"
        )}
      >
        <header>
          <p className="text-[0.7rem] font-medium uppercase tracking-widest text-white/60">
            {project.period}
          </p>
          <h3 className={clsx("mt-1 font-bold text-white", featured ? "text-2xl sm:text-3xl" : "text-xl")}>
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
            {project.tagline}
          </p>
        </header>

        <dl className="grid gap-3 text-sm leading-relaxed text-white/80">
          <div>
            <dt className="text-[0.7rem] font-semibold uppercase tracking-widest text-frieren-300 dark:text-fern-300">
              {labels.problem}
            </dt>
            <dd className="mt-0.5">{project.problem}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] font-semibold uppercase tracking-widest text-frieren-300 dark:text-fern-300">
              {labels.solution}
            </dt>
            <dd className="mt-0.5">{project.solution}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] font-semibold uppercase tracking-widest text-frieren-300 dark:text-fern-300">
              {labels.impact}
            </dt>
            <dd className="mt-0.5">{project.impact}</dd>
          </div>
        </dl>

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Stack">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wider text-white/90"
            >
              {tech}
            </li>
          ))}
        </ul>

        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-frieren-950 shadow transition hover:scale-[1.04] active:scale-100 dark:bg-fern-100"
              >
                {linkIcons[link.kind]}
                {link.label ?? linkLabels[language][link.kind]}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
    </motion.div>
  );
}

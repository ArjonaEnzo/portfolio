"use client";
import React, { useRef, useLayoutEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { experiencesData, experiencesDataEsp } from "@/lib/data";
import { useSectioninView } from "@/lib/hooks";
import { useLanguage } from "@/context/language-context";
import { useTheme } from "@/context/theme-context";

const CARD_WIDTH = 384; // w-[24rem]
const CARD_GAP = 32; // gap-8
const PADDING_X = 96; // pl-12 (48) + pr-12 (48)
const SPACER_WIDTH = 48; // w-12 spacer after last card
const NUM_CARDS = experiencesData.length;
const TOTAL_WIDTH = NUM_CARDS * CARD_WIDTH + (NUM_CARDS - 1) * CARD_GAP; // 2880

// Full flex content width (cards + gaps + padding + spacer): 2880 + 96 + 48 = 3024px
// SSR CSS fallback: section extra height = SECTION_OFFSET - 100vw
// JS: setHeight() measures contentRef.scrollWidth directly (ground truth).
const SECTION_OFFSET = TOTAL_WIDTH + PADDING_X + SPACER_WIDTH + 32; // 3056

export default function Experience() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const sectionName = language === "ENG" ? "Experience" : "Experiencia";
  const { ref: sectionRef } = useSectioninView(sectionName, 0.1);
  const experience = language === "ENG" ? experiencesData : experiencesDataEsp;
  const isDark = theme === "dark";

  const targetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useLayoutEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // maxSlide = actual content scrollWidth − container width.
    // scrollWidth is the ground truth: it measures the real DOM including the
    // spacer div, gaps, and padding — no reliance on compile-time constants.
    let maxSlide = 0;

    const setHeight = () => {
      const cw = el.offsetWidth; // actual rendered container width
      const contentW = contentRef.current?.scrollWidth ?? (TOTAL_WIDTH + PADDING_X + SPACER_WIDTH);
      maxSlide = Math.max(0, contentW - cw);
      // window.innerHeight (JS pixels) avoids CSS 100vh ambiguity on mobile/zoom.
      el.style.height = `${window.innerHeight + maxSlide}px`;
    };

    // Pure read — no DOM writes. getBoundingClientRect().top for a static block
    // element is a cheap cache read when no layout mutations are pending.
    // top = 0   → sticky starts  (progress 0 → x 0)
    // top = -maxSlide → sticky ends (progress 1 → x -maxSlide, last card visible)
    const onScroll = () => {
      if (maxSlide <= 0) { x.set(0); return; }
      const top = el.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, -top / maxSlide));
      x.set(-progress * maxSlide);
    };

    const onResize = () => { setHeight(); onScroll(); };

    setHeight(); // run synchronously before first paint
    onScroll();  // initialise x

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cardStyle: React.CSSProperties = isDark
    ? { background: "#362d49", border: "1px solid #2d263b" }
    : { background: "#533b75", border: "1px solid #43315e" };

  const iconStyle: React.CSSProperties = isDark
    ? { background: "#50416d", color: "#f4f3f7" }
    : { background: "#7a5caa", color: "#f4f3f7" };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="scroll-mt-28 mb-8 sm:mb-12 w-full"
    >
      {/* Desktop: sticky horizontal scroll
          setHeight() computes: maxSlide = contentWidth − containerWidth
          then sets el.style.height = window.innerHeight + maxSlide (px, no CSS calc).
          The JSX style is the SSR/first-paint fallback only; JS overrides it before paint.
      */}
      <div
        ref={targetRef}
        className="hidden md:block"
        style={{
          height: `max(100vh, calc(100vh - 100vw + ${SECTION_OFFSET}px))`,
        }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="mb-8 text-center">
            <SectionHeading>
              {language === "ENG" ? "My experience" : "Mi experiencia"}
            </SectionHeading>
          </div>
          <motion.div ref={contentRef} style={{ x }} className="flex gap-8 pl-12 pr-12">
            {experience.map((item, index) => (
              <div
                key={index}
                className="w-[24rem] flex-shrink-0 rounded-2xl p-6 flex flex-col gap-3"
                style={cardStyle}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={iconStyle}
                >
                  {item.icon}
                </div>
                <p className="text-xs text-white/50 font-medium tracking-widest uppercase">
                  {item.date}
                </p>
                <h3 className="text-base font-semibold text-white capitalize leading-snug text-balance">
                  {item.title}
                </h3>
                <p className="text-sm text-white/60 font-medium">
                  {item.location}
                </p>
                <p className="text-sm text-white/70 leading-relaxed mt-auto">
                  {item.description}
                </p>
              </div>
            ))}
            {/* Spacer: guarantees the last card has breathing room at max scroll */}
            <div className="w-12 flex-shrink-0" aria-hidden="true" />
          </motion.div>
        </div>
      </div>

      {/* Mobile: vertical list */}
      <div className="md:hidden">
        <SectionHeading>
          {language === "ENG" ? "My experience" : "Mi experiencia"}
        </SectionHeading>
        <div className="flex flex-col gap-6 px-4">
          {experience.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={cardStyle}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                  style={iconStyle}
                >
                  {item.icon}
                </div>
                <p className="text-xs text-white/50 font-medium tracking-widest uppercase">
                  {item.date}
                </p>
              </div>
              <h3 className="text-base font-semibold text-white capitalize leading-snug text-balance">
                {item.title}
              </h3>
              <p className="text-sm text-white/60 font-medium">
                {item.location}
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

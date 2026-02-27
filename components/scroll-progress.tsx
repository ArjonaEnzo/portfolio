"use client";
import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-frieren-500/60 dark:bg-fern-400/60 z-[200] origin-left pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

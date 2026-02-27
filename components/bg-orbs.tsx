"use client";
import { motion } from "framer-motion";

export default function BgOrbs() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Orb 1 — top right */}
      <motion.div
        className="absolute top-[-15%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-frieren-300/40 dark:bg-fern-800/30 blur-[120px]"
        animate={{ x: [0, 80, -50, 0], y: [0, -60, 80, 0] }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      {/* Orb 2 — bottom left */}
      <motion.div
        className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-frieren-400/30 dark:bg-fern-900/40 blur-[100px]"
        animate={{ x: [0, -60, 100, 0], y: [0, 80, -40, 0] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      {/* Orb 3 — center drift */}
      <motion.div
        className="absolute top-[40%] left-[25%] w-[38rem] h-[38rem] rounded-full bg-violet-200/40 dark:bg-indigo-900/20 blur-[120px]"
        animate={{ x: [0, 60, -80, 0], y: [0, -80, 40, 0] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      {/* Orb 4 — top left */}
      <motion.div
        className="absolute top-[-5%] left-[-5%] w-[32rem] h-[32rem] rounded-full bg-frieren-200/35 dark:bg-fern-800/20 blur-[100px]"
        animate={{ x: [0, 100, -30, 0], y: [0, 50, -70, 0] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

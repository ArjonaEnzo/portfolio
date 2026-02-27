"use client";
import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <motion.div
      className="bg-gradient-to-b from-transparent via-frieren-900/60 to-transparent my-24 h-16 w-1 rounded-full hidden sm:block dark:via-fern-500/40"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.125 }}
    ></motion.div>
  );
}

"use client";
import { motion } from "framer-motion";
import React from "react";

type SectionHeadingProps = { children: React.ReactNode };

export const SectionHeading = ({ children }: SectionHeadingProps) => {
  return (
    <motion.h2
      className="text-3xl font-medium capitalize mb-8 text-center"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.h2>
  );
};

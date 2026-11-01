"use client";
import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

// Components use the slim `m` element; `strict` throws if a full `motion`
// element sneaks back in and pulls the whole library into the bundle.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}

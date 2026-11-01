"use client";
import dynamic from "next/dynamic";

// Decorative and on-demand UI: loaded in their own chunks after hydration so
// they stay out of the first long task on phones. None of them is visible
// content (orbs and particles are background, the progress bar starts at 0
// and toasts only show after an action).
export const BgOrbs = dynamic(() => import("./bg-orbs"), { ssr: false });
export const ParticlesBg = dynamic(() => import("./particles-bg"), { ssr: false });
export const ScrollProgress = dynamic(() => import("./scroll-progress"), { ssr: false });
export const Toaster = dynamic(() => import("react-hot-toast").then((mod) => mod.Toaster), { ssr: false });

"use client";
import dynamic from "next/dynamic";

// Toasts only show after an action (the contact form), so their code loads in
// its own chunk after hydration instead of in the first long task on phones.
export const Toaster = dynamic(() => import("react-hot-toast").then((mod) => mod.Toaster), { ssr: false });

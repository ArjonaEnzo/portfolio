import React from "react";

export default function Footer() {
  return (
    <footer className="mb-10 px-4 text-center text-black">
      <small className="mb-2 block text-xs dark:text-white/70">
        &copy; 2023 Enzo Arjona. All rights reserved.
      </small>
      <p className="text-xs dark:text-white/70">
        <span className="font-semibold dark:text-white/70">
          About this website:
        </span>{" "}
        built with React & Next.js (App Router & Server Actions), TypeScript,
        Tailwind CSS, Framer Motion, React Email & Resend, Vercel hosting.
      </p>
    </footer>
  );
}

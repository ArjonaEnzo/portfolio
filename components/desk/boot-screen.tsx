"use client";
import React from "react";
import clsx from "clsx";
import type { Language } from "@/lib/projects";
import { deskCopy } from "./desk-copy";

const BLOCKS = 32;

/** Loading screen styled as a dev server booting the room. */
export default function BootScreen({
  language,
  progress,
  loaded,
  total,
  ready,
  onEnter,
}: {
  language: Language;
  progress: number;
  loaded: number;
  total: number;
  ready: boolean;
  onEnter: () => void;
}) {
  const t = deskCopy[language];
  const enterRef = React.useRef<HTMLButtonElement>(null);
  const pct = Math.round(progress);
  const filled = Math.round((pct / 100) * BLOCKS);

  React.useEffect(() => {
    if (ready) enterRef.current?.focus();
  }, [ready]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0e0b14] px-6 font-desk-mono">
      <div className="w-full max-w-xl text-sm leading-7 sm:text-base">
        <p>
          <span className="text-[#8273a3]">$</span> npm run dev
        </p>
        <p className="mt-3 text-[#e6e1f0]">
          <span className="text-[#f0a6ca]">▲</span> enzo@desk
        </p>
        <p className="text-[#a89fc0]">  - Local: /desk</p>
        <p className="mt-3" role="status" aria-live="polite">
          <span className={ready ? "text-[#7dd3c0]" : "text-[#f5c26b]"}>{ready ? "✓" : "○"}</span>{" "}
          {ready ? t.ready : t.loading}
          {total > 0 && <span className="text-[#8273a3]"> ({loaded}/{total})</span>}
        </p>

        <div className="mt-8 flex items-center justify-between text-xs uppercase tracking-widest">
          <span className="text-[#f0a6ca]">{ready ? t.ready : t.loading}</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div aria-hidden className="mt-2 flex gap-[3px]">
          {Array.from({ length: BLOCKS }, (_, i) => (
            <span key={i} className={clsx("h-2.5 flex-1 rounded-[1px]", i < filled ? "bg-[#f0a6ca]" : "bg-white/10")} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            ref={enterRef}
            type="button"
            onClick={onEnter}
            disabled={!ready}
            className={clsx(
              "h-12 rounded-xl px-8 text-sm uppercase tracking-[0.25em] transition-all",
              ready
                ? "bg-[#f0a6ca] text-[#1d1827] hover:brightness-110"
                : "cursor-wait bg-white/5 text-white/30"
            )}
          >
            {t.enter}
          </button>
        </div>
      </div>
    </div>
  );
}

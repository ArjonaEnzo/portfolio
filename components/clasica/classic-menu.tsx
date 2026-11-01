"use client";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { m, useReducedMotion, type Transition, type Variants } from "framer-motion";
import { TbArrowRight, TbCube } from "react-icons/tb";
import { useLanguage } from "@/context/language-context";
import { useTheme } from "@/context/theme-context";
import { SITE } from "@/lib/site";
import { ContactPanel, ExperiencePanel, ProfilePanel, ProjectsPanel, SkillsPanel } from "./panels";

export type SectionId = "perfil" | "proyectos" | "habilidades" | "experiencia" | "contacto";

const SECTIONS: { id: SectionId; ESP: string; ENG: string }[] = [
  { id: "perfil", ESP: "Perfil", ENG: "Profile" },
  { id: "proyectos", ESP: "Proyectos", ENG: "Projects" },
  { id: "habilidades", ESP: "Habilidades", ENG: "Skills" },
  { id: "experiencia", ESP: "Experiencia", ENG: "Experience" },
  { id: "contacto", ESP: "Contacto", ENG: "Contact" },
];

type PanelState = "in" | "out" | "rest";

// The leaving panel is pulled up fast; the next one drops in after it.
const OUT_SECONDS = 0.3;
const springs: Record<"light" | "dark", Transition> = {
  // Papel: a sheet that settles with a short sway.
  light: { type: "spring", stiffness: 240, damping: 22 },
  // Grafito: a tight mechanical snap.
  dark: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
};

function indexFromHash(): number {
  const hash = window.location.hash.slice(1);
  return SECTIONS.findIndex((s) => s.id === hash);
}

export default function ClassicMenu() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const reduce = !!useReducedMotion();
  const en = language === "ENG";

  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  // The first panel is server-rendered in place; only later switches animate.
  const [animated, setAnimated] = useState(false);

  // Listeners registered once (popstate) must see the current panel, not the
  // one from their first render.
  const activeRef = useRef(0);

  const open = useCallback((next: number, { push = true, instant = false } = {}) => {
    const current = activeRef.current;
    if (next < 0 || next === current) return;
    activeRef.current = next;
    setAnimated(!instant);
    setLeaving(instant ? null : current);
    setActive(next);
    if (push) window.history.pushState(null, "", `#${SECTIONS[next].id}`);
  }, []);

  // Deep links (/clasica#proyectos) and the browser's back/forward buttons.
  useEffect(() => {
    const fromHash = indexFromHash();
    if (fromHash > 0) open(fromHash, { push: false, instant: true });
    const onPop = () => open(Math.max(indexFromHash(), 0), { push: false });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open]);

  // Keyboard: 1–5 open a section, Esc goes back to the profile.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.key === "Escape") open(0);
      const n = Number(e.key);
      if (n >= 1 && n <= SECTIONS.length) open(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const stateOf = (i: number): PanelState => (i === active ? "in" : i === leaving ? "out" : "rest");
  const spring = springs[theme];

  const variants: Variants = reduce
    ? {
        in: { opacity: 1, y: "0%", transition: { duration: 0.2 } },
        out: { opacity: 0, y: "0%", transition: { duration: 0.15 } },
        rest: { opacity: 0, y: "0%", transition: { duration: 0 } },
      }
    : {
        in: { y: "0%", transition: { ...spring, delay: leaving === null ? 0 : OUT_SECONDS * 0.8 } },
        out: { y: "-115%", transition: { duration: OUT_SECONDS, ease: [0.55, 0, 0.9, 0.4] } },
        rest: { y: "-115%", transition: { duration: 0 } },
      };

  const nav = SECTIONS.map((s, i) => ({ ...s, label: s[language], index: i }));

  return (
    <div className="cl grid grid-rows-[auto_1fr_auto] md:grid-cols-[minmax(17rem,30%)_1fr] md:grid-rows-1">
      {/* Sidebar (desktop) / compact header (phone) */}
      <aside className="cl-side relative z-10 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 md:min-h-0 md:flex-col md:flex-nowrap md:items-stretch md:justify-[safe_center] md:gap-[clamp(1rem,4vh,2rem)] md:overflow-y-auto md:border-b-0 md:border-r md:px-[clamp(1.5rem,3.5vw,4rem)] md:py-6">
        <div className="min-w-0 flex-1 md:flex-none">
          <h1 className="cl-title flex items-start gap-2.5 text-[1.6rem] leading-none md:text-[clamp(2.2rem,3.4vw,3.2rem)]">
            {SITE.name}
            <span className="cl-hanko mt-1" aria-hidden>
              E
            </span>
          </h1>
          <p className="mt-1.5 truncate text-[0.8rem] text-[var(--cl-muted)] md:mt-3 md:whitespace-normal md:text-[0.95rem]">
            {en ? "Full-Stack Developer" : "Desarrollador Full-Stack"} · Next.js, TypeScript, WordPress
          </p>
        </div>

        <nav aria-label={en ? "Sections" : "Secciones"} className="hidden md:block">
          <ul className="flex flex-col gap-1">
            {nav.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    open(s.index);
                  }}
                  aria-current={s.index === active}
                  className="cl-nav-btn flex w-full items-baseline gap-3.5 px-0 py-2 text-[1.05rem] dark:px-3"
                >
                  <span className="cl-key w-5">0{s.index + 1}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden flex-col gap-5 md:flex">
          <p className="flex items-center gap-2 text-sm text-[var(--cl-muted)]">
            <span className="cl-dot" aria-hidden />
            {en ? "Available · remote from Mendoza, AR" : "Disponible · remoto desde Mendoza, AR"}
          </p>
          <button
            type="button"
            onClick={() => open(4)}
            className="cl-btn inline-flex items-center gap-2 self-start px-5 py-3"
          >
            {en ? "Get in touch" : "Contactame"} <TbArrowRight aria-hidden />
          </button>
        </div>

        <Controls
          en={en}
          theme={theme}
          onTheme={toggleTheme}
          onLanguage={toggleLanguage}
          className="flex-none md:mt-2"
        />
      </aside>

      {/* Stage: one panel at a time, the rest stay in the DOM for search. */}
      <main className="cl-stage relative min-h-0 overflow-hidden">
        {SECTIONS.map((s, i) => (
          <Panel
            key={s.id}
            id={s.id}
            label={s[language]}
            state={stateOf(i)}
            animated={animated}
            variants={variants}
            onFound={() => open(i, { instant: true })}
            onLeft={() => setLeaving((l) => (l === i ? null : l))}
          >
            {s.id === "perfil" && <ProfilePanel language={language} onGo={(id) => open(SECTIONS.findIndex((x) => x.id === id))} />}
            {s.id === "proyectos" && <ProjectsPanel language={language} />}
            {s.id === "habilidades" && <SkillsPanel language={language} />}
            {s.id === "experiencia" && <ExperiencePanel language={language} />}
            {s.id === "contacto" && <ContactPanel language={language} />}
          </Panel>
        ))}
      </main>

      {/* Tab bar (phone) */}
      <nav
        aria-label={en ? "Sections" : "Secciones"}
        className="cl-side flex justify-around border-t px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 md:hidden"
      >
        {nav.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              open(s.index);
            }}
            aria-current={s.index === active}
            className="cl-tab flex min-h-[2.75rem] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[0.68rem] text-[var(--cl-muted)]"
          >
            <span className="cl-key">0{s.index + 1}</span>
            <span className="max-w-full truncate">{s.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

function Panel({
  id,
  label,
  state,
  animated,
  variants,
  onFound,
  onLeft,
  children,
}: {
  id: SectionId;
  label: string;
  state: PanelState;
  animated: boolean;
  variants: Variants;
  onFound: () => void;
  onLeft: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const hidden = state === "rest";

  // React only knows boolean `hidden`. "until-found" keeps the closed panels
  // findable with Ctrl+F: the browser fires `beforematch` and we open it.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (hidden) el.setAttribute("hidden", "until-found");
    else el.removeAttribute("hidden");
  }, [hidden]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("beforematch", onFound);
    return () => el.removeEventListener("beforematch", onFound);
  }, [onFound]);

  return (
    <m.section
      ref={ref}
      id={`panel-${id}`}
      aria-label={label}
      hidden={hidden}
      data-state={animated ? state : "static"}
      className="cl-panel"
      variants={variants}
      initial={false}
      animate={state}
      onAnimationComplete={(def) => {
        if (def === "out") onLeft();
      }}
    >
      <div className="cl-cords" aria-hidden />
      <div className="cl-rod" aria-hidden />
      <div className="cl-sheet">
        <div className="cl-scroll px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <div className="cl-rise mx-auto max-w-[60rem]">{children}</div>
        </div>
      </div>
      <div className="cl-rod" aria-hidden />
    </m.section>
  );
}

function Controls({
  en,
  theme,
  onTheme,
  onLanguage,
  className = "",
}: {
  en: boolean;
  theme: "light" | "dark";
  onTheme: () => void;
  onLanguage: () => void;
  className?: string;
}) {
  const looks = [
    { value: "light" as const, label: en ? "Paper" : "Papel" },
    { value: "dark" as const, label: en ? "Graphite" : "Grafito" },
  ];
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Phones get one button that flips the look; wider screens see both options. */}
      <button
        type="button"
        onClick={onTheme}
        aria-label={en ? `Switch to ${looks[theme === "light" ? 1 : 0].label}` : `Cambiar a ${looks[theme === "light" ? 1 : 0].label}`}
        className="cl-ghost h-9 px-2.5 text-xs sm:hidden"
      >
        {looks[theme === "light" ? 1 : 0].label}
      </button>
      <div role="group" aria-label={en ? "Look" : "Estilo"} className="cl-seg hidden p-0.5 text-xs sm:flex">
        {looks.map((l) => (
          <button
            key={l.value}
            type="button"
            aria-pressed={theme === l.value}
            onClick={() => theme !== l.value && onTheme()}
            className="min-h-[2.25rem] rounded-full px-2.5 transition-colors sm:px-3"
          >
            {l.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onLanguage}
        aria-label={en ? "Cambiar a español" : "Switch to English"}
        className="cl-ghost grid h-9 min-w-[2.25rem] place-items-center px-2 font-mono text-xs"
      >
        {en ? "ES" : "EN"}
      </button>
      <Link
        href="/"
        prefetch={false}
        aria-label={en ? "Open the 3D room" : "Abrir el cuarto 3D"}
        title={en ? "3D room" : "Cuarto 3D"}
        className="cl-ghost flex h-9 items-center gap-1.5 px-2 text-xs"
      >
        <TbCube aria-hidden className="text-base" />
        <span className="hidden lg:inline">{en ? "3D room" : "Cuarto 3D"}</span>
      </Link>
    </div>
  );
}

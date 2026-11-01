"use client";
import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useProgress } from "@react-three/drei";
import { useLanguage } from "@/context/language-context";
import { SITE } from "@/lib/site";
import { deskCopy } from "./desk-copy";
import { STATION_ORDER, isStation, type StationId } from "./stations";
import { BoardContent, MonitorContent, PhoneContent, PosterContent } from "./screens";
import BootScreen from "./boot-screen";

const DeskCanvas = dynamic(() => import("./desk-canvas"), { ssr: false });

type Mood = "night" | "day";
const MOOD_KEY = "desk-mood";

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function DeskExperience() {
  const { language, toggleLanguage } = useLanguage();
  const router = useRouter();
  const t = deskCopy[language];
  const [station, setStation] = React.useState<StationId>("home");
  const [mood, setMood] = React.useState<Mood>("night");
  const [entered, setEntered] = React.useState(false);
  /** "Enter" was pressed: the canvas mounts behind the boot screen until its first frame. */
  const [starting, setStarting] = React.useState(false);
  const [webgl, setWebgl] = React.useState<boolean | null>(null);
  const compact = useMediaQuery("(max-width: 767px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // The scene module (three.js + models) loads during the boot screen, but the
  // <Canvas> only mounts on "Enter": building it earlier compiled shaders and
  // ran the render loop behind an opaque screen, blocking the main thread
  // while nobody could see it (Lighthouse TBT 12 s on mobile).
  const [sceneLoaded, setSceneLoaded] = React.useState(false);
  const { progress, active, loaded, total } = useProgress();
  const ready = webgl !== null && sceneLoaded && !active && progress >= 100;

  React.useEffect(() => {
    if (!webgl) return;
    let alive = true;
    import("./desk-canvas").then(() => alive && setSceneLoaded(true));
    return () => {
      alive = false;
    };
  }, [webgl]);

  React.useEffect(() => {
    setWebgl(hasWebGL());
    const fromHash = window.location.hash.slice(1);
    if (isStation(fromHash)) setStation(fromHash);
    try {
      const saved = window.localStorage.getItem(MOOD_KEY);
      if (saved === "day" || saved === "night") setMood(saved);
    } catch {
      /* private mode */
    }
  }, []);

  const toggleMood = React.useCallback(() => {
    setMood((m) => {
      const next = m === "day" ? "night" : "day";
      try {
        window.localStorage.setItem(MOOD_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  const day = mood === "day";

  // Keep the URL shareable: /desk#projects opens the monitor.
  React.useEffect(() => {
    if (!entered) return;
    const url = station === "home" ? window.location.pathname + window.location.search : `#${station}`;
    window.history.replaceState(null, "", url);
  }, [station, entered]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!entered) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.key === "Escape") setStation("home");
      const n = Number(e.key);
      if (n >= 1 && n <= STATION_ORDER.length) setStation(STATION_ORDER[n - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered]);

  const select = React.useCallback((id: StationId) => setStation(id), []);
  const sheetOpen = compact && entered && station !== "home";

  // HUD stays dark glass in both moods (it reads on the cream day background
  // and on the night one); only the accents shift with the room.
  // Note: Tailwind 3.3 has no /85 opacity step (it silently drops the class).
  const glass = day ? "border-[#2b1e3f]/20 bg-[#2b1e3f]/90 text-[#f4ecdf]" : "border-white/10 bg-[#1d1827]/80 text-[#e6e1f0]";
  const pill = clsx(glass, day ? "hover:bg-[#3d2f52]" : "hover:bg-[#2d263b]");
  const accent = "text-[#f0a6ca]"; // always on dark glass

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[60] overflow-hidden font-sans transition-colors duration-1000",
        day ? "bg-[#efe3d2] text-[#2b1e3f]" : "bg-[#120f19] text-[#e6e1f0]"
      )}
      // The 3D room floats like a diorama over this soft vignette.
      style={{
        backgroundImage: day
          ? "radial-gradient(ellipse at 50% 45%, #fbf3e6 0%, #efe1cc 55%, #dcc6a8 100%)"
          : "radial-gradient(ellipse at 50% 45%, #2c2342 0%, #1a1526 55%, #0d0a13 100%)",
      }}
    >
      {webgl === false ? (
        <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="max-w-md text-lg">{t.noWebgl}</p>
          <Link href="/" className="rounded-lg bg-[#f0a6ca] px-5 py-3 font-desk-mono text-[#1d1827]">
            {t.classicLong}
          </Link>
        </div>
      ) : (
        webgl &&
        (starting || entered) && (
          <DeskCanvas
            station={station}
            entered={entered}
            language={language}
            inScene={!compact}
            reducedMotion={reducedMotion}
            mood={mood}
            label={t.sceneLabel}
            onSelect={select}
            onArcade={() => router.push("/wc3")}
            onReady={() => setEntered(true)}
          />
        )
      )}

      {/* Top bar */}
      <header
        className={clsx(
          "pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 transition-opacity duration-500 sm:p-6",
          entered ? "opacity-100" : "opacity-0"
        )}
      >
        {station === "home" ? (
          <div className={clsx("pointer-events-auto rounded-xl border px-3 py-2 backdrop-blur sm:px-4", glass)}>
            <h1 className="whitespace-nowrap text-base font-bold uppercase tracking-wide sm:text-2xl">{SITE.name}</h1>
            {/* Phones: the name alone, so the box stays one line next to the buttons */}
            <p className="hidden font-desk-mono text-xs uppercase tracking-widest text-[#f0a6ca] sm:block sm:text-sm">
              Full-Stack Developer · Mendoza
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setStation("home")}
            className={clsx(
              "pointer-events-auto flex h-11 items-center gap-2 rounded-xl border px-4 font-desk-mono text-sm uppercase tracking-wider backdrop-blur transition-colors",
              pill
            )}
          >
            <span aria-hidden className={accent}>◂</span>
            <span className="sm:hidden">{t.backShort}</span>
            <span className="hidden sm:inline">{t.back}</span>
          </button>
        )}
        <div className="pointer-events-auto flex gap-2">
          <button
            type="button"
            onClick={toggleMood}
            aria-label={day ? t.toNight : t.toDay}
            aria-pressed={day}
            title={day ? t.toNight : t.toDay}
            className={clsx("grid h-11 w-11 place-items-center rounded-xl border backdrop-blur transition-colors", pill)}
          >
            {day ? (
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            ) : (
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={language === "ENG" ? "Cambiar a español" : "Switch to English"}
            className={clsx("grid h-11 min-w-11 place-items-center rounded-xl border px-3 font-desk-mono text-sm backdrop-blur transition-colors", pill)}
          >
            {language === "ENG" ? "ES" : "EN"}
          </button>
          <Link
            href="/"
            aria-label={t.classicLong}
            className={clsx("flex h-11 items-center rounded-xl border px-4 font-desk-mono text-sm backdrop-blur transition-colors", pill)}
          >
            <span className="sm:hidden">{t.classicShort}</span>
            <span className="hidden sm:inline">{t.classic}</span>
          </Link>
        </div>
      </header>

      {/* Bottom nav */}
      <nav
        aria-label={language === "ENG" ? "Sections" : "Secciones"}
        className={clsx(
          "absolute inset-x-0 bottom-0 z-30 flex justify-center p-2 transition-all duration-500 sm:p-6",
          entered && !sheetOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <ul
          className={clsx(
            "flex max-w-full gap-0.5 overflow-x-auto rounded-2xl border p-1 backdrop-blur transition-colors sm:gap-1 sm:p-1.5",
            day ? "border-[#2b1e3f]/20 bg-[#2b1e3f]/90" : "border-white/10 bg-[#1d1827]/90"
          )}
        >
          {STATION_ORDER.map((id, i) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => setStation(id)}
                aria-current={station === id ? "page" : undefined}
                className={clsx(
                  "flex h-11 items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 font-desk-mono text-[11px] uppercase transition-colors sm:px-4 sm:text-sm sm:tracking-wider",
                  station === id
                    ? "bg-[#f0a6ca] text-[#1d1827]"
                    : "text-[#ccc7d8] hover:bg-white/10"
                )}
              >
                <span className={clsx("hidden sm:inline", station === id ? "text-[#1d1827]/60" : "text-[#8273a3]")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t.stations[id]}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {entered && station === "home" && !compact && (
        <p className={clsx("pointer-events-none absolute bottom-24 left-6 z-30 rounded-lg border px-3 py-1.5 font-desk-mono text-xs uppercase tracking-widest backdrop-blur", glass)}>
          {t.dragHint}
        </p>
      )}

      {/* Phones: the open section is a sheet, the scene stays behind it */}
      {sheetOpen && (
        <section
          aria-label={t.stations[station]}
          className="absolute inset-x-0 bottom-0 z-40 h-[68dvh] overflow-hidden rounded-t-3xl border-t border-white/10 bg-[#14111c] shadow-[0_-20px_60px_rgba(0,0,0,0.5)]"
        >
          <div className="h-full">
            {station === "projects" && <MonitorContent language={language} compact />}
            {station === "experience" && <BoardContent language={language} compact />}
            {station === "about" && <PosterContent language={language} />}
            {station === "contact" && <PhoneContent language={language} />}
          </div>
        </section>
      )}

      {!entered && webgl !== false && (
        <BootScreen
          language={language}
          progress={progress}
          loaded={loaded}
          total={total}
          ready={ready && !starting}
          onEnter={() => setStarting(true)}
        />
      )}
    </div>
  );
}

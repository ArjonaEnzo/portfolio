"use client";
import React from "react";
import clsx from "clsx";
import type { Language } from "@/lib/projects";
import { getProjects, linkLabels, projectLabels } from "@/lib/projects";
import { experienceData, experienceLabels } from "@/lib/experience";
import { skillGroups, skillGroupLabels } from "@/lib/skills";
import { SITE } from "@/lib/site";
import { deskCopy } from "./desk-copy";

type ScreenProps = { language: Language; active: boolean };

/**
 * Cover shown while the camera is away (a big label, like a monitor showing a
 * wallpaper) and the real content once the section is open. The cover stays
 * in the DOM but is aria-hidden; the content is only interactive when active.
 */
function ScreenShell({
  active,
  cover,
  children,
  className,
}: {
  active: boolean;
  cover: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("desk-screen relative h-full w-full overflow-hidden", className)}>
      <div
        aria-hidden
        className={clsx(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
          active ? "opacity-0" : "opacity-100"
        )}
      >
        {cover}
      </div>
      <div
        aria-hidden={!active}
        // `inert` keeps hidden links out of the tab order. React 18 only writes
        // unknown attributes when they are strings, while @types/react 18.3 types
        // it as boolean: pass "" (attribute present) and widen the type.
        {...(!active ? ({ inert: "" } as unknown as { inert: boolean }) : {})}
        className={clsx(
          "absolute inset-0 transition-opacity duration-500",
          active ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function CoverLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-desk-mono text-[88px] font-bold uppercase tracking-[0.18em] text-[#f0a6ca] [text-shadow:0_0_24px_rgba(240,166,202,0.55)]">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Monitor: Profile / Projects / Stack                                 */
/* ------------------------------------------------------------------ */

type MonitorTab = "profile" | "projects" | "stack";

export function MonitorContent({ language, compact = false }: { language: Language; compact?: boolean }) {
  const t = deskCopy[language];
  const projects = getProjects(language);
  const [tab, setTab] = React.useState<MonitorTab>("projects");
  const [slug, setSlug] = React.useState(projects[0]?.slug);
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
  const labels = projectLabels[language];

  const tabs: { id: MonitorTab; label: string }[] = [
    { id: "profile", label: t.tabs.profile },
    { id: "projects", label: t.tabs.projects },
    { id: "stack", label: t.tabs.stack },
  ];

  return (
    <div className="flex h-full flex-col bg-[#14111c] text-[#e6e1f0]">
      {/* Window chrome */}
      <div className={clsx("flex items-center gap-3 border-b border-white/10 bg-[#1d1827]", compact ? "flex-wrap px-4 pb-3 pt-5" : "px-5 py-3")}>
        <span className={clsx("gap-2", compact ? "hidden" : "flex")}>
          <span className="h-3.5 w-3.5 rounded-full bg-[#f0a6ca]" />
          <span className="h-3.5 w-3.5 rounded-full bg-[#b5a6d3]" />
          <span className="h-3.5 w-3.5 rounded-full bg-[#645387]" />
        </span>
        <span className={clsx("font-desk-mono text-[#a89fc0]", compact ? "text-xs" : "text-base")}>enzo@desk: ~/portfolio</span>
        <div role="tablist" aria-label="Portfolio" className={clsx("flex gap-1", compact ? "w-full" : "ml-auto")}>
          {tabs.map((item) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={clsx(
                "rounded-md font-desk-mono transition-colors",
                compact ? "h-11 flex-1 text-sm" : "px-4 py-1.5 text-base",
                tab === item.id
                  ? "bg-[#f0a6ca] text-[#1d1827]"
                  : "text-[#ccc7d8] hover:bg-white/10"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1" role="tabpanel">
        {tab === "profile" && (
          <div key="profile" className={clsx("card-swap desk-scroll flex h-full items-center font-desk-mono", compact ? "overflow-y-auto px-5 py-5" : "gap-12 px-14")}>
            <pre aria-hidden className={clsx("text-[15px] leading-[1.15] text-[#f0a6ca]", compact && "hidden")}>
{`   ▄▄▄▄▄▄▄▄
  █ ▀▀▀▀▀▀ █
  █ >_     █
  █        █
  ▀▄▄▄▄▄▄▄▄▀
    ▄████▄`}
            </pre>
            <div className={compact ? "text-sm leading-7" : "text-xl leading-9"}>
              <p>
                <span className="text-[#f0a6ca]">enzo</span>
                <span className="text-[#8273a3]">@</span>
                <span className="text-[#f0a6ca]">desk</span>
              </p>
              <p className="text-[#645387]">──────────────────</p>
              <ProfileRow k={t.profile.role} v={SITE.role} />
              <ProfileRow k={t.profile.based} v={SITE.location} />
              <ProfileRow k={t.profile.building} v={t.profileValues.building} />
              <ProfileRow k={t.profile.since} v={t.profileValues.since} />
              <ProfileRow k={t.profile.focus} v={t.profileValues.focus} />
              <ProfileRow k={t.profile.projects} v={t.profileValues.projects(projects.length)} />
            </div>
          </div>
        )}

        {tab === "projects" && project && (
          <div key="projects" className={clsx("card-swap flex h-full", compact && "flex-col")}>
            <nav
              aria-label={t.tabs.projects}
              className={clsx(
                "shrink-0 border-white/10 p-3",
                compact ? "desk-scroll flex gap-2 overflow-x-auto border-b" : "w-60 border-r"
              )}
            >
              {projects.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSlug(p.slug)}
                  aria-current={p.slug === project.slug}
                  className={clsx(
                    "tile-fx block rounded-md px-3 py-2.5 text-left",
                    compact ? "shrink-0" : "mb-1 w-full",
                    p.slug === project.slug ? "bg-white/10" : "hover:bg-white/5"
                  )}
                >
                  <span className="block text-[17px] font-semibold">{p.title}</span>
                  <span className="block font-desk-mono text-[13px] text-[#a89fc0]">{p.period}</span>
                </button>
              ))}
            </nav>
            <article
              key={project.slug}
              className={clsx("card-swap desk-scroll min-h-0 min-w-0 flex-1 overflow-y-auto", compact ? "px-5 py-4" : "px-8 py-6")}
            >
              <p className="font-desk-mono text-sm text-[#8273a3]">$ cat ~/projects/{project.slug}/README.md</p>
              <h3 className={clsx("mt-2 font-bold", compact ? "text-2xl" : "text-3xl")}>{project.title}</h3>
              <p className="mt-1 text-lg text-[#ccc7d8]">{project.tagline}</p>
              <dl className="mt-5 space-y-4 text-[17px] leading-relaxed">
                {(["problem", "solution", "impact"] as const).map((key) => (
                  <div key={key}>
                    <dt className="font-desk-mono text-sm uppercase tracking-wider text-[#f0a6ca]">
                      {labels[key]}
                    </dt>
                    <dd className="mt-1 text-[#e6e1f0]">{project[key]}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 font-desk-mono text-[15px] text-[#a89fc0]">
                <span className="text-[#8273a3]">&quot;stack&quot;: [</span>
                {project.stack.map((s, i) => (
                  <span key={s}>
                    <span className="text-[#f0a6ca]">&quot;{s}&quot;</span>
                    {i < project.stack.length - 1 ? ", " : ""}
                  </span>
                ))}
                <span className="text-[#8273a3]">]</span>
              </p>
              {project.links.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3 pb-2">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-[#f0a6ca]/60 px-4 py-2 font-desk-mono text-[15px] text-[#f0a6ca] transition-colors hover:bg-[#f0a6ca] hover:text-[#1d1827]"
                    >
                      {link.label ?? linkLabels[language][link.kind]} ↗
                    </a>
                  ))}
                </div>
              )}
            </article>
          </div>
        )}

        {tab === "stack" && (
          <div key="stack" className={clsx("card-swap desk-scroll grid h-full gap-y-6 overflow-y-auto", compact ? "grid-cols-1 px-5 py-5" : "grid-cols-2 gap-x-10 px-10 py-7")}>
            {skillGroups.map((group) => (
              <section key={group.id}>
                <h3 className="font-desk-mono text-sm uppercase tracking-wider text-[#f0a6ca]">
                  {skillGroupLabels[language][group.id]}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-center gap-2 rounded-md bg-white/[0.06] px-3 py-1.5 text-[15px]"
                    >
                      {skill.icon && <skill.icon aria-hidden className="text-[#b5a6d3]" />}
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ k, v }: { k: string; v: string }) {
  return (
    <p>
      <span className="inline-block w-24 text-[#f0a6ca] md:w-36">{k}</span>
      <span>{v}</span>
    </p>
  );
}

export function MonitorScreen({ language, active }: ScreenProps) {
  return (
    <ScreenShell active={active} cover={<CoverLabel>{deskCopy[language].stations.projects}</CoverLabel>} className="bg-[#14111c]">
      <MonitorContent language={language} />
    </ScreenShell>
  );
}

/* ------------------------------------------------------------------ */
/* Board: experience badges                                            */
/* ------------------------------------------------------------------ */

const LANYARDS = ["#f0a6ca", "#b5a6d3", "#7dd3c0", "#f5c26b", "#8fb3f0", "#e58f8f"];

export function BoardContent({ language, compact = false }: { language: Language; compact?: boolean }) {
  const t = deskCopy[language];
  const items = experienceData[language];
  const [index, setIndex] = React.useState(0);
  // Which side the next card comes from (prev → left, next → right).
  const [back, setBack] = React.useState(false);
  const item = items[index];
  const kindLabel = item.kind === "work" ? t.experience.work : t.experience.education;
  const go = (delta: number) => {
    setBack(delta < 0);
    setIndex((i) => (i + delta + items.length) % items.length);
  };
  const jump = (i: number) => {
    setBack(i < index);
    setIndex(i);
  };

  return (
    <div className={clsx("flex h-full flex-col bg-[#1a1622]/95 text-[#e6e1f0]", compact ? "px-4 pb-4 pt-5" : "px-8 py-6")}>
      <div className="flex items-center justify-between">
        <h3 className="font-desk-mono text-lg uppercase tracking-widest text-[#f0a6ca]">
          {experienceLabels[language].heading}
        </h3>
        <div className="flex items-center gap-3 font-desk-mono">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t.experience.prev}
            className="grid h-11 w-11 place-items-center rounded-md border border-white/15 text-xl hover:bg-white/10"
          >
            ‹
          </button>
          <span aria-live="polite" className="w-20 text-center text-lg">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t.experience.next}
            className="grid h-11 w-11 place-items-center rounded-md border border-white/15 text-xl hover:bg-white/10"
          >
            ›
          </button>
        </div>
      </div>

      <div className={clsx("mt-5 flex min-h-0 flex-1", compact ? "desk-scroll flex-col gap-4 overflow-y-auto" : "gap-8")}>
        {/* Badge */}
        <div key={`badge-${index}`} className={clsx("badge-drop relative flex shrink-0 flex-col items-center", compact ? "mx-auto w-56" : "w-64")}>
          <span className="h-14 w-3 rounded-b" style={{ background: LANYARDS[index % LANYARDS.length] }} />
          <div className="tile-fx w-full rounded-xl bg-[#f4f1f8] p-4 text-[#2b1e3f] shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
            <div className="rounded-md px-3 py-2 text-center text-sm font-bold uppercase tracking-wider text-white" style={{ background: LANYARDS[index % LANYARDS.length] }}>
              {kindLabel}
            </div>
            <p className="mt-4 text-center text-xl font-bold leading-tight">{item.organization}</p>
            <p className="mt-2 text-center text-[15px] leading-snug text-[#533b75]">{item.role}</p>
            <p className="mt-3 text-center font-desk-mono text-[13px] text-[#63478e]">{item.period}</p>
            {item.current && (
              <p className="mx-auto mt-3 w-fit rounded-full bg-[#2b1e3f] px-3 py-1 font-desk-mono text-xs uppercase text-[#f0a6ca]">
                {experienceLabels[language].current}
              </p>
            )}
          </div>
        </div>
        {/* Details */}
        <div
          key={`details-${index}`}
          className={clsx("card-swap min-w-0 flex-1 pr-2", back && "from-left", !compact && "desk-scroll overflow-y-auto")}
        >
          <p className="text-2xl font-bold">{item.role}</p>
          <p className="mt-1 text-lg text-[#ccc7d8]">
            {item.organization}
            {item.location ? ` · ${item.location}` : ""}
          </p>
          <ul className="mt-4 space-y-3 text-[17px] leading-relaxed">
            {item.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f0a6ca]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {items.map((it, i) => (
          <button
            key={`${it.organization}-${it.role}`}
            type="button"
            onClick={() => jump(i)}
            aria-label={`${it.organization} — ${it.role}`}
            aria-current={i === index}
            className={clsx("h-2.5 rounded-full transition-all", i === index ? "w-8 bg-[#f0a6ca]" : "w-2.5 bg-white/25 hover:bg-white/50")}
          />
        ))}
      </div>
    </div>
  );
}

export function BoardScreen({ language, active }: ScreenProps) {
  const items = experienceData[language].filter((i) => i.kind === "work");
  return (
    <ScreenShell
      active={active}
      cover={
        <div className="flex h-full w-full items-start justify-around px-10 pt-6">
          {items.map((item, i) => (
            <div key={item.organization} className="flex flex-col items-center">
              <span className="h-28 w-2" style={{ background: LANYARDS[i % LANYARDS.length] }} />
              <div className="w-36 rounded-lg bg-[#f4f1f8] p-3 text-center text-[#2b1e3f] shadow-lg">
                <div className="h-4 rounded-sm" style={{ background: LANYARDS[i % LANYARDS.length] }} />
                <p className="mt-3 text-[15px] font-bold leading-tight">{item.organization}</p>
                <p className="mt-1 font-desk-mono text-[11px] text-[#63478e]">{item.period}</p>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <BoardContent language={language} />
    </ScreenShell>
  );
}

/* ------------------------------------------------------------------ */
/* Poster: about                                                       */
/* ------------------------------------------------------------------ */

/** Profile photo, cropped on the face by Cloudinary (portrait for the polaroid). */
const PORTRAIT = "https://res.cloudinary.com/ddtjwx08b/image/upload/c_fill,g_face,w_360,h_420,q_auto,f_auto/v1697323330/Enzo.jpg";

/** Five-petal sakura blossom, drawn around (0, 0). */
function Blossom({ x, y, r, rotate = 0 }: { x: number; y: number; r: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-r * 0.62} rx={r * 0.48} ry={r * 0.66} fill="#f5b8cc" transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.22} fill="#b5566f" />
    </g>
  );
}

/** Cherry branch for the corner of the scroll. */
function SakuraBranch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 120" className={className} aria-hidden>
      <path d="M170 6 C128 18 100 40 76 66 S34 104 6 116" stroke="#6b4a3a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M104 36 C110 52 124 60 140 62" stroke="#6b4a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M62 80 C60 92 66 102 76 108" stroke="#6b4a3a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Blossom x={140} y={62} r={11} rotate={10} />
      <Blossom x={118} y={28} r={9} rotate={40} />
      <Blossom x={84} y={58} r={10} rotate={-15} />
      <Blossom x={76} y={108} r={8} rotate={25} />
      <Blossom x={40} y={92} r={7} rotate={-30} />
      <circle cx={152} cy={20} r={3.5} fill="#f5b8cc" />
      <circle cx={98} cy={82} r={3} fill="#f5b8cc" />
    </svg>
  );
}

const icon = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const FACT_ICONS = {
  pin: (
    <svg {...icon} aria-hidden>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
  build: (
    <svg {...icon} aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
  since: (
    <svg {...icon} aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  ),
  focus: (
    <svg {...icon} aria-hidden>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

/**
 * About as a Japanese profile card on washi paper (ref: "About me / 私について"
 * cards): a taped polaroid, four facts with icons, then the profile text.
 * `cover` is the same card without the long text, shown from across the room.
 */
export function PosterContent({ language, cover = false }: { language: Language; cover?: boolean }) {
  const t = deskCopy[language];
  const facts = [
    { icon: FACT_ICONS.pin, k: t.profile.based, v: SITE.location },
    { icon: FACT_ICONS.build, k: t.profile.building, v: t.profileValues.building },
    { icon: FACT_ICONS.since, k: t.profile.since, v: t.profileValues.since },
    { icon: FACT_ICONS.focus, k: t.profile.focus, v: t.profileValues.focus },
  ];
  return (
    <div className={clsx("relative h-full w-full bg-[#f6f0e4] px-8 py-8 text-[#2b1e3f]", cover ? "overflow-hidden" : "desk-scroll overflow-y-auto")}>
      <SakuraBranch className="pointer-events-none absolute -right-1 top-0 w-44" />
      <p className="font-desk-mono text-xs uppercase tracking-[0.3em] text-[#b5566f]">03 · {t.about.title}</p>
      <h3 lang="ja" className="mt-1 font-serif text-4xl font-bold tracking-wider">
        私について
      </h3>
      <div className="mt-7 flex flex-wrap items-start gap-x-6 gap-y-5">
        <figure className="relative w-[168px] shrink-0 -rotate-3 bg-white p-2 pb-9 shadow-[0_12px_26px_-10px_rgba(43,30,63,0.45)]">
          <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-[#f0a6ca]/70" />
          {/* eslint-disable-next-line @next/next/no-img-element -- already sized and optimized by Cloudinary */}
          <img src={PORTRAIT} alt={language === "ENG" ? "Portrait of Enzo Arjona" : "Retrato de Enzo Arjona"} width={152} height={177} className="block h-auto w-full" loading="lazy" />
          <figcaption className="absolute inset-x-0 bottom-2.5 text-center font-desk-mono text-[11px] text-[#63478e]">{SITE.name}</figcaption>
        </figure>
        <ul className="min-w-[190px] flex-1 space-y-3.5">
          {facts.map((f) => (
            <li key={f.k} className="flex gap-3">
              <span className="mt-0.5 shrink-0 text-[#b5566f]">{f.icon}</span>
              <span>
                <span className="block font-desk-mono text-[11px] uppercase tracking-widest text-[#7a6a8f]">{f.k}</span>
                <span className="block text-[15px] leading-snug">{f.v}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      {!cover && (
        <section className="mt-8 rounded-lg border border-[#2b1e3f]/10 bg-[#efe5d2] px-5 py-5">
          <h4 className="font-desk-mono text-xs uppercase tracking-[0.3em] text-[#b5566f]">{t.tabs.profile}</h4>
          <div className="mt-3 space-y-3 text-[16px] leading-relaxed">
            {t.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function PosterScreen({ language, active }: ScreenProps) {
  return (
    <ScreenShell active={active} className="bg-[#f6f0e4]" cover={<PosterContent language={language} cover />}>
      <PosterContent language={language} />
    </ScreenShell>
  );
}

/* ------------------------------------------------------------------ */
/* Phone: contact                                                      */
/* ------------------------------------------------------------------ */

function useMendozaTime() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function PhoneContent({ language }: { language: Language }) {
  const t = deskCopy[language];
  const now = useMendozaTime();
  const locale = language === "ENG" ? "en-US" : "es-AR";
  const time = now?.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Argentina/Mendoza" });
  const date = now?.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short", timeZone: "America/Argentina/Mendoza" });

  const rows = [
    { k: "email", v: SITE.email, href: `mailto:${SITE.email}` },
    { k: "github", v: SITE.github.replace("https://github.com/", ""), href: SITE.github },
    { k: "linkedin", v: SITE.linkedin.replace("https://www.linkedin.com/in/", "").replace(/\/$/, ""), href: SITE.linkedin },
    { k: t.contact.cv, v: t.contact.cvLabel, href: "/cv-enzo-arjona.pdf" },
  ];

  return (
    <div className="flex h-full flex-col bg-[#14111c] px-6 pb-8 pt-10 text-[#e6e1f0]">
      <p className="text-center font-desk-mono text-6xl font-bold tabular-nums">{time ?? "--:--"}</p>
      <p className="mt-1 text-center font-desk-mono text-sm uppercase tracking-widest text-[#a89fc0]">
        {date ?? ""} · {t.contact.local}
      </p>
      <h3 className="mt-8 text-2xl font-bold">{SITE.name}</h3>
      <p className="text-[15px] text-[#ccc7d8]">{SITE.role}</p>
      <ul className="mt-6 space-y-3">
        {rows.map((row) => (
          <li key={row.k}>
            <a
              href={row.href}
              {...(row.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="tile-fx block rounded-xl bg-white/[0.06] px-4 py-3 hover:bg-white/[0.1]"
            >
              <span className="block font-desk-mono text-xs uppercase tracking-wider text-[#f0a6ca]">{row.k}</span>
              <span className="block break-all text-[15px]">{row.v}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PhoneScreen({ language, active }: ScreenProps) {
  const now = useMendozaTime();
  const time = now?.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Argentina/Mendoza" });
  return (
    <ScreenShell
      active={active}
      className="rounded-[36px] bg-[#14111c]"
      cover={
        <div className="flex h-full w-full flex-col items-center bg-gradient-to-b from-[#2b1e3f] to-[#14111c] pt-24">
          <span className="font-desk-mono text-7xl font-bold text-[#e6e1f0]">{time ?? "--:--"}</span>
          <span className="mt-3 font-desk-mono text-lg uppercase tracking-widest text-[#f0a6ca]">
            {deskCopy[language].stations.contact}
          </span>
        </div>
      }
    >
      <PhoneContent language={language} />
    </ScreenShell>
  );
}

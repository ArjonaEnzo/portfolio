"use client";
import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  TbBrandGithub,
  TbBrandLinkedin,
  TbCheck,
  TbCopy,
  TbDownload,
  TbExternalLink,
  TbMail,
  TbPlayerPlay,
} from "react-icons/tb";
import type { Language, ProjectLinkKind } from "@/lib/projects";
import { getProjects, linkLabels, projectLabels } from "@/lib/projects";
import { experienceData, experienceLabels } from "@/lib/experience";
import { skillGroupLabels, skillGroups } from "@/lib/skills";
import { SITE } from "@/lib/site";
import { sendEmail } from "@/actions/sendEmail";
import { SubmitBtn } from "@/components/submit-btn";

// Gallery thumbnails render at 80 px; ask Cloudinary for a small copy instead
// of the 1600 px original (images are unoptimized, see next.config.js).
const thumb = (src: string) => src.replace("w_1600,c_limit", "w_240,c_limit");

const CV_URL = "/cv-enzo-arjona.pdf";

const AVATAR = "https://res.cloudinary.com/ddtjwx08b/image/upload/f_auto,q_auto,w_320,c_fill,g_face/v1697323330/Enzo.jpg";

/* ------------------------------------------------------------------ */

export function ProfilePanel({
  language,
  onGo,
}: {
  language: Language;
  onGo: (section: "proyectos" | "contacto") => void;
}) {
  const en = language === "ENG";
  const facts = en
    ? ["Working with clients since 2023", "SaaS in production", "500+ tests in MyRent"]
    : ["Con clientes desde 2023", "SaaS en producción", "500+ tests en MyRent"];

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Image
          src={AVATAR}
          alt="Enzo Arjona"
          width={112}
          height={112}
          priority
          className="h-24 w-24 flex-none rounded-full object-cover ring-1 ring-[var(--cl-line)] sm:h-28 sm:w-28"
        />
        <div>
          <h2 className="cl-title text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.1]">
            {en ? "Reliable software, from the database to the last pixel." : "Software confiable, de la base de datos al último píxel."}
          </h2>
          <p className="mt-2 text-[var(--cl-muted)]">
            {en ? "Full-stack developer · Mendoza, Argentina" : "Desarrollador full-stack · Mendoza, Argentina"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-4 leading-relaxed text-[var(--cl-ink)]/90">
          {en ? (
            <>
              <p>
                I&apos;m a full-stack developer from Mendoza, Argentina. I started at a technical high school, trained
                at the Henry bootcamp and am now finishing a degree in software development. Since 2023 I&apos;ve
                shipped work for clients and agencies, and I built and launched <b>MyRent</b>, a rental-management SaaS
                now live with its first customers.
              </p>
              <p>
                I care about the parts that make software trustworthy: typed code, database-level security, automated
                tests and CI, and clear error handling. I like owning a feature end to end, from the Postgres schema to
                the last pixel.
              </p>
            </>
          ) : (
            <>
              <p>
                Soy desarrollador full-stack de Mendoza, Argentina. Arranqué en una escuela técnica, me formé en el
                bootcamp de Henry y hoy estoy terminando la tecnicatura en desarrollo de software. Desde 2023 trabajo
                para clientes y agencias, y construí y lancé <b>MyRent</b>, un SaaS de gestión de alquileres que ya está
                en producción con sus primeros clientes.
              </p>
              <p>
                Me importa lo que hace confiable al software: código tipado, seguridad a nivel de base de datos, tests
                automatizados con CI y manejo claro de errores. Me gusta hacerme cargo de una feature de punta a punta,
                del esquema en Postgres al último píxel.
              </p>
            </>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <p className="cl-label mb-2">{en ? "At a glance" : "En pocas palabras"}</p>
            <div className="flex flex-wrap gap-2">
              {facts.map((f, i) => (
                <span key={f} className={i === 1 ? "cl-chip is-ok" : "cl-chip"}>
                  {i === 1 && <span className="cl-dot" aria-hidden />}
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="cl-label mb-2">{en ? "Looking for" : "Busco"}</p>
            <p className="leading-relaxed text-[var(--cl-muted)]">
              {en
                ? "Product teams that value typed code, database security and CI. I also take freelance work: WordPress sites and Next.js apps."
                : "Equipos de producto que valoren el código tipado, la seguridad en la base de datos y el CI. También tomo trabajos freelance: sitios WordPress y apps en Next.js."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => onGo("proyectos")} className="cl-btn px-4 py-2.5 text-sm">
              {en ? "See projects" : "Ver proyectos"}
            </button>
            <button type="button" onClick={() => onGo("contacto")} className="cl-ghost px-4 py-2.5 text-sm">
              {en ? "Get in touch" : "Contactame"}
            </button>
            <a href={CV_URL} target="_blank" rel="noreferrer" className="cl-ghost inline-flex items-center gap-2 px-4 py-2.5 text-sm">
              <TbDownload aria-hidden /> {en ? "Resume (PDF)" : "CV (PDF)"}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

const linkIcons: Record<ProjectLinkKind, React.ReactNode> = {
  live: <TbExternalLink aria-hidden />,
  repo: <TbBrandGithub aria-hidden />,
  video: <TbPlayerPlay aria-hidden />,
};

// Status facts shown as badges on top of a project card.
const projectBadges: Record<string, Record<Language, string[]>> = {
  myrent: { ESP: ["En producción", "500+ tests · CI"], ENG: ["In production", "500+ tests · CI"] },
};

export function ProjectsPanel({ language }: { language: Language }) {
  const labels = projectLabels[language];
  const projects = getProjects(language);

  return (
    <>
      <h2 className="cl-title text-[clamp(1.7rem,3vw,2.6rem)] leading-tight">
        {language === "ENG" ? "Projects" : "Proyectos"}
      </h2>
      <p className="mt-2 text-[var(--cl-muted)]">
        {language === "ENG"
          ? "Real work: in production, for clients and in teams."
          : "Trabajo real: en producción, para clientes y en equipo."}
      </p>

      {projects.map((p, i) => (
        <article key={p.slug} className="mt-10 border-t border-[var(--cl-line)] pt-8 first-of-type:mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="cl-title text-[1.6rem] leading-tight">{p.title}</h3>
            <span className="cl-label">{p.period}</span>
          </div>
          <p className="mt-1 text-[var(--cl-muted)]">{p.tagline}</p>
          {projectBadges[p.slug] && (
            <div className="mt-3 flex flex-wrap gap-2">
              {projectBadges[p.slug][language].map((b) => (
                <span key={b} className="cl-chip is-ok">
                  <span className="cl-dot" aria-hidden />
                  {b}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="min-w-0">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-[var(--cl-line)] bg-[var(--cl-wall)]">
                <Image
                  src={p.cover}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 34vw, 90vw"
                  className="object-cover object-top"
                />
              </div>
              {p.gallery.length > 1 && (
                <ul className="mt-2 flex gap-2 overflow-x-auto pb-1" aria-label={labels.gallery}>
                  {p.gallery.map((src, g) => (
                    <li key={src} className="flex-none">
                      <a
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${p.title} — ${labels.gallery} ${g + 1}`}
                        className="relative block h-12 w-20 overflow-hidden rounded border border-[var(--cl-line)] transition-opacity hover:opacity-80"
                      >
                        <Image src={thumb(src)} alt="" fill sizes="80px" className="object-cover object-top" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <dl className="space-y-4 text-[0.95rem] leading-relaxed">
              <div>
                <dt className="cl-label mb-1">{labels.problem}</dt>
                <dd>{p.problem}</dd>
              </div>
              <div>
                <dt className="cl-label mb-1">{labels.solution}</dt>
                <dd>{p.solution}</dd>
              </div>
              <div>
                <dt className="cl-label mb-1">{labels.impact}</dt>
                <dd>{p.impact}</dd>
              </div>
              {p.decision && (
                <div>
                  <dt className="cl-label mb-1">{labels.decision}</dt>
                  <dd>{p.decision}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span key={s} className="cl-chip">
                {s}
              </span>
            ))}
          </div>
          {p.links.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="cl-ghost inline-flex items-center gap-2 px-3.5 py-2 text-sm"
                >
                  {linkIcons[l.kind]}
                  {l.label ?? linkLabels[language][l.kind]}
                </a>
              ))}
            </div>
          )}
        </article>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */

export function SkillsPanel({ language }: { language: Language }) {
  return (
    <>
      <h2 className="cl-title text-[clamp(1.7rem,3vw,2.6rem)] leading-tight">
        {language === "ENG" ? "Skills" : "Habilidades"}
      </h2>
      <p className="mt-2 text-[var(--cl-muted)]">
        {language === "ENG" ? "What I use in production, grouped by area." : "Lo que uso en producción, agrupado por área."}
      </p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {skillGroups.map((g) => (
          <section key={g.id}>
            <h3 className="cl-label mb-3">{skillGroupLabels[language][g.id]}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.skills.map(({ name, icon: Icon }) => (
                <li key={name} className="cl-chip !text-[0.8rem]">
                  {Icon && <Icon aria-hidden />}
                  {name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

export function ExperiencePanel({ language }: { language: Language }) {
  const labels = experienceLabels[language];
  const items = experienceData[language];
  const columns = [
    { title: labels.work, items: items.filter((x) => x.kind === "work") },
    { title: labels.education, items: items.filter((x) => x.kind === "education") },
  ];

  return (
    <>
      <h2 className="cl-title text-[clamp(1.7rem,3vw,2.6rem)] leading-tight">{labels.heading}</h2>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {columns.map((col) => (
          <section key={col.title}>
            <h3 className="cl-label mb-4">{col.title}</h3>
            <ol className="space-y-7 border-l border-[var(--cl-line)] pl-5">
              {col.items.map((x) => (
                <li key={`${x.organization}-${x.period}`} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--cl-sheet)] bg-[var(--cl-accent)]"
                  />
                  <p className="cl-label flex flex-wrap items-center gap-2">
                    {x.period}
                    {x.current && <span className="cl-chip is-ok !py-0 !text-[0.65rem]">{labels.current}</span>}
                  </p>
                  <p className="mt-1 font-semibold">{x.role}</p>
                  <p className="text-sm text-[var(--cl-muted)]">
                    {x.organization}
                    {x.location ? ` · ${x.location}` : ""}
                  </p>
                  {x.highlights.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[0.92rem] leading-relaxed marker:text-[var(--cl-faint)]">
                      {x.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

export function ContactPanel({ language }: { language: Language }) {
  const en = language === "ENG";
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <>
      <h2 className="cl-title text-[clamp(1.7rem,3vw,2.6rem)] leading-tight">{en ? "Let's talk." : "Hablemos."}</h2>
      <p className="mt-2 text-[var(--cl-muted)]">
        {en
          ? "Job offers, freelance projects or questions: I usually reply within a day."
          : "Ofertas de trabajo, proyectos freelance o consultas: suelo responder en el día."}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div>
            <p className="cl-label mb-2">Email</p>
            <div className="flex flex-wrap items-center gap-2">
              <a href={`mailto:${SITE.email}`} className="text-lg font-medium underline-offset-4 hover:underline">
                {SITE.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={en ? "Copy email" : "Copiar email"}
                className="cl-ghost grid h-9 w-9 place-items-center"
              >
                {copied ? <TbCheck aria-hidden /> : <TbCopy aria-hidden />}
              </button>
            </div>
          </div>
          <div>
            <p className="cl-label mb-2">{en ? "Elsewhere" : "También"}</p>
            <div className="flex flex-wrap gap-2">
              <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="cl-ghost inline-flex items-center gap-2 px-3.5 py-2 text-sm">
                <TbBrandLinkedin aria-hidden /> LinkedIn
              </a>
              <a href={SITE.github} target="_blank" rel="noreferrer" className="cl-ghost inline-flex items-center gap-2 px-3.5 py-2 text-sm">
                <TbBrandGithub aria-hidden /> GitHub
              </a>
              <a href={`mailto:${SITE.email}`} className="cl-ghost inline-flex items-center gap-2 px-3.5 py-2 text-sm">
                <TbMail aria-hidden /> {en ? "Write an email" : "Escribir un mail"}
              </a>
              <a href={CV_URL} target="_blank" rel="noreferrer" className="cl-ghost inline-flex items-center gap-2 px-3.5 py-2 text-sm">
                <TbDownload aria-hidden /> {en ? "Resume (PDF)" : "CV (PDF)"}
              </a>
            </div>
          </div>
        </div>

        <form
          className="flex flex-col gap-3"
          action={async (formData) => {
            const { error } = await sendEmail(formData).catch(() => ({
              error: en ? "Something went wrong" : "Algo salió mal",
            }));
            if (error) {
              toast.error(error);
              return;
            }
            toast.success(en ? "Message sent!" : "¡Mensaje enviado!");
          }}
        >
          <label htmlFor="senderEmail" className="cl-label">
            {en ? "Your email" : "Tu email"}
          </label>
          <input
            id="senderEmail"
            type="email"
            name="senderEmail"
            required
            maxLength={500}
            autoComplete="email"
            placeholder={en ? "you@company.com" : "vos@empresa.com"}
            className="cl-input"
          />
          <label htmlFor="message" className="cl-label mt-2">
            {en ? "Message" : "Mensaje"}
          </label>
          <textarea
            id="message"
            name="message"
            required
            maxLength={5000}
            rows={6}
            placeholder={en ? "Tell me about the role or the project" : "Contame del puesto o del proyecto"}
            className="cl-input resize-y"
          />
          <SubmitBtn />
        </form>
      </div>
    </>
  );
}

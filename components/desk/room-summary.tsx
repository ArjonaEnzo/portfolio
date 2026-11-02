import Link from "next/link";
import type { Language } from "@/lib/projects";
import { getProjects, linkLabels, projectLabels } from "@/lib/projects";
import { experienceData, experienceLabels } from "@/lib/experience";
import { skillGroupLabels, skillGroups } from "@/lib/skills";
import { SITE } from "@/lib/site";
import { deskCopy } from "./desk-copy";

/**
 * Server-rendered text version of the 3D room. The room itself is a client-only
 * canvas, so without this the HTML of `/` holds only the boot screen and search
 * engines see an empty page. It renders the same content the visitor reaches
 * through the room's stations (all of it from lib/), visually hidden but kept in
 * the accessibility tree, so screen readers get it too.
 */
export default function RoomSummary({ language }: { language: Language }) {
  const en = language === "ENG";
  const t = deskCopy[language];
  const projects = getProjects(language);
  const labels = projectLabels[language];
  const exp = experienceLabels[language];
  const items = experienceData[language];
  const groups = skillGroupLabels[language];

  return (
    <div className="sr-only">
      <h1>
        {SITE.name}: {en ? "Full-Stack Developer" : "Desarrollador Full-Stack"}
      </h1>
      <p>
        {en ? SITE.description : SITE.descriptionEs}
      </p>
      <p>
        <Link href="/clasica">{t.classicLong}</Link>
      </p>

      <section aria-labelledby="summary-about">
        <h2 id="summary-about">{t.about.title}</h2>
        {t.about.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      <section aria-labelledby="summary-projects">
        <h2 id="summary-projects">{t.stations.projects}</h2>
        {projects.map((p) => (
          <article key={p.slug}>
            <h3>{p.title}</h3>
            <p>
              {p.period}. {p.tagline}
            </p>
            <p>
              {labels.problem}: {p.problem}
            </p>
            <p>
              {labels.solution}: {p.solution}
            </p>
            <p>
              {labels.impact}: {p.impact}
            </p>
            {p.decision && (
              <p>
                {labels.decision}: {p.decision}
              </p>
            )}
            <p>Stack: {p.stack.join(", ")}.</p>
            {p.links.length > 0 && (
              <ul>
                {p.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label ?? `${linkLabels[language][l.kind]}: ${p.title}`}</a>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>

      <section aria-labelledby="summary-skills">
        <h2 id="summary-skills">{en ? "Skills" : "Habilidades"}</h2>
        <ul>
          {skillGroups.map((g) => (
            <li key={g.id}>
              {groups[g.id]}: {g.skills.map((s) => s.name).join(", ")}.
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="summary-experience">
        <h2 id="summary-experience">{exp.heading}</h2>
        {(["work", "education"] as const).map((kind) => (
          <div key={kind}>
            <h3>{kind === "work" ? exp.work : exp.education}</h3>
            <ul>
              {items
                .filter((i) => i.kind === kind)
                .map((i) => (
                  <li key={`${i.organization}-${i.period}`}>
                    {i.role}, {i.organization} ({i.period}
                    {i.location ? `, ${i.location}` : ""}).{" "}
                    {i.highlights.join(" ")}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="summary-contact">
        <h2 id="summary-contact">{t.contact.title}</h2>
        <ul>
          <li>
            Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </li>
          <li>
            <a href={SITE.linkedin}>LinkedIn</a>
          </li>
          <li>
            <a href={SITE.github}>GitHub</a>
          </li>
          <li>{SITE.location}</li>
        </ul>
      </section>
    </div>
  );
}

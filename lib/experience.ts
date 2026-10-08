import type { Language } from "./projects";

export type ExperienceKind = "work" | "education";

export type ExperienceItem = {
  kind: ExperienceKind;
  role: string;
  organization: string;
  /** Free-form period label, already localized. */
  period: string;
  location?: string;
  /** Short achievement-oriented bullets (max 3). */
  highlights: readonly string[];
  /** True for the current position / studies. */
  current?: boolean;
};

export const experienceLabels: Record<
  Language,
  { heading: string; work: string; education: string; current: string }
> = {
  ENG: {
    heading: "Experience",
    work: "Work",
    education: "Education",
    current: "Current",
  },
  ESP: {
    heading: "Experiencia",
    work: "Trabajo",
    education: "Formación",
    current: "Actual",
  },
};

export const experienceData: Record<Language, readonly ExperienceItem[]> = {
  ENG: [
    {
      kind: "work",
      role: "Founder & Full-Stack Developer",
      organization: "MyRent",
      period: "Apr 2026 — present",
      location: "Mendoza, Argentina · remote",
      current: true,
      highlights: [
        "Designed, built and run a multi-tenant rental-management SaaS now in production with paying customers (Next.js 15, TypeScript, Supabase/PostgreSQL).",
        "Enforced account isolation with Row Level Security, integrated Mercado Pago with signed, idempotent webhooks, and automated billing with cron jobs and immutable PDF receipts.",
        "Set up CI with type-check, 500+ unit tests, RLS integration tests, Playwright E2E and security gates (secret scanning, dependency audit).",
      ],
    },
    {
      kind: "work",
      role: "WordPress Developer",
      organization: "Dharma Digital Marketing Agency",
      period: "Aug 2024 — present",
      location: "Remote",
      current: true,
      highlights: [
        "Build and maintain client websites with WordPress, Elementor and custom CSS/JavaScript.",
        "Deliver landing pages optimized for mobile speed and local SEO for small businesses in the US.",
      ],
    },
    {
      kind: "work",
      role: "Full-Stack Developer",
      organization: "Fisiom Fulness",
      period: "Feb 2024 — May 2024",
      location: "Remote",
      highlights: [
        "Designed the data models and REST CRUD for users, professionals and products with soft delete (Node.js, Express, MongoDB).",
        "Built the product-management interface with stock control in Next.js and Tailwind CSS.",
      ],
    },
    {
      kind: "work",
      role: "Full-Stack Developer (internship)",
      organization: "Club ADIP",
      period: "Aug 2023 — Sep 2023",
      location: "Buenos Aires, Argentina · remote",
      highlights: [
        "Delivered a single-page admin platform for a sports club: members, dues, sponsors and news (React, Nest.js, PostgreSQL, TypeORM).",
      ],
    },
    {
      kind: "education",
      role: "Higher Technician in Software Development",
      organization: "IES 9-021 Tecnológico Junín",
      period: "2024 — present",
      current: true,
      highlights: ["Third year of a three-year degree."],
    },
    {
      kind: "education",
      role: "Full-Stack Web Development Bootcamp",
      organization: "Henry",
      period: "Jun 2023 — Sep 2023",
      highlights: [
        "800+ hours, project-based: JavaScript, React, Redux, Node.js, Express, PostgreSQL, agile teamwork.",
      ],
    },
    {
      kind: "education",
      role: "Technician in Electromechanical and Industrial Installations",
      organization: "Escuela Técnica José de San Martín 4-120",
      period: "2013 — 2018",
      highlights: [],
    },
  ],
  ESP: [
    {
      kind: "work",
      role: "Fundador y desarrollador Full-Stack",
      organization: "MyRent",
      period: "Abr 2026 — presente",
      location: "Mendoza, Argentina · remoto",
      current: true,
      highlights: [
        "Diseñé, construí y mantengo un SaaS multi-tenant de gestión de alquileres, hoy en producción con clientes que pagan (Next.js 15, TypeScript, Supabase/PostgreSQL).",
        "Aislamiento entre cuentas con Row Level Security, integración con Mercado Pago vía webhooks firmados e idempotentes, facturación automática con cron y recibos PDF inmutables.",
        "CI con type-check, más de 500 tests unitarios, tests de integración de RLS, E2E con Playwright y gates de seguridad (escaneo de secretos, auditoría de dependencias).",
      ],
    },
    {
      kind: "work",
      role: "Desarrollador WordPress",
      organization: "Dharma Digital Marketing Agency",
      period: "Ago 2024 — presente",
      location: "Remoto",
      current: true,
      highlights: [
        "Construyo y mantengo sitios de clientes con WordPress, Elementor y CSS/JavaScript a medida.",
        "Landing pages optimizadas para velocidad en móvil y SEO local para pymes de Estados Unidos.",
      ],
    },
    {
      kind: "work",
      role: "Desarrollador Full-Stack",
      organization: "Fisiom Fulness",
      period: "Feb 2024 — May 2024",
      location: "Remoto",
      highlights: [
        "Diseñé los modelos de datos y el CRUD REST de usuarios, profesionales y productos con soft delete (Node.js, Express, MongoDB).",
        "Construí la interfaz de gestión de productos con control de stock en Next.js y Tailwind CSS.",
      ],
    },
    {
      kind: "work",
      role: "Desarrollador Full-Stack (pasantía)",
      organization: "Club ADIP",
      period: "Ago 2023 — Sep 2023",
      location: "Buenos Aires, Argentina · remoto",
      highlights: [
        "Entregué una plataforma de administración SPA para un club deportivo: socios, cuotas, sponsors y noticias (React, Nest.js, PostgreSQL, TypeORM).",
      ],
    },
    {
      kind: "education",
      role: "Tecnicatura Superior en Desarrollo de Software",
      organization: "IES 9-021 Tecnológico Junín",
      period: "2024 — presente",
      current: true,
      highlights: ["Cursando el tercer año de la carrera de tres."],
    },
    {
      kind: "education",
      role: "Bootcamp de Desarrollo Web Full-Stack",
      organization: "Henry",
      period: "Jun 2023 — Sep 2023",
      highlights: [
        "Más de 800 horas basadas en proyectos: JavaScript, React, Redux, Node.js, Express, PostgreSQL, trabajo ágil en equipo.",
      ],
    },
    {
      kind: "education",
      role: "Técnico en Instalaciones Electromecánicas e Industriales",
      organization: "Escuela Técnica José de San Martín 4-120",
      period: "2013 — 2018",
      highlights: [],
    },
  ],
};

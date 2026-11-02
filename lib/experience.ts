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
      period: "Jul 2025 — present",
      location: "Mendoza, Argentina · remote",
      current: true,
      highlights: [
        "Designed, built and run a multi-tenant rental-management SaaS now in production with its first customers (Next.js 15, TypeScript, Supabase/PostgreSQL).",
        "Enforced account isolation with Row Level Security, integrated Mercado Pago with signed, idempotent webhooks, and automated billing with cron jobs and immutable PDF receipts.",
        "Set up CI with type-check, 500+ unit tests, RLS integration tests, Playwright E2E and security gates (secret scanning, dependency audit).",
      ],
    },
    {
      kind: "work",
      role: "WordPress Developer",
      organization: "Dharma Digital Marketing Agency",
      period: "Aug 2024 — Jul 2026",
      location: "Miami, US · remote",
      highlights: [
        "Built and maintained client websites with WordPress, Elementor, custom PHP and CSS/JavaScript, across many client accounts at once.",
        "Delivered landing pages optimized for mobile speed and local SEO for small businesses in the US.",
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
      kind: "work",
      role: "WordPress Developer",
      organization: "NOTAKE",
      period: "Sep 2022 — Jan 2023",
      location: "Mendoza, Argentina · remote",
      highlights: [
        "Built the brand's e-commerce store with WordPress, WooCommerce and custom PHP, including custom product pages.",
      ],
    },
    {
      kind: "education",
      role: "Higher Technician in Software Development",
      organization: "IES 9-021 Tecnológico Junín",
      period: "2024 — present",
      current: true,
      highlights: ["Final (third) year."],
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
      period: "Jul 2025 — presente",
      location: "Mendoza, Argentina · remoto",
      current: true,
      highlights: [
        "Diseñé, construí y mantengo un SaaS multi-tenant de gestión de alquileres, hoy en producción con sus primeros clientes (Next.js 15, TypeScript, Supabase/PostgreSQL).",
        "Aislamiento entre cuentas con Row Level Security, integración con Mercado Pago vía webhooks firmados e idempotentes, facturación automática con cron y recibos PDF inmutables.",
        "CI con type-check, más de 500 tests unitarios, tests de integración de RLS, E2E con Playwright y gates de seguridad (escaneo de secretos, auditoría de dependencias).",
      ],
    },
    {
      kind: "work",
      role: "Desarrollador WordPress",
      organization: "Dharma Digital Marketing Agency",
      period: "Ago 2024 — Jul 2026",
      location: "Miami, EE.UU. · remoto",
      highlights: [
        "Construí y mantuve sitios de clientes con WordPress, Elementor, PHP a medida y CSS/JavaScript, con muchas cuentas de clientes en paralelo.",
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
      kind: "work",
      role: "Desarrollador WordPress",
      organization: "NOTAKE",
      period: "Sep 2022 — Ene 2023",
      location: "Mendoza, Argentina · remoto",
      highlights: [
        "Construí la tienda online de la marca con WordPress, WooCommerce y PHP a medida, con páginas de producto personalizadas.",
      ],
    },
    {
      kind: "education",
      role: "Tecnicatura Superior en Desarrollo de Software",
      organization: "IES 9-021 Tecnológico Junín",
      period: "2024 — presente",
      current: true,
      highlights: ["Cursando el último año (3.º)."],
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

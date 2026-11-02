import type { StaticImageData } from "next/image";
import ADIP_COVER from "@/public/ADIP-home-light.webp";
import FISIOM_COVER from "@/public/fisio-log.webp";

export type Language = "ENG" | "ESP";

export type ProjectLinkKind = "live" | "repo" | "video";

export type ProjectLink = {
  kind: ProjectLinkKind;
  href: string;
  /** Optional label override (e.g. the name of one of several sites). */
  label?: string;
};

type ProjectBase = {
  slug: string;
  featured?: boolean;
  stack: readonly string[];
  links: readonly ProjectLink[];
  cover: StaticImageData | string;
  gallery: readonly string[];
};

export type ProjectCopy = {
  period: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  impact: string;
  /** Optional: the key technical decision behind the project, in a paragraph. */
  decision?: string;
};

export type Project = ProjectBase & ProjectCopy;

// Next's image optimizer is off (see next.config.js), so Cloudinary does the
// work: best format for the browser, automatic quality, at most 1600 px wide.
const CLOUDINARY = "https://res.cloudinary.com/ddtjwx08b/image/upload/f_auto,q_auto,w_1600,c_limit";

const base: readonly ProjectBase[] = [
  {
    slug: "myrent",
    featured: true,
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Supabase",
      "PostgreSQL + RLS",
      "Tailwind CSS",
      "Mercado Pago",
      "Resend",
      "Vitest",
      "Playwright",
      "Vercel",
    ],
    links: [
      { kind: "live", href: "https://myrent.lat" },
      { kind: "repo", href: "https://github.com/ArjonaEnzo/myrent-overview" },
    ],
    cover: "/projects/myrent/myrent-dashboard-light.webp",
    gallery: [
      "/projects/myrent/myrent-dashboard-light.webp",
      "/projects/myrent/myrent-leases-light.webp",
      "/projects/myrent/myrent-receipt-light.webp",
      "/projects/myrent/myrent-payments-light.webp",
      "/projects/myrent/myrent-dashboard-dark.webp",
      "/projects/myrent/myrent-landing-light.webp",
    ],
  },
  {
    slug: "wordpress-sites",
    stack: ["WordPress", "Elementor", "PHP", "CSS", "Local SEO"],
    links: [
      { kind: "live", href: "https://www.omertaconstruction.com/", label: "Omertà Construction" },
      { kind: "live", href: "https://www.glorisalon.com/", label: "Glori Salon" },
    ],
    cover: `${CLOUDINARY}/v1772130206/omerta/Captura-de-pantalla-2026-02-26-123442_f2o9bj.webp`,
    gallery: [
      `${CLOUDINARY}/v1772130206/omerta/Captura-de-pantalla-2026-02-26-123442_f2o9bj.webp`,
      `${CLOUDINARY}/v1772130208/omerta/Captura-de-pantalla-2026-02-26-123630_isdztq.webp`,
      `${CLOUDINARY}/v1772142432/Puppies/Captura_de_pantalla_2026-02-26_182550_q8jdb2.webp`,
      `${CLOUDINARY}/v1772142432/Puppies/Captura_de_pantalla_2026-02-26_182617_zieu3d.webp`,
      `${CLOUDINARY}/v1772155385/Glori/Captura_de_pantalla_2026-02-26_221549_nnjtvn.webp`,
      `${CLOUDINARY}/v1772155384/Glori/Captura_de_pantalla_2026-02-26_221612_lontw6.webp`,
    ],
  },
  // Autos Kbeza is hidden until its pending fixes land (see docs/STATUS.md).
  // To show it again, uncomment this entry; its copy below is kept.
  /* {
    slug: "autos-kbeza",
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "shadcn/ui",
      "LLM API",
      "Zod",
      "Vitest",
      "Vercel",
    ],
    links: [{ kind: "live", href: "https://autos-kbeza.vercel.app" }],
    cover: "/projects/kbeza/kbeza-home.webp",
    gallery: [],
  }, */
  {
    slug: "fisiom-fulness",
    stack: ["Next.js", "Express", "MongoDB", "Mongoose", "Tailwind CSS"],
    links: [],
    cover: FISIOM_COVER,
    gallery: [
      `${CLOUDINARY}/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205543_localhost_l1xbcb.png`,
      `${CLOUDINARY}/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205642_localhost_ql3ady.png`,
      `${CLOUDINARY}/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205746_localhost_ckeqna.png`,
      `${CLOUDINARY}/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205819_localhost_v6bulw.png`,
      `${CLOUDINARY}/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_210046_localhost_nnm4qk.png`,
    ],
  },
  {
    slug: "club-adip",
    stack: [
      "React",
      "TypeScript",
      "Nest.js",
      "PostgreSQL",
      "TypeORM",
      "Material UI",
    ],
    links: [{ kind: "video", href: "https://youtu.be/OWJFsyPq-LQ" }],
    cover: ADIP_COVER,
    gallery: [],
  },
];

const copy: Record<Language, Record<string, ProjectCopy>> = {
  ENG: {
    myrent: {
      period: "2025 — present",
      title: "MyRent",
      tagline: "Rental-management SaaS for landlords in Argentina. In production with its first customers.",
      problem:
        "Landlords and small agencies run rentals on spreadsheets: receipts have legal value and must never change, contracts are re-indexed by ICL/IPC every few months, and payments arrive through cash, transfers and apps with no reconciliation.",
      solution:
        "Multi-tenant platform where every receipt is an immutable snapshot of a real lease, generated as PDF and emailed. Tenants pay online through Mercado Pago and a signed webhook reconciles the payment. A daily cron drafts receipts and reminders. Tenant portal, roles per account, AI assistant and ES/EN UI.",
      impact:
        "Live at myrent.lat with its first customers and in active development. Account isolation enforced with Postgres Row Level Security and covered by 500+ unit tests, 129 RLS tests and Playwright E2E in CI; security advisories found by those tests were fixed before shipping.",
      decision:
        "Account isolation lives in the database, not only in the app. Every business table carries an account_id, and Postgres Row Level Security policies check membership and role (owner, admin, assistant, accountant, viewer) through a SECURITY DEFINER helper on every query, so a bug in a Server Action can't expose another account's data. Because RLS fails silently (a blocked query returns zero rows, not an error), the policies have their own integration suite: it signs in real test users against Supabase and tries to read, change and delete across accounts. It runs in CI next to 500+ unit tests and Playwright E2E.",
    },
    "autos-kbeza": {
      period: "2026",
      title: "Autos Kbeza",
      tagline: "Website, catalog and AI sales assistant for a used-car dealer in Mendoza. Freelance client work.",
      problem:
        "The dealer answered the same questions by hand on WhatsApp all day (price, mileage, trade-ins) and had no online catalog to send buyers to.",
      solution:
        "Dark, brand-first landing page and catalog plus an AI chat assistant that answers with the real inventory. Landing and assistant share one inventory API. Car cards with a 'Me interesa' button open WhatsApp with the car already written. Layered architecture (AI and messaging adapters behind ports) covered by Vitest.",
      impact:
        "Live at autos-kbeza.vercel.app: the assistant filters the actual stock by price, fuel and transmission and sends interested buyers to a salesperson on WhatsApp.",
    },
    "club-adip": {
      period: "2023",
      title: "Club ADIP",
      tagline: "Management platform for a sports club in Buenos Aires.",
      problem:
        "The club handled members, dues, sponsors and announcements by hand, with no single place to see who owed what.",
      solution:
        "Single-page app with an admin panel to publish news and manage members, sponsors and debts, backed by a Nest.js + PostgreSQL API with typed entities.",
      impact:
        "Delivered as the final bootcamp project and extended during a one-month internship with the club. Walkthrough available on video.",
    },
    "fisiom-fulness": {
      period: "2024",
      title: "Fisiom Fulness",
      tagline: "HealthTech marketplace connecting patients, professionals and products.",
      problem:
        "The startup needed a backend that could evolve without losing records, plus a way for staff to manage a product catalog and stock.",
      solution:
        "Designed the data models and REST CRUD for users, professionals and products with soft delete, and built the product-management interface with stock control and checkout flow in Next.js + Tailwind.",
      impact:
        "Four months as full-stack developer; the catalog module shipped to the team's staging environment with full CRUD and image galleries.",
    },
    "wordpress-sites": {
      period: "2024 — 2026",
      title: "Websites for small businesses",
      tagline: "Omertà Construction · Hairy's Puppies World · Glori Salon — built at Dharma Digital Marketing Agency.",
      problem:
        "Local businesses in the US needed sites that load fast on phones, show up in local search and turn visits into calls or bookings.",
      solution:
        "Designed and built each site in WordPress + Elementor with custom CSS: a large image gallery for a construction company, a local-SEO structure for a pet store and a booking-first flow for a beauty salon.",
      impact:
        "Three sites delivered and maintained for the agency's clients, optimized for mobile speed and local SEO.",
    },
  },
  ESP: {
    myrent: {
      period: "2025 — presente",
      title: "MyRent",
      tagline: "SaaS de gestión de alquileres para propietarios en Argentina. En producción con sus primeros clientes.",
      problem:
        "Propietarios e inmobiliarias chicas administran alquileres en planillas: los recibos tienen valor legal y no pueden cambiar, los contratos se ajustan por ICL/IPC cada pocos meses y los pagos llegan por efectivo, transferencia y apps sin conciliación.",
      solution:
        "Plataforma multi-tenant donde cada recibo es un snapshot inmutable de un contrato real, generado en PDF y enviado por email. El inquilino paga online por Mercado Pago y un webhook firmado concilia el pago. Un cron diario genera borradores y recordatorios. Portal del inquilino, roles por cuenta, asistente IA e interfaz ES/EN.",
      impact:
        "En producción en myrent.lat con sus primeros clientes y en desarrollo activo. Aislamiento entre cuentas con Row Level Security de Postgres, cubierto por más de 500 tests unitarios, 129 tests de RLS y E2E con Playwright en CI; las vulnerabilidades que esos tests encontraron se corrigieron antes de salir.",
      decision:
        "El aislamiento entre cuentas vive en la base de datos, no solo en la app. Cada tabla de negocio tiene un account_id y las políticas de Row Level Security de Postgres verifican pertenencia y rol (owner, admin, assistant, accountant, viewer) con un helper SECURITY DEFINER en cada consulta, así que un bug en una Server Action no puede exponer datos de otra cuenta. Como RLS falla en silencio (una consulta bloqueada devuelve cero filas, no un error), las políticas tienen su propia suite de integración: inicia sesión con usuarios de prueba reales contra Supabase e intenta leer, modificar y borrar entre cuentas. Corre en CI junto a más de 500 tests unitarios y E2E con Playwright.",
    },
    "autos-kbeza": {
      period: "2026",
      title: "Autos Kbeza",
      tagline: "Sitio, catálogo y asistente de ventas con IA para una agencia de autos usados de Mendoza. Trabajo freelance para cliente.",
      problem:
        "La agencia respondía a mano por WhatsApp las mismas preguntas todo el día (precio, kilómetros, permutas) y no tenía un catálogo online para mandar a los compradores.",
      solution:
        "Landing oscura con la identidad de la marca, catálogo y un asistente de chat con IA que responde con el inventario real. Landing y asistente comparten una sola API de inventario. Las tarjetas de auto tienen un botón \"Me interesa\" que abre WhatsApp con el auto ya escrito. Arquitectura por capas (adaptadores de IA y mensajería detrás de puertos) cubierta con Vitest.",
      impact:
        "En producción en autos-kbeza.vercel.app: el asistente filtra el stock real por precio, combustible y transmisión y deriva los interesados a un vendedor por WhatsApp.",
    },
    "club-adip": {
      period: "2023",
      title: "Club ADIP",
      tagline: "Plataforma de gestión para un club deportivo de Buenos Aires.",
      problem:
        "El club manejaba socios, cuotas, sponsors y novedades a mano, sin un lugar único para ver quién debía qué.",
      solution:
        "SPA con panel de administración para publicar noticias y gestionar socios, sponsors y deudas, sobre una API Nest.js + PostgreSQL con entidades tipadas.",
      impact:
        "Entregado como proyecto final del bootcamp y extendido en una pasantía de un mes con el club. Recorrido disponible en video.",
    },
    "fisiom-fulness": {
      period: "2024",
      title: "Fisiom Fulness",
      tagline: "Marketplace HealthTech que conecta pacientes, profesionales y productos.",
      problem:
        "La startup necesitaba un backend que evolucionara sin perder registros y una forma de que el staff administrara catálogo y stock.",
      solution:
        "Diseñé los modelos de datos y el CRUD REST de usuarios, profesionales y productos con soft delete, y construí la interfaz de gestión de productos con control de stock y flujo de compra en Next.js + Tailwind.",
      impact:
        "Cuatro meses como desarrollador full-stack; el módulo de catálogo quedó en el staging del equipo con CRUD completo y galerías de imágenes.",
    },
    "wordpress-sites": {
      period: "2024 — 2026",
      title: "Sitios web para pymes",
      tagline: "Omertà Construction · Hairy's Puppies World · Glori Salon — hechos en Dharma Digital Marketing Agency.",
      problem:
        "Negocios locales de Estados Unidos necesitaban sitios que carguen rápido en el celular, aparezcan en búsquedas locales y conviertan visitas en llamadas o reservas.",
      solution:
        "Diseñé y construí cada sitio en WordPress + Elementor con CSS a medida: una galería de imágenes pesada para una constructora, una estructura de SEO local para una tienda de mascotas y un flujo centrado en reservas para un salón de belleza.",
      impact:
        "Tres sitios entregados y mantenidos para clientes de la agencia, optimizados para velocidad en móvil y SEO local.",
    },
  },
};

export function getProjects(language: Language): Project[] {
  return base.map((project) => ({ ...project, ...copy[language][project.slug] }));
}

export const linkLabels: Record<Language, Record<ProjectLinkKind, string>> = {
  ENG: { live: "Live site", repo: "Repository", video: "Watch demo" },
  ESP: { live: "Ver sitio", repo: "Repositorio", video: "Ver demo" },
};

export const projectLabels: Record<
  Language,
  { problem: string; solution: string; impact: string; decision: string; gallery: string; closeGallery: string; viewGallery: string }
> = {
  ENG: {
    problem: "Problem",
    solution: "What I built",
    impact: "Result",
    decision: "Key technical decision",
    gallery: "Gallery",
    closeGallery: "Close gallery",
    viewGallery: "View gallery",
  },
  ESP: {
    problem: "Problema",
    solution: "Qué construí",
    impact: "Resultado",
    decision: "Decisión técnica clave",
    gallery: "Galería",
    closeGallery: "Cerrar galería",
    viewGallery: "Ver galería",
  },
};

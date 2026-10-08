import type { StaticImageData } from "next/image";
import ADIP_COVER from "@/public/ADIP-home-light.png";
import FISIOM_COVER from "@/public/fisio-log.png";

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
};

export type Project = ProjectBase & ProjectCopy;

const CLOUDINARY = "https://res.cloudinary.com/ddtjwx08b/image/upload";

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
    slug: "wordpress-sites",
    stack: ["WordPress", "Elementor", "PHP", "CSS", "Local SEO"],
    // TODO(enzo): add the public URL of each site as { kind: "live", href, label }.
    links: [],
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
];

const copy: Record<Language, Record<string, ProjectCopy>> = {
  ENG: {
    myrent: {
      period: "2026 — present",
      title: "MyRent",
      tagline: "Rental-management SaaS for landlords in Argentina. In production with real customers.",
      problem:
        "Landlords and small agencies run rentals on spreadsheets: receipts have legal value and must never change, contracts are re-indexed by ICL/IPC every few months, and payments arrive through cash, transfers and apps with no reconciliation.",
      solution:
        "Multi-tenant platform where every receipt is an immutable snapshot of a real lease, generated as PDF and emailed. Tenants pay online through Mercado Pago and a signed webhook reconciles the payment. A daily cron drafts receipts and reminders. Tenant portal, roles per account, AI assistant and ES/EN UI.",
      impact:
        "Live at myrent.lat with paying customers. Account isolation enforced with Postgres Row Level Security and covered by 500+ unit tests, 129 RLS tests and Playwright E2E in CI; security advisories found by those tests were fixed before shipping.",
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
      period: "2024 — present",
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
      period: "2026 — presente",
      title: "MyRent",
      tagline: "SaaS de gestión de alquileres para propietarios en Argentina. En producción con clientes reales.",
      problem:
        "Propietarios e inmobiliarias chicas administran alquileres en planillas: los recibos tienen valor legal y no pueden cambiar, los contratos se ajustan por ICL/IPC cada pocos meses y los pagos llegan por efectivo, transferencia y apps sin conciliación.",
      solution:
        "Plataforma multi-tenant donde cada recibo es un snapshot inmutable de un contrato real, generado en PDF y enviado por email. El inquilino paga online por Mercado Pago y un webhook firmado concilia el pago. Un cron diario genera borradores y recordatorios. Portal del inquilino, roles por cuenta, asistente IA e interfaz ES/EN.",
      impact:
        "En producción en myrent.lat con clientes que pagan. Aislamiento entre cuentas con Row Level Security de Postgres, cubierto por más de 500 tests unitarios, 129 tests de RLS y E2E con Playwright en CI; las vulnerabilidades que esos tests encontraron se corrigieron antes de salir.",
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
      period: "2024 — presente",
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
  { problem: string; solution: string; impact: string; gallery: string; closeGallery: string; viewGallery: string }
> = {
  ENG: {
    problem: "Problem",
    solution: "What I built",
    impact: "Result",
    gallery: "Gallery",
    closeGallery: "Close gallery",
    viewGallery: "View gallery",
  },
  ESP: {
    problem: "Problema",
    solution: "Qué construí",
    impact: "Resultado",
    gallery: "Galería",
    closeGallery: "Cerrar galería",
    viewGallery: "Ver galería",
  },
};

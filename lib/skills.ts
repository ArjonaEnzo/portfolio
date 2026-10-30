import type { IconType } from "react-icons";
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiSupabase,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiZod,
  SiNestjs,
  SiExpress,
  SiMongodb,
  SiMercadopago,
  SiVercel,
  SiGithubactions,
  SiGit,
  SiVitest,
  SiTestinglibrary,
  SiPlaywright,
  SiEslint,
  SiSentry,
  SiPosthog,
  SiWordpress,
  SiElementor,
  SiRedux,
  SiMui,
  SiDocker,
  SiPhp,
  SiWoocommerce,
} from "react-icons/si";
import { TbBrandFramerMotion, TbShieldLock, TbMail } from "react-icons/tb";
import type { Language } from "./projects";

export type Skill = { name: string; icon?: IconType };

export type SkillGroup = {
  id: "core" | "backend" | "quality" | "more";
  skills: readonly Skill[];
};

export const skillGroupLabels: Record<
  Language,
  Record<SkillGroup["id"], string>
> = {
  ENG: {
    core: "Core stack",
    backend: "Backend, data & infrastructure",
    quality: "Testing & quality",
    more: "Also comfortable with",
  },
  ESP: {
    core: "Stack principal",
    backend: "Backend, datos e infraestructura",
    quality: "Testing y calidad",
    more: "También trabajo con",
  },
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "core",
    skills: [
      { name: "TypeScript", icon: SiTypescript },
      { name: "JavaScript", icon: SiJavascript },
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Supabase", icon: SiSupabase },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "WordPress", icon: SiWordpress },
      { name: "PHP", icon: SiPhp },
      { name: "WooCommerce", icon: SiWoocommerce },
    ],
  },
  {
    id: "backend",
    skills: [
      { name: "Row Level Security", icon: TbShieldLock },
      { name: "Zod", icon: SiZod },
      { name: "REST APIs" },
      { name: "Nest.js", icon: SiNestjs },
      { name: "Express", icon: SiExpress },
      { name: "MongoDB", icon: SiMongodb },
      { name: "Mercado Pago", icon: SiMercadopago },
      { name: "Vercel AI SDK" },
      { name: "Resend", icon: TbMail },
      { name: "Vercel", icon: SiVercel },
      { name: "GitHub Actions", icon: SiGithubactions },
      { name: "Docker", icon: SiDocker },
      { name: "Git", icon: SiGit },
    ],
  },
  {
    id: "quality",
    skills: [
      { name: "Vitest", icon: SiVitest },
      { name: "Testing Library", icon: SiTestinglibrary },
      { name: "Playwright", icon: SiPlaywright },
      { name: "ESLint", icon: SiEslint },
      { name: "Sentry", icon: SiSentry },
      { name: "PostHog", icon: SiPosthog },
    ],
  },
  {
    id: "more",
    skills: [
      { name: "Elementor", icon: SiElementor },
      { name: "Gutenberg" },
      { name: "HTML", icon: SiHtml5 },
      { name: "CSS", icon: SiCss3 },
      { name: "Framer Motion", icon: TbBrandFramerMotion },
      { name: "Redux", icon: SiRedux },
      { name: "Material UI", icon: SiMui },
    ],
  },
];

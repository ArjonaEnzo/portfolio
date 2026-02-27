import type { IconType } from "react-icons";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiGit,
  SiRedux,
  SiExpress,
  SiSequelize,
  SiPostgresql,
  SiNestjs,
  SiMui,
} from "react-icons/si";
import { FaDatabase } from "react-icons/fa";
import { TbBrandFramerMotion } from "react-icons/tb";

export const skillIcons: Record<string, IconType> = {
  HTML: SiHtml5,
  CSS: SiCss3,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Node.js": SiNodedotjs,
  Git: SiGit,
  Redux: SiRedux,
  Express: SiExpress,
  Sequelize: SiSequelize,
  TypeORM: FaDatabase,
  PostgreSQL: SiPostgresql,
  "Nest.js": SiNestjs,
  "Material UI": SiMui,
  "Framer Motion": TbBrandFramerMotion,
};

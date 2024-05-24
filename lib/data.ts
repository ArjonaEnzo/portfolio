import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import { StaticImageData } from "next/image";
import ADIP from "@/public/ADIP-home-light.png";
import PROX from "@/public/asdasd.png";
import FISIO from "@/public/fisio-log.png";
interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl: StaticImageData;
  linkTo?: string;
  images: string[];
}

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const linksESP = [
  {
    name: "Início",
    hash: "#home",
  },
  {
    name: "Sobre mi",
    hash: "#about",
  },
  {
    name: "Proyectos",
    hash: "#projects",
  },
  {
    name: "Habilidades",
    hash: "#skills",
  },
  {
    name: "Experiencia",
    hash: "#experience",
  },
  {
    name: "Contacto",
    hash: "#contact",
  },
] as const;

export const projectsData: Project[] = [
  {
    title: "Club ADIP",
    description:
      "I worked as a full-stack developer on this project. Admins can post notices and control various features, including users, sponsors, debts, and many more.",
    tags: [
      "React",
      "Nest.js",
      "PostgreSQL",
      "Email.js",
      "TypeScript",
      "Material UI",
    ],
    imageUrl: ADIP,
    linkTo: "https://youtu.be/OWJFsyPq-LQ?si=o3h9NrvSb8rnA3ir",
    images: [],
  },
  {
    title: "Fisiom Fulness | HealthTech and Wellness",
    description:
      "In my role as a Full Stack Developer, I worked on the Backend, designing tables, relationships, and CRUD operations for users, professionals, and products. I implemented a soft delete to maintain records in the database, using MongoDB, Express, and Node.js for enhanced security and efficiency. On the Frontend, I developed the user interface to create products, manage their stock, and facilitate their sale. I used Tailwind CSS and Next.js to create an attractive and user-friendly interface, improving the user experience and the stock renewal process.",
    tags: ["Next.js", "MongoDB", "Express.js", "Mongoose", "TailwindCSS"],
    imageUrl: FISIO,
    images: [
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205543_localhost_l1xbcb.png",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205642_localhost_ql3ady.png",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205746_localhost_ckeqna.png",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205819_localhost_v6bulw.png",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_210046_localhost_nnm4qk.png",
    ],
  },
  {
    title: "Coming soon...",
    description:
      "I am very excited to have the opportunity to showcase my talent, and I will keep working to achieve it, so you will see new projects here frequently :).",
    tags: ["I", "will", "never", "stop", "learning", "and", "coding"],
    imageUrl: PROX,
    linkTo: "",
    images: [],
  },
];
export const projectsDataEsp: Project[] = [
  {
    title: "Club ADIP",
    description:
      "Trabajé como desarrollador full stack en este proyecto. Los admins puedes controlar: noticias, usuarios, sponsors, deudas y muchisimas otras características.",
    tags: [
      "React",
      "Nest.js",
      "PostgreSQL",
      "Email.js",
      "TypeScript",
      "Material UI",
    ],
    imageUrl: ADIP,
    linkTo: "https://youtu.be/OWJFsyPq-LQ?si=o3h9NrvSb8rnA3ir",
    images: [],
  },
  {
    title: "Fisiom Fulness | Salud y Bienestar",
    description:
      "En mi puesto de Full Stack Developer, trabajé en el Backend, diseñando tablas, relaciones y CRUD para usuarios ",
    tags: ["Next.js", "MongoDB", "Express.js", "Mongoose", "TailwindCSS"],
    imageUrl: FISIO,
    images: [
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205543_localhost_l1xbcb.png",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205642_localhost_ql3ady.png",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205746_localhost_ckeqna.png",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_205819_localhost_v6bulw.png",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1716339931/fisiom/Opera_Instant%C3%A1nea_2024-05-21_210046_localhost_nnm4qk.png",
    ],
  },
  {
    title: "Muy pronto...",
    description:
      "Estoy muy ansioso por tener la oportunidad de demostrar mi talento y seguiré trabajando para conseguirla, por lo tanto, verás nuevos proyectos aquí con frecuencia :).",
    tags: ["Jamás", "dejaré", "de", "aprender", "y", "programar"],
    imageUrl: PROX,
    linkTo: "",
    images: [],
  },
];
export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Git",
  "Redux",
  "Express",
  "Sequelize",
  "TypeORM",
  "PostgreSQL",
  "Nest.js",
  "Material UI",
  "Framer Motion",
] as const;

export const experiencesData = [
  {
    title: "Graduated bootcamp (HENRY)",
    description:
      "I graduated after 4 months of studying. In the final project, I worked for Club ADIP.",
    icon: React.createElement(LuGraduationCap),
    date: "JUN. 2023 | SEPT. 2023",
  },
  {
    title: "Full Stack Developer (intern)",
    description:
      "I worked as a full stack developer for 1 month to develop a SPA for Club ADIP, which is located in Buenos Aires.",
    icon: React.createElement(CgWorkAlt),
    date: "AUG. 2023 | SEPT. 2023",
  },
  {
    title: "Coming soon...",
    description:
      "I'll keep getting experience by working as a freelancer and making personal projects.",
    icon: React.createElement(FaReact),
    date: "SEPT. 2023 | Forever",
  },
] as const;

export const experiencesDataEsp = [
  {
    title: "Graduado del Bootcamp HENRY",
    description:
      "Me gradué después de 4 meses de estudio. En el proyecto final, trabajé para Club ADIP.",
    icon: React.createElement(LuGraduationCap),
    date: "JUN. 2023 | SEPT. 2023",
  },
  {
    title: "Desarrollador Full Stack (pasante)",
    description:
      "Trabajé como desarrollador full stack durante 1 mes para desarrollar una Aplicación de Página Única (SPA) para el Club ADIP, ubicado en Buenos Aires.",
    icon: React.createElement(CgWorkAlt),
    date: "AGO. 2023 | SEPT. 2023",
  },
  {
    title: "Muy pronto...",
    description:
      "Seguiré obteniendo experiencia trabajando como freelancer y en proyectos personales.",
    icon: React.createElement(FaReact),
    date: "SEPT. 2023 | Indefinido",
  },
] as const;

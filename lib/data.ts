import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import { StaticImageData } from "next/image";
import ADIP from "@/public/ADIP-home-light.png";
import FISIO from "@/public/fisio-log.png";
interface Project {
  title: string;
  description: string;
  tags: readonly string[];
  imageUrl: StaticImageData | string;
  linkTo?: string;
  images: readonly string[];
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
      "As a Full Stack Developer, I designed tables, relationships, CRUD, implemented soft delete, and developed an interface to manage products.",
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
    title: "Omertà Construction",
    description:
      "Corporate website for a Florida construction company. Designed to showcase their portfolio and services with a high-end UI. The main challenge was organizing a massive image gallery without sacrificing mobile speed.",
    tags: ["WordPress", "Elementor", "PHP", "CSS"],
    // Tu imagen principal del Hero (idealmente con el marco de Shots.so)
    imageUrl:
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130206/omerta/Captura-de-pantalla-2026-02-26-123442_f2o9bj.webp",
    // Capturas adicionales de secciones clave (servicios, galería de proyectos, versión móvil)
    images: [
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130206/omerta/Captura-de-pantalla-2026-02-26-123442_f2o9bj.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130208/omerta/Captura-de-pantalla-2026-02-26-123630_isdztq.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130209/omerta/Captura-de-pantalla-2026-02-26-123644_kusj0p.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130206/omerta/Captura-de-pantalla-2026-02-26-123824_tvmgqt.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130207/omerta/Captura-de-pantalla-2026-02-26-123903_iz0jxh.webp",
    ],
  },
  {
    title: "Hairy's Puppies World",
    description:
      "Local SEO-optimized site for a premium pet store. Built to improve online visibility and showcase services. I focused on creating an intuitive user journey to boost physical store visits.",
    tags: ["WordPress", "Elementor", "SEO", "CSS"],
    // Tu imagen principal del Hero pasada por Shots.so
    imageUrl:
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142432/Puppies/Captura_de_pantalla_2026-02-26_182550_q8jdb2.webp",
    // Capturas adicionales
    images: [
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142432/Puppies/Captura_de_pantalla_2026-02-26_182550_q8jdb2.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142432/Puppies/Captura_de_pantalla_2026-02-26_182617_zieu3d.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142431/Puppies/Captura_de_pantalla_2026-02-26_182633_ydo5vm.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142431/Puppies/Captura_de_pantalla_2026-02-26_182650_t5onsv.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142431/Puppies/Captura_de_pantalla_2026-02-26_182707_rhho5w.webp",
    ],
  },
  {
    title: "Glori Salon",
    description:
      "Corporate website and local SEO strategy for a premium beauty salon. I optimized the booking flow and image delivery to ensure a smooth, high-converting experience for mobile users.",
    tags: ["WordPress", "Elementor", "SEO", "CSS"],
    // Tu imagen principal del Hero pasada por Shots.so
    imageUrl:
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155385/Glori/Captura_de_pantalla_2026-02-26_221549_nnjtvn.webp",
    // Capturas adicionales
    images: [
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155385/Glori/Captura_de_pantalla_2026-02-26_221549_nnjtvn.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155384/Glori/Captura_de_pantalla_2026-02-26_221612_lontw6.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155365/Glori/Captura_de_pantalla_2026-02-26_221639_ibxdui.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155357/Glori/Captura_de_pantalla_2026-02-26_221709_qmcio6.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155357/Glori/Captura_de_pantalla_2026-02-26_221724_dhbb7c.webp",
    ],
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
      "Como Full Stack Developer, diseñé tablas, relaciones, CRUD, implementé soft delete y desarrollé una interfaz para gestionar productos...",
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
    title: "Omertà Construction",
    description:
      "Sitio corporativo para una constructora en Florida. Diseñado para exhibir su portafolio con una UI de alta gama. El desafío fue organizar una galería masiva de imágenes sin perder velocidad en móviles.",
    tags: ["WordPress", "Elementor", "PHP", "CSS"],
    imageUrl:
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130206/omerta/Captura-de-pantalla-2026-02-26-123442_f2o9bj.webp",
    // Capturas adicionales de secciones clave (servicios, galería de proyectos, versión móvil)
    images: [
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130206/omerta/Captura-de-pantalla-2026-02-26-123442_f2o9bj.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130208/omerta/Captura-de-pantalla-2026-02-26-123630_isdztq.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130209/omerta/Captura-de-pantalla-2026-02-26-123644_kusj0p.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130206/omerta/Captura-de-pantalla-2026-02-26-123824_tvmgqt.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772130207/omerta/Captura-de-pantalla-2026-02-26-123903_iz0jxh.webp",
    ],
  },
  {
    title: "Hairy's Puppies World",
    description:
      "Sitio con SEO local para una tienda de mascotas premium. Creado para mejorar la visibilidad y exhibir servicios. Me enfoqué en crear un flujo intuitivo para aumentar las visitas al local físico.",
    tags: ["WordPress", "Elementor", "SEO", "CSS"],
    // Usa las mismas rutas de Cloudinary que arriba
    imageUrl:
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142432/Puppies/Captura_de_pantalla_2026-02-26_182550_q8jdb2.webp",
    // Capturas adicionales
    images: [
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142432/Puppies/Captura_de_pantalla_2026-02-26_182550_q8jdb2.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142432/Puppies/Captura_de_pantalla_2026-02-26_182617_zieu3d.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142431/Puppies/Captura_de_pantalla_2026-02-26_182633_ydo5vm.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142431/Puppies/Captura_de_pantalla_2026-02-26_182650_t5onsv.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772142431/Puppies/Captura_de_pantalla_2026-02-26_182707_rhho5w.webp",
    ],
  },
  {
    title: "Glori Salon",
    description:
      "Sitio web y estrategia de SEO local para un salón de belleza. Optimicé el flujo de reservas y la carga de imágenes para asegurar una experiencia fluida y de alta conversión en celulares.",
    tags: ["WordPress", "Elementor", "SEO", "CSS"],
    // Usa las mismas rutas de Cloudinary que arriba
    imageUrl:
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155385/Glori/Captura_de_pantalla_2026-02-26_221549_nnjtvn.webp",
    // Capturas adicionales
    images: [
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155385/Glori/Captura_de_pantalla_2026-02-26_221549_nnjtvn.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155384/Glori/Captura_de_pantalla_2026-02-26_221612_lontw6.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155365/Glori/Captura_de_pantalla_2026-02-26_221639_ibxdui.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155357/Glori/Captura_de_pantalla_2026-02-26_221709_qmcio6.webp",
      "https://res.cloudinary.com/ddtjwx08b/image/upload/v1772155357/Glori/Captura_de_pantalla_2026-02-26_221724_dhbb7c.webp",
    ],
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
  "Tailwind CSS",
  "Bootstrap",
  "WordPress",
  "Elementor",
  "WooCommerce",
  "Git",
  "Redux",
  "Express",
  "Nest.js",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Framer Motion",
] as const;

export const experiencesData = [
  {
    title: "Technician in Electromechanical and Industrial Installations",
    location: "José de San Martín 4-120 Technical School",
    description:
      "Graduated with a strong technical foundation, developing analytical and problem-solving skills that paved the way for my programming career.",
    icon: React.createElement(LuGraduationCap),
    date: "2013 - 2018",
  },
  {
    title: "Full Stack Developer",
    location: "NO TAKE",
    description:
      "Developed an e-commerce platform using WordPress and WooCommerce.",
    icon: React.createElement(CgWorkAlt),
    date: "SEPT. 2022 - JAN. 2023",
  },
  {
    title: "Full Stack Developer Bootcamp",
    location: "Henry",
    description:
      "Graduated from an intensive +800-hour bootcamp in Full Stack Development. Built robust applications learning agile methodologies and teamwork.",
    icon: React.createElement(LuGraduationCap),
    date: "JUN. 2023 - SEPT. 2023",
  },
  {
    title: "Frontend Developer",
    location: "ADIP CLUB",
    description:
      "Worked on creating a Single Page Application (SPA) using React.js.",
    icon: React.createElement(CgWorkAlt),
    date: "AUG. 2023 - SEPT. 2023",
  },
  {
    title: "Full Stack Developer",
    location: "Fisiom Fulness",
    description:
      "Developed user interfaces and functionalities using Tailwind CSS and Next.js.",
    icon: React.createElement(CgWorkAlt),
    date: "FEB. 2024 - MAY. 2024",
  },
  {
    title: "Software Developer (Higher Technician)",
    location: "Instituto de Educación Superior 9-021 Tecnológico Junín",
    description:
      "Currently in my 3rd year studying to become a Software Developer.",
    icon: React.createElement(LuGraduationCap),
    date: "MAR. 2024 - Present",
  },
  {
    title: "WordPress Developer",
    location: "Dharma Digital Marketing Agency",
    description:
      "Developing and maintaining websites using HTML, CSS, JavaScript, and WordPress. Collaborating in creating landing pages using Elementor, managing CMS tasks, and implementing responsive designs.",
    icon: React.createElement(CgWorkAlt),
    date: "AUG. 2024 - Present",
  },
] as const;

export const experiencesDataEsp = [
  {
    title: "Técnico en Instalaciones Electromecánicas e Industriales",
    location: "Escuela Técnica José de San Martín 4-120",
    description:
      "Me gradué con una sólida base técnica, desarrollando habilidades analíticas y de resolución de problemas que abrieron el camino para mi carrera en programación.",
    icon: React.createElement(LuGraduationCap),
    date: "2013 - 2018",
  },
  {
    title: "Desarrollador Full Stack",
    location: "NO TAKE",
    description:
      "Desarrollé una plataforma de comercio electrónico utilizando WordPress y WooCommerce.",
    icon: React.createElement(CgWorkAlt),
    date: "SEPT. 2022 - ENE. 2023",
  },
  {
    title: "Bootcamp de Desarrollador Full Stack",
    location: "Henry",
    description:
      "Egresado de un bootcamp intensivo de más de 800 horas. Desarrollé aplicaciones robustas aprendiendo metodologías ágiles y trabajo en equipo.",
    icon: React.createElement(LuGraduationCap),
    date: "JUN. 2023 - SEPT. 2023",
  },
  {
    title: "Desarrollador Frontend",
    location: "ADIP CLUB",
    description:
      "Trabajé en la creación de una Aplicación de Página Única (SPA) utilizando React.js.",
    icon: React.createElement(CgWorkAlt),
    date: "AGO. 2023 - SEPT. 2023",
  },
  {
    title: "Desarrollador Full Stack",
    location: "Fisiom Fulness",
    description:
      "Desarrollé interfaces de usuario y funcionalidades utilizando Tailwind CSS y Next.js.",
    icon: React.createElement(CgWorkAlt),
    date: "FEB. 2024 - MAY. 2024",
  },
  {
    title: "Desarrollador de Software (Técnico Superior)",
    location: "Instituto de Educación Superior 9-021 Tecnológico Junín",
    description:
      "Actualmente cursando el tercer año de la carrera de Desarrollo de Software.",
    icon: React.createElement(LuGraduationCap),
    date: "MAR. 2024 - Presente",
  },
  {
    title: "Desarrollador WordPress",
    location: "Dharma Digital Marketing Agency",
    description:
      "Desarrollo y mantenimiento de sitios web utilizando HTML, CSS, JavaScript y WordPress. Colaboro en la creación de landing pages usando Elementor, gestionando tareas del CMS y aplicando diseños responsivos.",
    icon: React.createElement(CgWorkAlt),
    date: "AGO. 2024 - Presente",
  },
] as const;

import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";

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
    name: "Inicio",
    hash: "#home",
  },
  {
    name: "Sobre mí",
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

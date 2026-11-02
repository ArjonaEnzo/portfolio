import type { Language } from "@/lib/projects";
import type { StationId } from "./stations";

// UI strings of the /desk experience. Portfolio content itself (projects,
// experience, skills, site info) comes from lib/ so both versions stay in sync.
export const deskCopy: Record<
  Language,
  {
    stations: Record<Exclude<StationId, "home">, string>;
    back: string;
    backShort: string;
    classic: string;
    classicShort: string;
    classicLong: string;
    skip3d: string;
    boot: { role: string; status: string; resume: string };
    dragHint: string;
    toDay: string;
    toNight: string;
    arcade: string;
    enter: string;
    loading: string;
    ready: string;
    noWebgl: string;
    sceneLabel: string;
    tabs: { profile: string; projects: string; stack: string };
    profile: { role: string; based: string; building: string; since: string; focus: string; projects: string };
    profileValues: { building: string; since: string; focus: string; projects: (n: number) => string };
    experience: { work: string; education: string; prev: string; next: string };
    contact: { title: string; local: string; cv: string; cvLabel: string };
    about: { title: string; paragraphs: readonly string[] };
  }
> = {
  ESP: {
    stations: {
      projects: "Proyectos",
      experience: "Experiencia",
      about: "Sobre mí",
      contact: "Contacto",
    },
    back: "Volver al cuarto",
    backShort: "Volver",
    classic: "Versión clásica",
    classicShort: "Clásica",
    classicLong: "Ver la versión clásica del portfolio",
    skip3d: "¿Sin 3D? Versión clásica",
    boot: { role: "Desarrollador Full-Stack", status: "abierto a remoto · Mendoza (UTC-3)", resume: "CV" },
    dragHint: "Arrastrá para mirar · tocá un objeto",
    toDay: "Cambiar a modo día",
    toNight: "Cambiar a modo noche",
    arcade: "Abrir la versión Warcraft",
    enter: "Entrar",
    loading: "Cargando el cuarto",
    ready: "Listo",
    noWebgl: "Tu navegador no tiene WebGL, así que el cuarto 3D no puede cargar.",
    sceneLabel:
      "El escritorio de Enzo en 3D: arrastrá para mirar y abrí cada sección desde el menú o tocando su objeto.",
    tabs: { profile: "Perfil", projects: "Proyectos", stack: "Stack" },
    profile: {
      role: "rol",
      based: "base",
      building: "construye",
      since: "desde",
      focus: "foco",
      projects: "proyectos",
    },
    profileValues: {
      building: "MyRent, SaaS en producción",
      since: "2022, para clientes y agencias",
      focus: "código tipado, RLS, tests y CI",
      projects: (n) => `${n}, abrí la pestaña Proyectos`,
    },
    experience: { work: "Trabajo", education: "Formación", prev: "Anterior", next: "Siguiente" },
    contact: { title: "Contacto", local: "Mendoza", cv: "cv.pdf", cvLabel: "Descargar CV" },
    about: {
      title: "Sobre mí",
      paragraphs: [
        "Soy desarrollador full-stack de Mendoza, Argentina. Arranqué en una escuela técnica, me formé en el bootcamp de Henry y hoy estoy terminando la tecnicatura en desarrollo de software.",
        "Desde 2022 trabajo para clientes y agencias, y construí y lancé MyRent, un SaaS de gestión de alquileres que ya está en producción con sus primeros clientes.",
        "Me importa lo que hace confiable al software: código tipado, seguridad a nivel de base de datos, tests automatizados con CI y manejo claro de errores.",
        "Lejos del teclado me vas a encontrar entrenando, compartiendo unos mates o metiéndole a algún proyecto nuevo.",
      ],
    },
  },
  ENG: {
    stations: {
      projects: "Projects",
      experience: "Experience",
      about: "About",
      contact: "Contact",
    },
    back: "Back to the room",
    backShort: "Back",
    classic: "Classic version",
    classicShort: "Classic",
    classicLong: "Open the classic version of the portfolio",
    skip3d: "No 3D? Classic version",
    boot: { role: "Full-Stack Developer", status: "open to remote · Mendoza (UTC-3)", resume: "Resume" },
    dragHint: "Drag to look around · tap an object",
    toDay: "Switch to day mode",
    toNight: "Switch to night mode",
    arcade: "Open the Warcraft version",
    enter: "Enter",
    loading: "Loading the room",
    ready: "Ready",
    noWebgl: "Your browser doesn't support WebGL, so the 3D room can't load.",
    sceneLabel:
      "Enzo's desk in 3D: drag to look around and open each section from the menu or by tapping its object.",
    tabs: { profile: "Profile", projects: "Projects", stack: "Stack" },
    profile: {
      role: "role",
      based: "based",
      building: "building",
      since: "since",
      focus: "focus",
      projects: "projects",
    },
    profileValues: {
      building: "MyRent, a SaaS in production",
      since: "2022, for clients and agencies",
      focus: "typed code, RLS, tests and CI",
      projects: (n) => `${n}, open the Projects tab`,
    },
    experience: { work: "Work", education: "Education", prev: "Previous", next: "Next" },
    contact: { title: "Contact", local: "Mendoza", cv: "cv.pdf", cvLabel: "Download my resume" },
    about: {
      title: "About me",
      paragraphs: [
        "I'm a full-stack developer from Mendoza, Argentina. I started at a technical high school, trained at the Henry bootcamp and am now finishing a degree in software development.",
        "Since 2022 I've shipped work for clients and agencies, and I built and launched MyRent, a rental-management SaaS now live with its first customers.",
        "I care about the parts that make software trustworthy: typed code, database-level security, automated tests and CI, and clear error handling.",
        "Off the keyboard you'll find me training, sharing a mate or poking at a new side project.",
      ],
    },
  },
};

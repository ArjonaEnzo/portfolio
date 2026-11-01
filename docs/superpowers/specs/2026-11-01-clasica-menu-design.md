# Classic version as a one-screen menu: design

Date: 2026-11-01. Approved by Enzo: direction A ("Kakejiku editorial") with a switch to B ("Producto sólido"), implement everything.

## Intent

- The 3D room becomes the home page.
- The classic version stops being a long scrolling page. It becomes the idea of the old Warcraft-style `/menu`: one screen and no page scroll. Picking a section pulls the current panel up and drops the next one with a short spring.
- It has to look serious: recruiters and clients should trust it and get in touch. Game styling is out: no chains, stone, gold, medieval type or sounds.

## Decisions

- **Routes**
  - `/` serves the 3D room.
  - `/clasica` serves the new classic page.
  - `/desk` redirects permanently (308) to `/`.
  - `/menu` and `/wc3` stay local and uncommitted.
- **A/B switch is the theme switch**
  - Light = A "Papel": washi paper, sumi ink, Shippori Mincho titles, sheets hanging from two thin cords with a dark rod top and bottom, one red hanko seal.
  - Dark = B "Grafito": near-black, subtle grid, solid bordered panels, Inter titles, keyboard hints.
  - The switch persists in `localStorage("theme")` and follows `prefers-color-scheme` on first visit, as before. An inline script sets the class before paint to avoid a flash.
- **Tokens** (from the research in `docs/INFORME-CLASICA-MENU-2026-11-01.md`)
  - A: wall `#EBE8E1`, sheet `#F7F5F0`, ink `#1C1A19`, accent `#8B5CF6`, hanko `#D9382E`.
  - B: bg `#0A0A0C`, side `#0F0F12`, panel `#16161A`, border `#27272A`, text `#F8FAFC`, muted `#94A3B8`, accent `#8B5CF6`/`#A78BFA`.
- **Motion**
  - The old panel leaves with `y: -115%` in about 0.3 s (ease-in).
  - The new panel drops from `-110%`. A uses spring k240/d22; B uses k300/d30/m0.8.
  - Content inside the panel staggers by 50 ms.
  - `prefers-reduced-motion`: opacity only.
- **Navigation**
  - Sidebar with numbered sections 01–05. On phones, a bottom tab bar.
  - Keys 1–5 open sections and Esc goes back to Perfil.
  - The URL hash follows the section (`/clasica#proyectos`); back and forward work through `pushState` + `popstate`.
- **Content**
  - Same data as before (`lib/projects.ts`, `lib/experience.ts`, `lib/skills.ts`, `lib/site.ts`), plus the About copy.
  - All panels are server-rendered. Inactive ones use `hidden="until-found"`, so Ctrl+F and crawlers still reach the text; a `beforematch` opens the matching panel.
- **Layout**
  - Strict `100dvh` with `overscroll-behavior: none`.
  - Long panels scroll inside the sheet.
- **Contact**
  - Same Server Action (`actions/sendEmail.ts`) and toasts.
- **Clean-up**
  - Remove the old scrolling-page components and their now unused dependencies (`swiper`, `react-intersection-observer`).
- **Metadata**
  - One language per field (my call: Spanish, matching `lang="es"` and the default language).
  - `/clasica` gets its own canonical.
  - The sitemap lists `/` and `/clasica`.

## Left to the builder

Exact spacing and type sizes, the hover details, and the copy of short labels.

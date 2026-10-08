# STATUS — portfolio (enzo-arjona.vercel.app)

> Estado vivo del proyecto. Leer al abrir una sesión, actualizar al cerrar. Fechas absolutas.

**Última actualización:** 2026-10-08

## 👉 AHORA

Rework completo hecho en `main` local (12 commits sobre `origin/main`, **sin pushear**). Build, type-check, lint verdes; Lighthouse mobile local: a11y 100 · SEO 100 · best practices 96 (el único fallo es el 400 de `next/image` por capturas de MyRent aún ausentes).

**EL próximo paso:** Enzo revisa en local (`npm run build && npm run start`) y da OK → `git push origin main` → Vercel deploya. Antes del push conviene que estén en `public/` el CV (`cv-enzo-arjona.pdf`) y las capturas de MyRent (`public/projects/myrent/*.webp`), si no el botón CV y la card de MyRent muestran 404 en imagen/PDF.

## Tareas de Enzo

- [ ] Dejar `public/cv-enzo-arjona.pdf` (el botón "Descargar CV" ya apunta ahí).
- [ ] Pasar las URLs públicas de Omertà Construction / Hairy's Puppies World / Glori Salon → van en `lib/projects.ts` (`wordpress-sites.links`, hay un `TODO(enzo)`).
- [ ] Revisar el copy nuevo (hero, about, proyectos, experiencia) y corregir datos que no sean exactos (fechas, nombres de instituciones, descripciones de Dharma).
- [ ] OK para push/deploy.
- [ ] (Opcional) Vercel: renombrar env `RESENT_API_KEY` → `RESEND_API_KEY`; el código acepta ambas.
- [ ] (Opcional) GitHub: bio del perfil + description del repo `portfolio` + README de perfil con pins (MyRent overview, portfolio).

## Hecho (2026-10-07 → 2026-10-08)

Auditoría en `docs/AUDITORIA-2026-10-07.md`, plan en `docs/PLAN-2026-10-08.md`. Commits en orden:

1. `chore: clean repository assets and metadata` — imágenes basura, deps muertas, README real, `.env.example`.
2. `refactor: fix component file names, hook casing and typos` — `*-switch`, `useSectionInView`, `Inicio`, env var con fallback.
3. `fix(a11y)` — aria-labels, botones reales para los switches, contraste.
4. `feat(seo)` — metadata completa, OG image dinámica, robots, sitemap, JSON-LD, `<html lang>` reactivo.
5. `content: rewrite hero and about` — posicionamiento "Full-Stack Developer · Next.js, TypeScript, PostgreSQL", botón CV.
6. `feat(projects)` — `lib/projects.ts` (problema / qué construí / resultado + links), MyRent destacado, grid, sin select.
7. `content(experience)` — Trabajo / Formación separados, nuevo→viejo, timeline vertical (se fue el scroll horizontal sticky).
8. `content(skills)` — agrupadas por área, stack actual.
9. `fix(ui)` — nav mobile con fade, controles flotantes compactos, CTAs del hero.
10. `content(contact)` — ES rioplatense + labels.
11. `docs` — CLAUDE.md + este STATUS.
12. `feat(projects): add MyRent screenshots` — ver sección siguiente.

## Fuera de alcance / próximo

- Migrar Next 13.5 → 15 (advisories de seguridad en Server Actions de 13.x). Sesión aparte.
- Dominio propio (ej. `enzoarjona.dev`, ~US$12/año) vs seguir en `vercel.app`.
- Performance Lighthouse (no medida por la herramienta; la foto de perfil viene de Cloudinary sin transformación, candidata a `w_400`).
- Video/demo corto de MyRent (hoy solo capturas + link).

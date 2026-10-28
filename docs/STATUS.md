# STATUS — portfolio (enzo-arjona.vercel.app)

> Estado vivo del proyecto. Leer al abrir una sesión, actualizar al cerrar. Fechas absolutas.

**Última actualización:** 2026-10-27 (capturas MyRent)

## 👉 AHORA

**Enzo revisa y da OK para push.** Rework completo en `main` local: **15 commits** sobre `origin/main`, **sin pushear**. Capturas de MyRent hechas 2026-10-27 (`05fde34`). Verificado 2026-10-27: `tsc` + `lint` + `build` verdes; card de MyRent mirada en `next start -p 3017` (desktop y mobile, light y dark; galería 6/6 imágenes cargan); Lighthouse mobile local: a11y 100 · best practices **100** (antes 96) · SEO 100.

**EL próximo paso:** Enzo revisa en local (`npm run build && npm run start`) → OK → `git push origin main` → Vercel deploya. Antes del push conviene dejar el CV en `public/cv-enzo-arjona.pdf` (si no, el botón CV da 404). Los 3 docs de `docs/` (AUDITORIA, PLAN, PROMPT-MAESTRO) siguen **sin commitear a propósito** (mencionan proyectos privados; repo público).

## Tareas de Enzo

- [ ] Dejar `public/cv-enzo-arjona.pdf` (el botón "Descargar CV" ya apunta ahí).
- [ ] Pasar las URLs públicas de Omertà Construction / Hairy's Puppies World / Glori Salon → van en `lib/projects.ts` (`wordpress-sites.links`, hay un `TODO(enzo)`).
- [ ] Revisar el copy nuevo (hero, about, proyectos, experiencia) y corregir datos que no sean exactos (fechas, nombres de instituciones, descripciones de Dharma).
- [ ] Decidir el título: LinkedIn dice "WordPress & React Developer | Gutenberg…" y el portfolio "Full-Stack Developer · Next.js, TypeScript, PostgreSQL" → alinear uno de los dos.
- [ ] OK para push/deploy.
- [ ] (Opcional) Vercel: renombrar env `RESENT_API_KEY` → `RESEND_API_KEY`; el código acepta ambas.
- [ ] (Opcional) GitHub: bio del perfil + description del repo `portfolio` + README de perfil con pins (MyRent overview, portfolio).

## Hecho (2026-10-07 → 2026-10-27)

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
12. `content: keep MyRent claims to 'real customers'…` — se bajó "clientes que pagan" a "clientes reales" (Brain 2026-10-07: MyRent sin usuarios pagos) y fecha de inicio alineada con LinkedIn (Jul 2025).
13. `docs: STATUS — MyRent screenshots still pending`.
14. `feat(projects): add MyRent screenshots` (2026-10-27) — 6 WebP en `public/projects/myrent/` (32–78 KB, 1600px): dashboard light/dark, detalle de contrato (archivo `myrent-leases-light`), recibo pagado, /payments, landing. Sacadas de un build local de MyRent (:3100) contra Supabase local con datos ficticios ("Demo Inmobiliaria", Mendoza); recibos y pago creados por la UI real.
15. `docs: STATUS — MyRent screenshots done, awaiting push OK`.

## Fuera de alcance / próximo

- Migrar Next 13.5 → 15 (advisories de seguridad en Server Actions de 13.x). Sesión aparte.
- Dominio propio (ej. `enzoarjona.dev`, ~US$12/año) vs seguir en `vercel.app`.
- Performance Lighthouse (no medida por la herramienta; la foto de perfil viene de Cloudinary sin transformación, candidata a `w_400`).
- Video/demo corto de MyRent (hoy solo capturas + link).

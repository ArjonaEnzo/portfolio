# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npx tsc --noEmit # Type-check
```

Before declaring anything done: `npx tsc --noEmit && npm run lint && npm run build`, then look at the page in a browser (desktop and mobile, light and dark).

## Architecture

**Next.js 13** single-page portfolio on the App Router. `app/page.tsx` composes the sections: `Intro → About → Projects → Skills → Experience → Contact`. There is one route plus `robots.ts`, `sitemap.ts` and `opengraph-image.tsx` (generated with `next/og`).

### Content lives in `lib/`

All user-visible content is data, bilingual, keyed by `Language = "ENG" | "ESP"`:

- `lib/site.ts` — site URL, name, role, description, social links. Used by metadata, JSON-LD, the OG image and the hero.
- `lib/projects.ts` — `base` (slug, stack, links, cover, gallery — language-independent) + `copy[language][slug]` (period, title, tagline, problem, solution, impact). `getProjects(language)` merges them. `featured: true` renders the card full-width above the grid. Link kinds: `live | repo | video`.
- `lib/experience.ts` — `experienceData[language]`, items with `kind: "work" | "education"`, newest first, achievement-style `highlights`.
- `lib/skills.ts` — `skillGroups` (core / backend / quality / more) with react-icons; labels per language in `skillGroupLabels`.
- `lib/data.ts` — only the nav `links` / `linksESP` now. `lib/types.ts` derives `SectionName` from them.

Hero, About, Contact and Footer keep their copy inline in the component with `language === "ENG" ? … : …`. Spanish is Rioplatense (voseo: "Contactame", "Escribime"); English should read native, not translated.

### Context providers (nested in `app/layout.tsx`)

- `ThemeContextProvider` (`context/theme-context.tsx`) — `theme` + `toggleTheme`, persisted in `localStorage`, follows `prefers-color-scheme` on first visit. Tailwind `darkMode: "class"`.
- `LanguageContextProvider` (`context/language-context.tsx`) — `language` + `toggleLanguage`, default `ESP`, persisted in `localStorage`, keeps `<html lang>` in sync.
- `ActiveSectionContextProvider` — which nav section is in view (`useSectionInView` in `lib/hooks.ts`, ignores updates for 1 s after a nav click).

### Styling

Two custom palettes in `tailwind.config.js`: `frieren-*` (light mode, lavender) and `fern-*` (dark mode, muted purple). Keep `frieren-*`/`violet-*` classes for light and add `dark:fern-*` variants beside them. Ambient layer: `BgOrbs`, `ParticlesBg` (respects `prefers-reduced-motion`), `ScrollProgress`.

### Components worth knowing

- `components/project.tsx` — card with cover, gallery trigger (Swiper modal via portal, closes on Escape/backdrop), labelled problem / what I built / result, stack chips and link buttons.
- `components/projects.tsx` — featured card + responsive grid. No filter.
- `components/experience.tsx` — two vertical timelines (Work / Education) side by side on `lg`, stacked below.
- `components/header.tsx` — pill nav; on mobile it scrolls horizontally with faded edges.
- `components/language-switch.tsx`, `components/theme-switch.tsx` — fixed buttons with localized `aria-label`s.

### Contact form

`actions/sendEmail.ts` (Server Action) sends through Resend using `RESEND_API_KEY` (falls back to the legacy `RESENT_API_KEY` name still set on Vercel). Template in `email/contact-form-email.tsx`.

## Assets

`public/` holds the two flag icons, the Club ADIP and Fisiom covers, `projects/myrent/*.webp` screenshots and the CV at `public/cv-enzo-arjona.pdf` (linked from the hero). Other project images are served from Cloudinary (`res.cloudinary.com` is allowed in `next.config.js`).

## Docs

`docs/STATUS.md` is the live state of the project (read it first). `docs/AUDITORIA-2026-10-07.md` and `docs/PLAN-2026-10-08.md` record the audit and the plan behind the current structure.

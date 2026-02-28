# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js 13** single-page portfolio app using the App Router. The entire site renders as one scrollable page (`app/page.tsx`) composed of sections: `Intro → About → Projects → Skills → Experience → Contact`.

### Context Providers (nested in `app/layout.tsx`)

Three React context providers wrap the app:
- **`ThemeContextProvider`** (`context/theme-context.tsx`) — dark/light mode toggle; exposes `theme` (`"light" | "dark"`) and `toggleTheme`
- **`LanguageContextProvider`** (`context/language-context.tsx`) — bilingual support (`"ESP"` | `"ENG"`); exposes `language` and `toggleLanguage`
- **`ActiveSectionContextProvider`** (`context/active-section-context.tsx`) — tracks which nav section is in view

### Bilingual Pattern

All user-visible content has two variants. The convention is:
- English data: `projectsData`, `experiencesData`, `links`
- Spanish data: `projectsDataEsp`, `experiencesDataEsp`, `linksESP`

Data is defined in `lib/data.ts`. Components consume `useLanguage()` from `context/language-context.tsx` to switch between them.

### Section Navigation

The `useSectionInView` hook (`lib/hooks.ts`) uses `react-intersection-observer` to detect when a section scrolls into view and calls `setActiveSection` from `ActiveSectionContext`. It only updates if >1s has passed since the last nav click (`timeOfLastClick`) to avoid fighting user click navigation.

### Dark Theme

Tailwind is configured with `darkMode: "class"`. Two custom palettes are defined in `tailwind.config.js`:
- **`frieren`** (11 shades: `frieren-50` → `frieren-950`, soft lavender tones) — used for light mode accents alongside `violet-*` Tailwind classes.
- **`fern`** (11 shades: `fern-50` → `fern-950`, muted purple/indigo tones) — used exclusively for dark mode classes.

**Never replace `violet-*` or `frieren-*` light-mode classes — only add `dark:fern-*` variants alongside them.**

`components/experience.tsx` uses a sticky horizontal scroll pattern (`useScroll` + `useTransform`). Dark mode is handled via `useTheme()` with conditional inline `cardStyle`/`iconStyle` objects — not `dark:` classes. `INITIAL_SLIDE` is a module-level const that seeds the correct section height before `useEffect` fires (avoids `scrollYProgress` miscalibration on first scroll). A `maxSlideRef` keeps the transform stale-closure-free across resizes.

### Atmosphere Layer

Three global client components form the ambient background layer:
- **`BgOrbs`** (`components/bg-orbs.tsx`) — four large blurred `motion.div` orbs with slow infinite keyframe animations creating a floating gradient atmosphere. Uses `frieren-*` for light mode and `fern-*` / `indigo-*` for dark mode. Fixed positioned, `z-index: -10`, `pointer-events: none`.
- **`ParticlesBg`** (`components/particles-bg.tsx`) — canvas-based particle system; 28 dust motes at very low alpha/speed; deep violet (`109,40,217`) in dark mode, soft violet (`139,92,246`) in light mode. Reads `theme` via `useTheme()`. Respects `prefers-reduced-motion`. Cleanup via `cancelAnimationFrame` + `removeEventListener`.
- **`ScrollProgress`** (`components/scroll-progress.tsx`) — 2px `motion.div` at the very top of the viewport driven by `useScroll().scrollYProgress`. Uses `dark:` Tailwind for color, needs no context.

The `@keyframes float` animation and `.animate-float` utility class are defined in `app/globals.css` and applied to the profile image wrapper in `components/intro.tsx` for a gentle 5s vertical float.

The header pill's shadow is scroll-driven via `useScroll` + `useTransform` (`framer-motion`) — `boxShadow` is set on `style` prop of the `motion.div`, not via Tailwind classes.

Section headings (`components/section-heading.tsx`) use `whileInView` with `viewport: { once: true }` for a subtle entrance. This component is `"use client"` since it uses framer-motion.

### Projects Component

`components/projects.tsx` renders a horizontally scrollable carousel of `<Project>` cards (`components/project.tsx`). Each card:
- Animates with scroll-based `framer-motion` scale/opacity transforms
- Opens a fullscreen Swiper modal (`components/swiper-projects.tsx`) when an image is clicked, if the project has a non-empty `images` array
- Supports an optional `linkTo` URL for an external link button
- Can be filtered by tag via a dropdown select

### Skills Icons

`lib/skills-icons.ts` exports `skillIcons: Record<string, IconType>` — a static mapping from skill name strings to `react-icons` components. This is the single source of truth for skill icons; no runtime fetching. `components/skills.tsx` imports and renders these icons alongside skill names.

### Contact / Email

Contact form uses a Next.js **Server Action** (`actions/sendEmail.ts`) with the **Resend** API. Requires `RESENT_API_KEY` env variable (note: the env var name has a typo — it's `RESENT_API_KEY`, not `RESEND_API_KEY`; do not rename it). The email template is a React Email component at `email/contact-form-email.tsx`.

### Dark Background Colors

Dark mode background uses deep violet tones: body `dark:bg-[#0d0a1a]`, blob 1 `dark:bg-[#1a0d2e]`, blob 2 `dark:bg-[#1a1040]`. The `fern-*` palette (muted purples) is used for dark mode accents and component backgrounds — it is not the background tone. Experience timeline inline dark styles use `fern` hex values: line `#413558` (fern-700), card bg `#362d49` (fern-800), border `#2d263b` (fern-900), icon bg `#50416d` (fern-600), icon text `#f4f3f7` (fern-50).

### Adding a New Project

Edit `lib/data.ts` — add an entry to both `projectsData` (English) and `projectsDataEsp` (Spanish). The `Project` interface requires `title`, `description`, `tags`, `imageUrl`, and `images` (array of Cloudinary URLs or empty array). Add `linkTo` optionally. Place new static images in `public/` and import them in `data.ts`.

**`tags` must contain only real technology names.** The filter dropdown is generated dynamically via `flatMap` over all project tags — any non-technology string (placeholder phrases, lorem ipsum, etc.) will appear as a spurious filter option. Placeholder/coming-soon projects must use `tags: []`.

Remote images must use `res.cloudinary.com` (configured in `next.config.js` `remotePatterns`). Local images in `public/` are referenced as plain string paths (e.g. `"/projects/foo.jpg"`) — no import needed, but the file must exist.

### Adding a New Skill

Add the skill name string to both `skillsData` and `skillsDataEsp` arrays in `lib/data.ts`, then add the corresponding icon mapping in `lib/skills-icons.ts`.

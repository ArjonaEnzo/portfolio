# Enzo Arjona: Portfolio

Personal site of Enzo Arjona, Full-Stack Developer (Next.js, TypeScript, PostgreSQL) based in Mendoza, Argentina, open to remote work.

**Live:** https://enzo-arjona.vercel.app

The home page is a small 3D room you walk through: four stations open the projects (on a wall screen), experience, about and contact (on a phone) sections. A classic, text-first version lives at [`/clasica`](https://enzo-arjona.vercel.app/clasica) for anyone who prefers it or whose device can't run WebGL.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router, Server Components, Server Actions) + React 19 + TypeScript
- [React Three Fiber 9](https://r3f.docs.pmnd.rs/) + drei + three.js for the 3D room, with a custom two-tone toon shader and GSAP / maath for motion
- Tailwind CSS and Framer Motion for the classic version
- Resend + React Email for the contact form
- Deployed on Vercel (Analytics enabled)

## How it works

- **3D room (`/`)**: the canvas is client-only, so the page also server-renders a visually hidden text summary of every section (projects, skills, experience, contact). Search engines and screen readers get the full content; the boot screen already shows the role, stack and links to the resume, GitHub and LinkedIn before the room loads.
- **Classic version (`/clasica`)**: a menu of five panels (profile, projects, skills, experience, contact) with a light "paper" and a dark "graphite" theme.
- **Bilingual**: English by default, Spanish (Rioplatense) on toggle. The choice is stored in `localStorage` and `?lang=` overrides it.
- **Content as data**: everything visitors read comes from `lib/` (`site.ts`, `projects.ts`, `experience.ts`, `skills.ts`), with an English and a Spanish copy, so both versions of the site stay in sync.
- **SEO**: metadata, JSON-LD, a generated Open Graph image (`next/og`), `robots.ts` and `sitemap.ts`.

## Getting started

```bash
npm install
cp .env.example .env.local   # add your Resend API key
npm run dev                  # http://localhost:3000
```

Before shipping: `npx tsc --noEmit && npm run lint && npm run build`.

## Project structure

```
app/                 layout, home (3D room), /clasica, OG image, robots, sitemap
components/desk/     3D room: canvas, room, stations, screens, boot screen, server-rendered summary
components/clasica/  classic version: menu and panels
context/             theme and language providers
lib/                 site info and all content (EN + ES)
actions/             sendEmail server action
email/               React Email template
public/              CV, project images, 3D models
```

## Credits

Furniture models from the [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit) (CC0).

# Enzo Arjona — Portfolio

Personal portfolio of Enzo Arjona, Full-Stack Developer (Next.js, TypeScript, PostgreSQL) based in Mendoza, Argentina.

**Live:** https://enzo-arjona.vercel.app

## Stack

- [Next.js 13](https://nextjs.org/) (App Router, Server Actions) + React 18 + TypeScript
- Tailwind CSS with a custom palette (`frieren` for light mode, `fern` for dark mode)
- Framer Motion for scroll-driven and entrance animations
- Resend + React Email for the contact form
- Deployed on Vercel

## Features

- Single-page layout: Intro → About → Projects → Skills → Experience → Contact
- Bilingual content (English / Spanish) switched at runtime, no route-based i18n
- Light / dark theme persisted in `localStorage`, follows `prefers-color-scheme` on first visit
- Project cards with image galleries (Swiper) and links to live sites, repos and videos
- Contact form handled by a Server Action that sends an email through Resend

## Getting started

```bash
npm install
cp .env.example .env.local   # add your Resend API key
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Project structure

```
app/          layout, page, global styles
components/   one file per section + UI pieces (header, switches, project card…)
context/      theme, language and active-section React contexts
lib/          data.ts (all content, EN + ES), hooks, types, utils
actions/      sendEmail server action
email/        React Email template
public/       static assets (images, CV)
docs/         audit, plan and status notes
```

All user-visible content lives in `lib/data.ts`. Each dataset has an English and a Spanish variant.

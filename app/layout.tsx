import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import { SITE, SITE_URL } from "@/lib/site";
import { ThemeContextProvider } from "@/context/theme-context";
import MotionProvider from "@/components/motion-provider";
import LanguageContextProvider from "@/context/language-context";
import { Toaster } from "@/components/deferred-ui";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Enzo Arjona",
    "Full-Stack Developer",
    "Next.js",
    "TypeScript",
    "React",
    "PostgreSQL",
    "Supabase",
    "Mendoza",
    "Argentina",
    "Desarrollador Full Stack",
  ],
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: `${SITE.name} — Portfolio`,
    title: SITE.title,
    description: SITE.description,
    locale: "es_AR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE_URL,
  email: `mailto:${SITE.email}`,
  jobTitle: "Full-Stack Developer",
  address: { "@type": "PostalAddress", addressLocality: "Mendoza", addressCountry: "AR" },
  sameAs: [SITE.linkedin, SITE.github],
  knowsAbout: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Supabase"],
};

// Applies the saved (or system) theme before the first paint, so the classic
// page doesn't flash paper white before switching to graphite.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MotionProvider>
          <ThemeContextProvider>
            <LanguageContextProvider>
              {children}
              <Toaster position="top-right" />
            </LanguageContextProvider>
          </ThemeContextProvider>
        </MotionProvider>
        {/* Private visit counts, seen only in the Vercel dashboard. No cookies. */}
        <Analytics />
      </body>
    </html>
  );
}

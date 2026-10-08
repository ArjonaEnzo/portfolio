import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { SITE, SITE_URL } from "@/lib/site";
import ActiveSectionContextProvider from "@/context/active-section-context";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";
import ThemeSwitch from "@/components/theme-switch";
import { ThemeContextProvider } from "@/context/theme-context";
import LanguageSwitch from "@/components/language-switch";
import LanguageContextProvider from "@/context/language-context";
import ParticlesBg from "@/components/particles-bg";
import ScrollProgress from "@/components/scroll-progress";
import BgOrbs from "@/components/bg-orbs";

const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="!scroll-smooth">
      <body
        className={`${inter.className}
      bg-frieren-50 text-frieren-950 relative pt-28 sm:pt-36 overflow-x-hidden dark:bg-[#0d0a1a] dark:text-gray-50 dark:text-opacity-90`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeContextProvider>
          <BgOrbs />
          <ParticlesBg />
          <ScrollProgress />
          <LanguageContextProvider>
            <ActiveSectionContextProvider>
              <Header />
              {children}
              <Footer />
              <Toaster position="top-right" />
              <LanguageSwitch />
              <ThemeSwitch />
            </ActiveSectionContextProvider>
          </LanguageContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}

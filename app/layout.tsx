import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import ActiveSectionContextProvider from "@/context/active-section-context";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";
import ThemeSwich from "@/components/theme-swich";
import { ThemeContextProvider } from "@/context/theme-context";
import LanguageSwitch from "@/components/language-swich";
import LanguageContextProvider from "@/context/language-context";
import ParticlesBg from "@/components/particles-bg";
import ScrollProgress from "@/components/scroll-progress";
import BgOrbs from "@/components/bg-orbs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arjona Enzo | Portfolio",
  description: "Enzo Arjona FullStack Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth ">
      <body
        className={`${inter.className}
      bg-frieren-50 text-frieren-950 relative pt-28 sm:pt-36 overflow-x-hidden dark:bg-[#0d0a1a] dark:text-gray-50 dark:text-opacity-90`}
      >
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
              <ThemeSwich />
            </ActiveSectionContextProvider>
          </LanguageContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}

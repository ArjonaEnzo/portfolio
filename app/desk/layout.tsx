import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./desk.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-desk-mono",
});

// Experimental 3D room version of the portfolio. Kept out of search results
// until it replaces (or not) the classic home page.
export const metadata: Metadata = {
  title: "Desk",
  robots: { index: false, follow: false },
};

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return <div className={mono.variable}>{children}</div>;
}

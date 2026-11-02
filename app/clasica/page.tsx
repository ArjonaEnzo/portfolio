import type { Metadata } from "next";
import localFont from "next/font/local";
import ClassicMenu from "@/components/clasica/classic-menu";
import "@/components/clasica/clasica.css";

// Shippori Mincho subset to Latin with fontTools (~14 KB per weight). Google's
// build ships ~120 Japanese slices per weight, which cost every page a 188 KB
// stylesheet and dozens of font preloads. Only this page uses it.
const mincho = localFont({
  src: [
    { path: "./fonts/shippori-mincho-latin-medium.woff2", weight: "500" },
    { path: "./fonts/shippori-mincho-latin-bold.woff2", weight: "700" },
  ],
  variable: "--font-mincho",
  fallback: ["ui-serif", "Georgia", "serif"],
});

export const metadata: Metadata = {
  title: "Classic version",
  alternates: { canonical: "/clasica" },
};

// The light, no-WebGL version: everything on one screen, one panel at a time.
// Every panel is server-rendered, so search engines read all of it.
export default function ClassicPage() {
  return (
    <div className={mincho.variable}>
      <ClassicMenu />
    </div>
  );
}

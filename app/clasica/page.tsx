import type { Metadata } from "next";
import ClassicMenu from "@/components/clasica/classic-menu";
import "@/components/clasica/clasica.css";

// The light, no-WebGL version: everything on one screen, one panel at a time.
// Every panel is server-rendered, so search engines read all of it.
export const metadata: Metadata = {
  title: "Versión clásica",
  alternates: { canonical: "/clasica" },
};

export default function ClassicPage() {
  return <ClassicMenu />;
}

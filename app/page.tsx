import DeskClient from "@/components/desk/desk-client";
import "@/components/desk/desk.css";

/**
 * Home — the portfolio as a 3D room. Each section lives on an object:
 * monitor → projects, board → experience, poster → about, phone → contact.
 * Content comes from lib/, like the one-screen classic version at /clasica.
 */
export default function Home() {
  return <DeskClient />;
}

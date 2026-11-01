import DeskClient from "@/components/desk/desk-client";

/**
 * /desk — the portfolio as a 3D room (spike). Each section lives on an object:
 * monitor → projects, board → experience, poster → about, phone → contact.
 * Content comes from lib/ like the classic page at /.
 */
export default function DeskPage() {
  return <DeskClient />;
}

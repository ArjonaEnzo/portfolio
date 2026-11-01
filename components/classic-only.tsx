"use client";
import { usePathname } from "next/navigation";

// Chrome of the classic one-page portfolio (header, footer, animated
// background...). Not rendered on /menu, /wc3 or /desk, which draw their own full-screen UI
// and would otherwise keep paying for animations hidden underneath it.
export default function ClassicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/menu") || pathname?.startsWith("/wc3") || pathname?.startsWith("/desk")) return null;
  return <>{children}</>;
}

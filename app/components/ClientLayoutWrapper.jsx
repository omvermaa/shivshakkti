"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();

  // Safely check if we are exactly on the landing page (handling potential trailing slashes)
  const isLandingPage = pathname === "/" || pathname?.replace(/\/$/, "") === "";

  // If on the landing page, strictly return ONLY the children (No Nav, No Footer)
  if (isLandingPage) {
    return <main className="flex-grow">{children}</main>;
  }

  // On any other page (/shop, /about, etc.), return the full layout
  return (
    <>
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
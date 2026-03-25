"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();

  // Foolproof check: catches the root exactly, avoiding trailing slash bugs
  const isLandingPage = pathname === "/" || pathname === "";

  // This ensures Navbar and Footer stay completely hidden on the Landing page
  if (isLandingPage) {
    return <main className="flex-grow">{children}</main>;
  }

  // Renders normally for /shop, /about, /services, etc.
  return (
    <>
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
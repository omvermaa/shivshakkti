"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();

  // Hide Navbar and Footer if the user is on the Landing Page ("/")
  const isLandingPage = pathname === "/";

  // Optional: You can also add your admin paths here if you want to hide the public footer on admin dashboards!
  // const isLandingPage = pathname === "/" || pathname.startsWith("/admin");

  return (
    <>
      {!isLandingPage && <Navigation />}
      
      <main className="flex-grow">
        {children}
      </main>

      {!isLandingPage && <Footer />}
    </>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Mail, MapPin, Sparkles } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on the Landing page and Admin portal
  if (pathname === '/' || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-8 px-6 lg:px-12 text-zinc-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-serif tracking-[0.2em] text-white uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            ShivShakkti
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Guiding you through the cosmic energies of Shiv and Shakti. Discover clarity, healing, and spiritual awakening through our premium tarot readings and mystical items.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-zinc-100 font-semibold tracking-wider uppercase text-sm">Explore</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/shop" className="text-sm hover:text-purple-400 transition-colors w-fit">Shop Collection</Link>
            <Link href="/about" className="text-sm hover:text-purple-400 transition-colors w-fit">About Us</Link>
            <Link href="/services" className="text-sm hover:text-purple-400 transition-colors w-fit">Our Services</Link>
            <Link href="/contact" className="text-sm hover:text-purple-400 transition-colors w-fit">Contact</Link>
          </nav>
        </div>

        {/* Contact & Socials */}
        <div className="space-y-4">
          <h3 className="text-zinc-100 font-semibold tracking-wider uppercase text-sm">Connect</h3>
          <div className="flex flex-col gap-3">
            <a href="https://www.instagram.com/shivshakktitarot/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-purple-400 transition-colors w-fit">
              <Instagram className="w-4 h-4" />
              @shivshakktitarot
            </a>
            <a href="mailto:hello@shivshakktitarot.com" className="flex items-center gap-3 text-sm hover:text-purple-400 transition-colors w-fit">
              <Mail className="w-4 h-4" />
              hello@shivshakktitarot.com
            </a>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4" />
              Pan India Delivery
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>© {new Date().getFullYear()} ShivShakkti Tarot. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-white">Privacy Policy</Link>
          <Link href="#" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
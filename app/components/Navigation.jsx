"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navigation({ onClose }) {

  const links = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Shop Now', href: 'https://www.shop.witchwayout.in/' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.div 
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
    >
        <button
          onClick={onClose}
          className="absolute p-2 text-white transition-opacity top-8 left-8 hover:opacity-70"
          aria-label="Close Menu"
        >
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <nav className="flex flex-col items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className="text-2xl tracking-[0.15em] text-white uppercase transition-colors hover:text-gray-400"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </motion.div>
  );
}
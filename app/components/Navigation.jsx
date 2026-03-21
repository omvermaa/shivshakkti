"use client";

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Shop Now', href: 'https://www.shop.witchwayout.in/' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

const FullScreenMenu = ({ closeMenu, session }) => (
  <motion.div 
    initial={{ y: "-100%" }}
    animate={{ y: 0 }}
    exit={{ y: "-100%" }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
  >
    <button
      onClick={closeMenu}
      className="absolute p-2 text-white transition-opacity top-8 left-8 hover:opacity-70"
      aria-label="Close Menu"
    >
       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <nav className="flex flex-col items-center gap-8">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          onClick={closeMenu}
          className="text-2xl tracking-[0.15em] text-white uppercase transition-colors hover:text-gray-400"
        >
          {link.name}
        </Link>
      ))}
      
      {/* Mobile Auth Button Swap */}
      {session ? (
        <button
          onClick={() => {
            signOut({ callbackUrl: '/' });
            closeMenu();
          }}
          className="text-2xl tracking-[0.15em] text-rose-400 uppercase transition-colors hover:text-rose-300"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/user-login"
          onClick={closeMenu}
          className="text-2xl tracking-[0.15em] text-purple-400 uppercase transition-colors hover:text-purple-300"
        >
          Login
        </Link>
      )}
    </nav>
  </motion.div>
);

export default function Navigation({ onClose }) {
  const pathname = usePathname();
  const isShopRoute = pathname?.startsWith('/shop');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data: session } = useSession();

  if (isShopRoute) {
    return (
      <>
        {/* Desktop Navbar */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center justify-between px-6 lg:px-12 h-20 max-w-7xl mx-auto">
            <Link href="/" className="text-xl font-serif tracking-[0.2em] text-white uppercase">
              ShivShakkti
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Desktop Auth Button Swap */}
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm tracking-widest text-rose-400 uppercase transition-colors hover:text-rose-300"
                >
                  LOGOUT
                </button>
              ) : (
                <Link
                  href="/user-login"
                  className="text-sm tracking-widest text-purple-400 uppercase transition-colors hover:text-purple-300"
                >
                  LOGIN
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Full Screen Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <FullScreenMenu 
              closeMenu={() => setMobileMenuOpen(false)} 
              session={session} 
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Original Full Screen Menu for Landing Page
  return <FullScreenMenu closeMenu={onClose} session={session} />;
}
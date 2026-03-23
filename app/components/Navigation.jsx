"use client";

import Image from "next/image";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import CartDrawer from './CartDrawer';

import { User, Settings, LayoutDashboard, Package, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Shop Now', href: '/shop' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

// --- Desktop Profile Dropdown ---
const UserMenu = ({ session }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-zinc-800 hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50">
          {session.user?.image ? (
            <Image 
              src={session.user.image} 
              alt="Profile" 
              fill 
              className="object-cover" 
              unoptimized 
              referrerPolicy="no-referrer" 
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-400">
              <User className="w-4 h-4" />
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300 shadow-xl shadow-black/50 z-[100] p-2">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium leading-none text-zinc-100">{session.user?.name}</p>
            <p className="text-xs leading-none text-zinc-500">{session.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-zinc-800" />
        
        {session.user?.role === "admin" && (
          <DropdownMenuItem asChild className="hover:bg-purple-600 focus:bg-purple-600 hover:text-white focus:text-white cursor-pointer p-2 transition-colors">
            <Link href="/admin" className="flex w-full items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        {session.user?.role !== "admin" && (
          <DropdownMenuItem asChild className="hover:bg-purple-600 focus:bg-purple-600 hover:text-white focus:text-white cursor-pointer p-2 transition-colors">
            <Link href="/orders" className="flex w-full items-center">
              <Package className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild className="hover:bg-purple-600 focus:bg-purple-600 hover:text-white focus:text-white cursor-pointer p-2 transition-colors">
          <Link href="/profile" className="flex w-full items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="hover:bg-purple-600 focus:bg-purple-600 hover:text-white focus:text-white cursor-pointer p-2 transition-colors">
          <Link href="/settings" className="flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-800" />
        
        <DropdownMenuItem 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-rose-400 hover:bg-rose-600 focus:bg-rose-600 hover:text-white focus:text-white cursor-pointer p-2 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- Full Screen Mobile Menu ---
const FullScreenMenu = ({ closeMenu, session }) => (
  <motion.div 
    initial={{ y: "-100%" }}
    animate={{ y: 0 }}
    exit={{ y: "-100%" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800"
  >
    <div className="flex justify-end p-6 md:p-8">
      <button onClick={closeMenu} className="p-2 text-zinc-400 hover:text-white transition-colors">
         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div className="flex flex-col px-8 pb-12 overflow-y-auto h-full w-full max-w-sm mx-auto">
      {session ? (
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-zinc-800">
           <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-800 relative flex-shrink-0">
              {session.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="Profile" 
                  fill 
                  className="object-cover" 
                  unoptimized 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <User className="w-8 h-8" />
                </div>
              )}
           </div>
           <div className="flex flex-col">
             <h2 className="text-lg font-semibold text-zinc-100">{session.user?.name}</h2>
             <p className="text-sm text-zinc-500">{session.user?.email}</p>
           </div>
        </div>
      ) : (
        <div className="mb-10 pb-8 border-b border-zinc-800 text-center">
           <h2 className="text-2xl font-serif tracking-[0.1em] text-purple-400 uppercase">Welcome</h2>
           <p className="text-sm text-zinc-500 mt-2">Sign in to save your cart and view orders.</p>
        </div>
      )}

      <nav className="flex flex-col gap-6 mb-10">
        {navLinks.map((link) => (
          <Link key={link.name} href={link.href} onClick={closeMenu} className="text-xl tracking-[0.15em] text-zinc-300 uppercase hover:text-white">
            {link.name}
          </Link>
        ))}
      </nav>

      {session ? (
        <div className="mt-auto pt-8 border-t border-zinc-800 flex flex-col gap-6">
          <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-600 uppercase mb-2">My Account</h3>
          
          {session.user?.role === "admin" ? (
             <Link href="/admin" onClick={closeMenu} className="flex items-center text-zinc-400 hover:text-white text-lg tracking-wider">
               <LayoutDashboard className="mr-4 h-5 w-5 opacity-80" /> Admin Dashboard
             </Link>
          ) : (
             <Link href="/orders" onClick={closeMenu} className="flex items-center text-zinc-400 hover:text-white text-lg tracking-wider">
               <Package className="mr-4 h-5 w-5 opacity-80" /> My Orders
             </Link>
          )}
          
          <Link href="/profile" onClick={closeMenu} className="flex items-center text-zinc-400 hover:text-white text-lg tracking-wider">
            <User className="mr-4 h-5 w-5 opacity-80" /> Profile
          </Link>
          
          <button onClick={() => { signOut({ callbackUrl: '/' }); closeMenu(); }} className="flex items-center text-rose-500 hover:text-rose-400 text-lg tracking-wider mt-4 text-left">
            <LogOut className="mr-4 h-5 w-5 opacity-80" /> Logout
          </button>
        </div>
      ) : (
         <div className="mt-auto pt-8 border-t border-zinc-800">
            <Link href="/user-login" onClick={closeMenu} className="flex items-center justify-center w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg tracking-widest uppercase font-medium">
              Login
            </Link>
         </div>
      )}
    </div>
  </motion.div>
);

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  // 1. HIDDEN ON ADMIN PAGES
  // If the URL starts with /admin, don't render this navbar at all!
  if (pathname === '/' || pathname?.startsWith('/admin')) {
    return null; 
  }

  // 2. SHOW ON ALL OTHER PAGES
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="flex items-center justify-between px-6 lg:px-12 h-20 max-w-7xl mx-auto">
          
          <Link href="/" className="text-xl font-serif tracking-[0.2em] text-white uppercase">
            ShivShakkti
          </Link>
          
          {/* Desktop Navbar */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm tracking-widest text-zinc-400 uppercase hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
            
            {session && <CartDrawer />}

            {session ? (
              <UserMenu session={session} />
            ) : (
              <Link href="/user-login" className="text-sm tracking-widest text-purple-400 uppercase hover:text-purple-300">
                LOGIN
              </Link>
            )}
          </nav>

          {/* Mobile Navbar Elements */}
          <div className="flex items-center gap-3 md:hidden">
            {session && <CartDrawer />}
            
            <button 
              className="p-2 text-zinc-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Wrapper */}
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
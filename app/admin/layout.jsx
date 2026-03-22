"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Added Home icon to imports
import { LayoutDashboard, Package, ShoppingCart, Home, Menu, MessageSquare } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

const sidebarLinks = [
  // Added Home before Dashboard
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/manage-products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-100 tracking-wider uppercase">Admin Portal</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = link.href === "/admin" 
            ? pathname === "/admin" 
            : pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive 
                  ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.2)]" 
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      
      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-20">
        <h2 className="text-lg font-bold text-zinc-100 tracking-wider uppercase">Admin Portal</h2>
        
        <div className="flex items-center gap-2">
          {/* 1. We keep the Home icon here but ensured it's wrapped in a proper gap container */}
          {/* <Link 
            href="/" 
            className="p-2 text-zinc-500 hover:text-purple-400 transition-colors"
            title="Back to Store"
          >
            <Home className="w-5 h-5" />
          </Link> */}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              {/* 2. Increased padding and clear button area to prevent overlap with Home */}
              <button className="text-zinc-300 hover:text-white transition-colors p-2">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-zinc-900 border-r border-zinc-800 text-zinc-50 flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 bg-zinc-900 border-r border-zinc-800 flex-col flex-shrink-0 h-screen sticky top-0 z-10">
        <SidebarContent />
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto text-zinc-50 bg-zinc-950 w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}
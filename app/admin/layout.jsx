import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import LogoutButton from "../components/LogoutButton"; // Make sure this file exists!

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex text-zinc-50">
      {/* --- Desktop Sidebar --- */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="text-lg font-bold tracking-wider text-purple-400">SHIV SHAKKTI</span>
          <span className="text-lg font-light tracking-wider ml-1 text-zinc-300">ADMIN</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          {/* Fixed the href path here to point to /admin/manage-products */}
          <Link href="/admin/manage-products" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
            <Package className="w-5 h-5 mr-3" />
            Products
          </Link>
          <Link href="/admin" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
            <ShoppingCart className="w-5 h-5 mr-3" />
            Orders
          </Link>
        </nav>

        {/* Desktop Logout Button */}
        <div className="p-4 border-t border-zinc-800">
           <LogoutButton /> 
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col">
        
        {/* Mobile Header (Visible only on small screens) */}
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 md:hidden">
          <span className="font-bold text-purple-400">ADMIN</span>
          {/* Mobile Logout Button inserted here so it's always accessible */}
          <div className="w-auto">
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
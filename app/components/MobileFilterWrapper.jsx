"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "./ui/button";

export default function MobileFilterWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button (Visible only on small screens) */}
      <div className="md:hidden mb-6">
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          variant="outline" 
          className="w-full bg-zinc-900 border-zinc-800 text-zinc-100 flex items-center justify-center gap-2 h-12 shadow-md"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          {isOpen ? "Hide Filters" : "Filters & Categories"}
        </Button>
      </div>

      {/* The Sidebar Content */}
      <aside className={`w-full md:w-64 flex-shrink-0 space-y-10 ${isOpen ? "block mb-8" : "hidden md:block"}`}>
        {children}
      </aside>
    </>
  );
}
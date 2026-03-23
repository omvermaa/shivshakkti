"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, ArrowUpRight } from "lucide-react";

export default function SearchAutocomplete({ 
  initialQuery, 
  currentCategory, 
  currentMaxPrice, 
  suggestions = [] 
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery || "");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Filter suggestions based on query
  const filteredSuggestions = suggestions.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6); // Limit to top 6 for a cleaner dropdown look

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e, searchVal = query) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (currentCategory && currentCategory !== 'all') params.set("category", currentCategory);
    if (currentMaxPrice) params.set("maxPrice", currentMaxPrice);
    if (searchVal.trim()) params.set("q", searchVal.trim());
    
    setIsOpen(false);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 w-full">
      <form onSubmit={handleSubmit} className="flex w-full gap-4">
        <div className="relative flex-1">
          <Input 
            type="text" 
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for mystical items..." 
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-purple-500/50 w-full"
            autoComplete="off"
          />
          
          {/* Enhanced Dropdown List */}
          {isOpen && query.trim() && filteredSuggestions.length > 0 && (
            <ul className="absolute z-50 w-full mt-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl shadow-purple-500/10 overflow-hidden divide-y divide-zinc-800/50">
              {filteredSuggestions.map((item, index) => (
                <li 
                  key={item._id || index}
                  className="p-3 hover:bg-zinc-900 cursor-pointer transition-colors flex items-center gap-4 group"
                  onClick={() => { setQuery(item.name); handleSubmit(null, item.name); }}
                >
                  {/* Product Thumbnail */}
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-800 group-hover:border-purple-500/30 transition-colors">
                    <Image 
                      src={item.images?.[0] || "/placeholder-image.jpg"} 
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span className="text-sm font-medium text-zinc-200 group-hover:text-purple-400 transition-colors truncate">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-500">{item.category}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                      <span className="text-xs font-semibold text-emerald-400">₹{item.price}</span>
                    </div>
                  </div>

                  {/* Action Icon */}
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white shrink-0">
          <Search className="w-4 h-4 mr-2 hidden sm:block" /> Search
        </Button>
      </form>
    </div>
  );
}
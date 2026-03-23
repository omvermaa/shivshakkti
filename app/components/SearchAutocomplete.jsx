"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

export default function SearchAutocomplete({ 
  initialQuery, 
  currentCategory, 
  currentMaxPrice, 
  suggestions = [] 
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Filter suggestions based on query
  const filteredSuggestions = suggestions.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8); // Limit to top 8 suggestions

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
    if (currentCategory !== 'all') params.set("category", currentCategory);
    params.set("maxPrice", currentMaxPrice);
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
          
          {/* Dropdown List */}
          {isOpen && query.trim() && filteredSuggestions.length > 0 && (
            <ul className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
              {filteredSuggestions.map((item, index) => (
                <li 
                  key={item._id || index}
                  className="px-4 py-3 text-sm text-zinc-300 hover:bg-purple-600 hover:text-white cursor-pointer transition-colors flex items-center gap-2 border-b border-zinc-800/50 last:border-none"
                  onClick={() => { setQuery(item.name); handleSubmit(null, item.name); }}
                >
                  <Search className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
                  <span className="line-clamp-1">{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white shrink-0">
          Search
        </Button>
      </form>
    </div>
  );
}

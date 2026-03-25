"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "./ui/slider";

export default function PriceFilter({ initialPrice }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State to hold the current slider value (array format for Radix UI Slider)
  const [price, setPrice] = useState([initialPrice]);
  const [prevInitialPrice, setPrevInitialPrice] = useState(initialPrice);

  // Sync state if the URL changes externally (e.g., clicking back button)
  if (initialPrice !== prevInitialPrice) {
    setPrevInitialPrice(initialPrice);
    setPrice([initialPrice]);
  }

  // Triggered ONLY when the user lets go of the slider thumb
  const handleValueCommit = (val) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("maxPrice", val[0]); // Update the URL parameter
    
    // Push the new URL, which tells the Server Component to fetch new data!
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-wide text-zinc-100">Max Price</h2>
        {/* Premium Floating Price Badge */}
        <span className="text-purple-400 font-medium bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-sm shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-all">
          ₹{price[0]}
        </span>
      </div>
      
      <Slider 
        value={price}
        onValueChange={setPrice}          // Updates the ₹ text instantly while dragging
        onValueCommit={handleValueCommit} // Triggers the actual database filter when released
        max={1000} 
        step={100}
        className="w-full cursor-grab active:cursor-grabbing"
      />
      
      <div className="flex justify-between text-xs text-zinc-500 font-medium">
        <span>₹0</span>
        <span>₹1,000+</span>
      </div>
    </div>
  );
}
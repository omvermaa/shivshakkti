"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ShoppingBag, Zap, Minus, Plus, Loader2 } from "lucide-react";
import { addToCart } from "../actions/cart";

export default function AddToCart({ productId, stock }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Handle Quantity Increase/Decrease
  const increase = () => setQuantity((prev) => (prev < stock ? prev + 1 : prev));
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Handle Standard Add to Cart
  const handleAddToCart = async () => {
    setIsAdding(true);
    const result = await addToCart(productId, quantity);

    if (result.success) {
      alert("Added to cart successfully!");
      router.refresh(); // Refreshes the server state
    } else if (result.error === "unauthorized") {
      alert("Please log in to add items to your cart.");
      router.push("/user-login");
    } else {
      alert("Error adding to cart: " + result.error);
    }
    setIsAdding(false);
  };

  // Handle Buy Now (Bypass Cart)
  const handleBuyNow = () => {
    // Send them directly to checkout with URL parameters for this specific item
    router.push(`/checkout?buyNow=${productId}&qty=${quantity}`);
  };

  if (stock === 0) {
    return (
      <Button disabled size="lg" className="w-full sm:w-auto bg-zinc-800 text-zinc-500">
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-400 font-medium">Quantity</span>
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <button 
            onClick={decrease}
            disabled={quantity <= 1}
            className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold text-zinc-100">{quantity}</span>
          <button 
            onClick={increase}
            disabled={quantity >= stock}
            className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-zinc-500">({stock} available)</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleAddToCart}
          disabled={isAdding}
          size="lg" 
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 gap-2"
        >
          {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
          Add to Cart
        </Button>
        
        <Button 
          onClick={handleBuyNow}
          size="lg" 
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
        >
          <Zap className="w-5 h-5" />
          Buy Now
        </Button>
      </div>
    </div>
  );
}
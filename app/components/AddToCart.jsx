"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ShoppingBag, Zap, Plus, Minus, Loader2 } from "lucide-react";
import { addToCart } from "../actions/cart";
import { toast } from "sonner"; // Using your toaster!

export default function AddToCart({ product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // --- CRITICAL FIX: Force stock to be a pure number to prevent math bugs ---
  const stockAvailable = Number(product.stock) || 0;

  const increaseQuantity = () => {
    if (quantity < stockAvailable) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error(`Only ${stockAvailable} items available in stock.`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const res = await addToCart(product._id, quantity);
      
      if (res.success) {
        toast.success("Added to your realm successfully!");
        
        // This fires the event your CartDrawer uses to update the UI instantly!
        window.dispatchEvent(new Event("cartUpdated")); 
      } else {
        if (res.error === "Not logged in") {
           toast.error("Please log in to add items to your cart.");
           router.push("/user-login");
        } else {
           toast.error(res.error || "Failed to add item.");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    router.push(`/checkout?product=${product._id}&quantity=${quantity}`);
  };

  if (stockAvailable <= 0) {
    return (
      <Button disabled className="w-full bg-zinc-800 text-zinc-500 cursor-not-allowed py-6">
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-zinc-400 text-sm font-medium">Quantity:</span>
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-1">
          <button 
            type="button"
            onClick={decreaseQuantity}
            className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-10 text-center font-medium text-zinc-100">{quantity}</span>
          
          <button 
            type="button"
            onClick={increaseQuantity}
            className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 rounded-2xl bg-zinc-900 text-lg hover:bg-zinc-800 text-white border border-zinc-700 py-4"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShoppingBag className="w-4 h-4 mr-2" />}
          {isAdding ? "Adding..." : "Add to Cart"}
        </Button>
        <Button 
          onClick={handleBuyNow}
          className="flex-1 bg-purple-600 rounded-2xl text-lg hover:bg-purple-700 text-white py-4 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all"
        >
          <Zap className="w-4 h-4 mr-2 fill-current" />
          Buy it Now
        </Button>
      </div>
    </div>
  );
}
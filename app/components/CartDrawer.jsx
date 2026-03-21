"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { getCart, updateCartQuantity, removeFromCart } from "../actions/cart";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // Prevents spam clicking

  const fetchCart = async () => {
    setIsLoading(true);
    const res = await getCart();
    if (res.success) {
      setCart(res.cart);
    }
    setIsLoading(false);
  };

  // Fetch data in the event handler instead of a side effect
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      fetchCart();
    }
  };


  // --- NEW: Handle Quantity Changes ---
  const handleQuantityChange = async (productId, currentQty, change, maxStock) => {
    const newQty = currentQty + change;
    
    // Prevent going below 1 or above available stock
    if (newQty < 1 || newQty > maxStock) return;

    setUpdatingId(productId);
    
    // Optimistic UI update (feels instant to the user)
    setCart(cart.map(item => 
      item.product._id === productId ? { ...item, quantity: newQty } : item
    ));

    // Background database update
    await updateCartQuantity(productId, newQty);
    setUpdatingId(null);
  };

  // --- NEW: Handle Item Removal ---
  const handleRemoveItem = async (productId) => {
    setUpdatingId(productId);
    
    // Optimistic UI update
    setCart(cart.filter(item => item.product._id !== productId));

    // Background database update
    await removeFromCart(productId);
    setUpdatingId(null);
  };

  const cartTotal = cart.reduce((total, item) => {
    if (!item.product) return total;
    return total + (item.product.price * item.quantity);
  }, 0);

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button className="relative p-2 text-zinc-400 hover:text-purple-400 transition-colors">
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white border border-zinc-950">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-zinc-800 p-0 flex flex-col text-zinc-50 z-[100] [&>button]:right-6 [&>button]:top-6 [&>button>svg]:w-7 [&>button>svg]:h-7">
        <SheetHeader className="p-6 border-b border-zinc-800">
          <SheetTitle className="text-zinc-100 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-20 mb-2" />
              <p className="text-xl font-medium text-zinc-400">Your cart is empty</p>
              <Button variant="outline" onClick={() => setIsOpen(false)} asChild className="border-zinc-700 hover:bg-zinc-800 text-zinc-300 mt-4">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => {
                if (!item.product) return null;
                const isUpdating = updatingId === item.product._id;

                return (
                  <div key={item._id} className={`flex gap-4 transition-opacity ${isUpdating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div className="w-20 h-20 relative rounded-md overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                      <Image 
                        src={item.product.images?.[0] || "/placeholder-image.jpg"} 
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-sm text-zinc-100 line-clamp-2 leading-tight">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-purple-400 font-semibold whitespace-nowrap">
                          ₹{item.product.price}
                        </p>
                      </div>
                      
                      {/* --- NEW: Interactive Controls --- */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        
                        {/* + / - Controls */}
                        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md">
                          <button 
                            onClick={() => handleQuantityChange(item.product._id, item.quantity, -1, item.product.stock)}
                            disabled={item.quantity <= 1}
                            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className="w-8 text-center text-xs font-medium text-zinc-100">
                            {item.quantity}
                          </span>
                          
                          <button 
                            onClick={() => handleQuantityChange(item.product._id, item.quantity, 1, item.product.stock)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Trash Button */}
                        <button 
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-400">Total</span>
              <span className="text-xl font-bold text-zinc-100">₹{cartTotal}</span>
            </div>
            {/* Direct to Checkout page, passing the drawer closure callback if needed */}
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(147,51,234,0.2)]">
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                Proceed to Checkout
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
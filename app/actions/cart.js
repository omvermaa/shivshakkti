"use server";

import { connectMongoDB } from "../lib/mongodb";
import User from "../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function addToCart(productId, quantity) {
  try {
    // 1. Get the current logged-in user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "unauthorized" };
    }

    await connectMongoDB();

    // 2. Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, error: "User not found" };

    // --- THE FIX: Initialize the cart if it doesn't exist for older users ---
    if (!user.cart) {
      user.cart = [];
    }

    // 3. Check if the product is already in the cart
    const existingItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // If it exists, add the new quantity to the existing quantity
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // If it's a new item, push it to the cart array
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    
    // Refresh the layout so the navbar cart icon (if you add one later) updates
    revalidatePath("/", "layout"); 
    
    return { success: true };
  } catch (error) {
    console.error("Cart error:", error);
    return { success: false, error: error.message };
  }
}

export async function getCart() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "unauthorized" };

    await connectMongoDB();
    
    // We use .populate('cart.product') to automatically fetch the full product details 
    // for every ID stored in the user's cart array.
    const user = await User.findOne({ email: session.user.email })
      .populate("cart.product")
      .lean();
    
    if (!user) return { success: false, error: "User not found" };

    return { 
      success: true, 
      cart: JSON.parse(JSON.stringify(user.cart || [])) 
    };
  } catch (error) {
    console.error("Fetch cart error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateCartQuantity(productId, newQuantity) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "unauthorized" };

    await connectMongoDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) return { success: false, error: "User not found" };

    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = newQuantity;
      await user.save();
      
      revalidatePath("/", "layout");
      return { success: true };
    }
    
    return { success: false, error: "Item not in cart" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Completely remove an item from the cart
export async function removeFromCart(productId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "unauthorized" };

    await connectMongoDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) return { success: false, error: "User not found" };

    // Filter out the item that matches the productId
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
"use server";

import { connectMongoDB } from "../lib/mongodb";
import User from "../models/User";
import Product from "../models/Product"; // Make sure Product is imported for population
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache"; // <-- NEW: Import revalidatePath

// 1. Fetch Cart
export async function getCart() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    await connectMongoDB();
    const user = await User.findOne({ email: session.user.email }).populate("cart.product").lean();
    
    if (!user) return { success: false, cart: [] };
    
    // Filter out any broken references (in case a product was deleted from the DB)
    const validCart = user.cart.filter(item => item.product != null);

    return { success: true, cart: JSON.parse(JSON.stringify(validCart)) };
  } catch (error) {
    console.error("Get cart error:", error);
    return { success: false, error: error.message };
  }
}

// 2. Add to Cart
export async function addToCart(productId, quantity = 1) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "unauthorized" };

    await connectMongoDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) return { success: false, error: "User not found" };

    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      // Item exists, just update the quantity
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      // New item, push to cart array
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    // --- THE FIX: Instantly forces the Navbar/Layout to refresh with new data ---
    revalidatePath("/", "layout"); 

    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, error: error.message };
  }
}

// 3. Remove from Cart
export async function removeFromCart(productId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "unauthorized" };

    await connectMongoDB();
    
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $pull: { cart: { product: productId } } }
    );

    // --- THE FIX: Refresh globally ---
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 4. Update Cart Quantity
export async function updateCartQuantity(productId, quantity) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "unauthorized" };

    await connectMongoDB();
    
    await User.findOneAndUpdate(
      { email: session.user.email, "cart.product": productId },
      { $set: { "cart.$.quantity": quantity } }
    );

    // --- THE FIX: Refresh globally ---
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
"use server";

import { connectMongoDB } from "../lib/mongodb";
import User from "../models/User";
import Product from "../models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function getCart() {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Not logged in" };

    const user = await User.findOne({ email: session.user.email }).populate({
      path: "cart.product",
      model: Product
    }).lean();

    if (!user) return { success: false, error: "User not found" };

    // Filter out null products (in case an admin deleted a product from the DB)
    const validCart = (user.cart || []).filter(item => item.product != null);
    
    return { success: true, cart: JSON.parse(JSON.stringify(validCart)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function addToCart(productId, quantity) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Not logged in" };

    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, error: "User not found" };

    // Safety check for older accounts
    if (!user.cart) user.cart = [];

    const cartItemIndex = user.cart.findIndex(item => item.product?.toString() === productId);

    if (cartItemIndex > -1) {
      // ITEM EXISTS: Safely add the new quantity to the existing quantity
      user.cart[cartItemIndex].quantity += Number(quantity);
    } else {
      // NEW ITEM: Push to cart
      user.cart.push({ product: productId, quantity: Number(quantity) });
    }

    // --- CRITICAL FIX: Tell Mongoose the array changed so it actually saves! ---
    user.markModified('cart');
    await user.save();

    // --- CRITICAL FIX: Force Next.js to refresh the UI everywhere ---
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, error: error.message };
  }
}

export async function removeFromCart(productId) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Not logged in" };

    await User.updateOne(
      { email: session.user.email },
      { $pull: { cart: { product: productId } } }
    );

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateCartQuantity(productId, newQuantity) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Not logged in" };

    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, error: "User not found" };

    if (!user.cart) user.cart = [];
    const cartItemIndex = user.cart.findIndex(item => item.product?.toString() === productId);
    
    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = Number(newQuantity);
      user.markModified('cart');
      await user.save();
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
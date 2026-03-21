"use server";

import { revalidatePath } from "next/cache";
import { connectMongoDB } from "../lib/mongodb"; // Adjust path if your lib folder is elsewhere
import Product from "../models/Product"; // Adjust path to your Product schema

// Fetch all products
export async function getProducts() {
  try {
    await connectMongoDB();
    // Fetch products, sort by newest, and convert to plain JS objects
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(products)); 
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

// Add or Edit a product
export async function saveProduct(formData) {
  try {
    await connectMongoDB();
    
    const id = formData.get("id");
    
    // Extract form data
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      category: formData.get("category"),
      stock: Number(formData.get("stock")),
      // For now, we take a single Image URL from an input and wrap it in an array
      images: [formData.get("image")], 
    };

    if (id) {
      // If an ID exists, we are EDITING
      await Product.findByIdAndUpdate(id, productData);
    } else {
      // If no ID, we are ADDING a new product
      await Product.create(productData);
    }

    // Tell Next.js to refresh the admin page and the shop page to show updates instantly
    revalidatePath("/admin/manage-products");
    revalidatePath("/shop");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to save product:", error);
    return { success: false, error: error.message };
  }
}

// Delete a product
export async function deleteProduct(id) {
  try {
    await connectMongoDB();
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/manage-products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false };
  }
}
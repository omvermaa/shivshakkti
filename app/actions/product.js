"use server";

import { revalidatePath } from "next/cache";
import { connectMongoDB } from "../lib/mongodb"; 
import Product from "../models/Product"; 

export async function getProducts() {
  try {
    await connectMongoDB();
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
    
    // Extract the regular price
    const price = Number(formData.get("price"));
    
    // --- NEW: Extract the discount. If left blank, default to the regular price ---
    const rawDiscount = formData.get("discountedPrice");
    const discountedPrice = rawDiscount ? Number(rawDiscount) : price;
    
    // Extract form data
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      
      // --- NEW: Save both prices to the database ---
      price: price,
      discountedPrice: discountedPrice,
      
      category: formData.get("category"),
      stock: Number(formData.get("stock")),
      
      // Parse the Featured Checkbox
      isFeatured: formData.get("isFeatured") === "true", 
      
      images: JSON.parse(formData.get("images") || "[]"), 
    };

    if (id) {
      // EDITING
      await Product.findByIdAndUpdate(id, productData);
    } else {
      // ADDING
      await Product.create(productData);
    }

    revalidatePath("/admin/manage-products");
    revalidatePath("/shop");
    revalidatePath("/"); // Also revalidate home in case a featured product was changed
    
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
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false };
  }
}
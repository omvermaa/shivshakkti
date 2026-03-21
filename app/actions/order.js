"use server";

import { connectMongoDB } from "../lib/mongodb";
import Order from "../models/Order";
import { revalidatePath } from "next/cache";

// Fetch all orders for the admin panel
export async function getAdminOrders() {
  try {
    await connectMongoDB();
    // Fetch orders and sort by newest first
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Update the delivery status
export async function updateDeliveryStatus(orderId, newStatus) {
  try {
    await connectMongoDB();
    await Order.findByIdAndUpdate(orderId, { deliveryStatus: newStatus });
    
    // Refresh the admin orders page to show the new status
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: error.message };
  }
}
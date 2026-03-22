"use server";

import { connectMongoDB } from "../lib/mongodb";
import Order from "../models/Order";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

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

export async function getUserOrders() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    await connectMongoDB();
    
    // Find orders where the customer's email matches the session email
    // .populate() grabs the product details (like images) if they still exist in the database
    const orders = await Order.find({ "customerDetails.email": session.user.email })
      .populate("items.product")
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    return { success: true, orders: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
}
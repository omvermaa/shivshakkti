"use server";

import { connectMongoDB } from "../lib/mongodb";
import User from "../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

// Securely fetch the logged-in user's profile
export async function getUserProfile() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    await connectMongoDB();
    const user = await User.findOne({ email: session.user.email }).lean();
    
    if (!user) return { success: false, error: "User not found" };

    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Securely update the profile details
export async function updateProfile(formData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    await connectMongoDB();
    
    // Construct the update object
    const updateData = {
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      }
    };

    // Update the database
    await User.findOneAndUpdate({ email: session.user.email }, updateData);
    
    // Refresh the layout so changes reflect everywhere immediately
    revalidatePath("/profile");
    revalidatePath("/", "layout"); 
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
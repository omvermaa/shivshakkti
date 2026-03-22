"use server";

import { revalidatePath } from "next/cache";
import { connectMongoDB } from "../lib/mongodb";
import Message from "../models/Message";

// 1. Submit a new message from the contact form
export async function submitMessage(formData) {
  try {
    await connectMongoDB();
    
    await Message.create({
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Message submission error:", error);
    return { success: false, error: "Failed to send message." };
  }
}

// 2. Fetch all messages for the Admin Panel
export async function getMessages() {
  try {
    await connectMongoDB();
    const messages = await Message.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    return [];
  }
}

// 3. Mark a message as Read/Unread
export async function toggleMessageStatus(id, currentStatus) {
  try {
    await connectMongoDB();
    const newStatus = currentStatus === "Unread" ? "Read" : "Unread";
    await Message.findByIdAndUpdate(id, { status: newStatus });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 4. Delete a message
export async function deleteMessage(id) {
  try {
    await connectMongoDB();
    await Message.findByIdAndDelete(id);
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
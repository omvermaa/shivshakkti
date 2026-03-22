"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { connectMongoDB } from "../lib/mongodb";
import Order from "../models/Order";
import User from "../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

// Initialize Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create a Razorpay Order
export async function createRazorpayOrder(amount) {
  try {
    const options = {
      amount: Math.round(amount * 100), // Razorpay strictly requires amount in paise (₹1 = 100 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error("Razorpay order error:", error);
    return { success: false, error: error.message };
  }
}

// 2. Verify Signature and Save to Database
export async function verifyAndSaveOrder(paymentData, shippingDetails, cartItems, totalAmount) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    // Verify Crypto Signature to prevent spoofing
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return { success: false, error: "Invalid payment signature" };
    }

    await connectMongoDB();

    // Format cart items for the Order model
    const items = cartItems.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // Format full address string
    const fullAddress = `${shippingDetails.street}, ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.zipCode}, ${shippingDetails.country}`;

    // Create the Order
    const newOrder = await Order.create({
      customerDetails: {
        name: shippingDetails.name,
        email: session.user.email,
        phone: shippingDetails.phone,
        address: fullAddress,
      },
      items,
      totalAmount,
      paymentMethod: "Prepaid",
      deliveryStatus: "Received",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    // Empty the user's cart now that they have bought the items
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { cart: [] } }
    );

    // Instantly refresh all relevant pages
    revalidatePath("/orders");
    revalidatePath("/admin/orders");
    revalidatePath("/", "layout");

    return { success: true, orderId: newOrder._id };
  } catch (error) {
    console.error("Order save error:", error);
    return { success: false, error: error.message };
  }
}
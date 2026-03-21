import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: Number,
        price: Number,
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "Prepaid"], required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    deliveryStatus: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending" },
    razorpayOrderId: { type: String }, // For Prepaid orders
    razorpayPaymentId: { type: String }, // For Prepaid orders
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
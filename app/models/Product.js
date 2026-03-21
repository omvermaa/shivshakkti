import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      // You can enforce strict categories here if you want
      enum: ["Tarot Decks", "Crystals", "Pendulums", "Incense", "Jewelry", "Other"], 
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    images: {
      type: [String], // Array of URLs pointing to your CDN (e.g., Cloudinary/AWS)
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false, // Useful for showing top items on the homepage
    }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
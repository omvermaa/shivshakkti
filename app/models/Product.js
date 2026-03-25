import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    
    // --- NEW: Discounted Price Logic ---
    discountedPrice: { 
      type: Number,
      default: function() {
        return this.price; // Automatically matches regular price if no discount is set
      }
    },

    images: { type: [String] },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
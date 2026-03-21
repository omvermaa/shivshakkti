import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String, // Google profile picture URL
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // You can add fields later for cart or saved items
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Prevent Next.js from recompiling the model every time the file is called
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getCart } from "../actions/cart";
import { getUserProfile } from "../actions/user";
import CheckoutForm from "./CheckoutForm";
import { Package } from "lucide-react";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/user-login");

  // Fetch cart and user profile concurrently
  const [cartRes, profileRes] = await Promise.all([
    getCart(),
    getUserProfile()
  ]);

  const cart = cartRes.success ? cartRes.cart : [];
  const user = profileRes.success ? profileRes.user : null;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-32 pb-12 flex flex-col items-center text-zinc-50">
        <Package className="w-16 h-16 text-zinc-700 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-zinc-500 mb-6">Add some mystical items to your cart before checking out.</p>
        <a href="/shop" className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md text-white font-medium transition">Return to Shop</a>
      </div>
    );
  }

  // Calculate Total
  const totalAmount = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-12 px-6 lg:px-12 text-zinc-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mb-8">Checkout</h1>
        <CheckoutForm 
          cart={cart} 
          user={user} 
          totalAmount={totalAmount} 
          razorpayKeyId={process.env.RAZORPAY_KEY_ID} 
        />
      </div>
    </div>
  );
}
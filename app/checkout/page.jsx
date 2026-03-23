import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getCart } from "../actions/cart";
import { getUserProfile } from "../actions/user";
import CheckoutForm from "./CheckoutForm";
import { Package } from "lucide-react";
import { connectMongoDB } from "../lib/mongodb";
import Product from "../models/Product";
import Link from "next/link";


export default async function CheckoutPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/user-login");

  // 1. Unwrap search parameters (Next.js 15 requirement)
  const resolvedParams = await searchParams;
  const buyNowId = resolvedParams?.buyNow;
  const buyNowQty = parseInt(resolvedParams?.qty) || 1;

  let checkoutItems = [];

  // 2. Fetch user profile
  const profileRes = await getUserProfile();
  const user = profileRes.success ? profileRes.user : null;

  // 3. Determine if we are doing a "Buy Now" or a standard "Cart Checkout"
  if (buyNowId) {
    // --- BUY NOW LOGIC (Bypasses Cart) ---
    await connectMongoDB();
    const singleProduct = await Product.findById(buyNowId).lean();

    if (singleProduct) {
      // Create a mock cart structure matching what CheckoutForm expects
      checkoutItems = [{
        product: {
          _id: singleProduct._id.toString(),
          name: singleProduct.name,
          price: singleProduct.price,
          images: singleProduct.images,
          category: singleProduct.category
        },
        quantity: buyNowQty
      }];
    }
  } else {
    // --- STANDARD CART LOGIC ---
    const cartRes = await getCart();
    checkoutItems = cartRes.success ? cartRes.cart : [];
  }

  // 4. Handle empty state
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-32 pb-12 flex flex-col items-center text-zinc-50">
        <Package className="w-16 h-16 text-zinc-700 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-zinc-500 mb-6">Add some mystical items to your cart before checking out.</p>
        <Link href="/shop" className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md text-white font-medium transition">Return to Shop</Link>
      </div>
    );
  }

  // 5. Calculate Total
  const totalAmount = checkoutItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-12 px-6 lg:px-12 text-zinc-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mb-8">Checkout</h1>
        <CheckoutForm 
          cart={checkoutItems} 
          user={user} 
          totalAmount={totalAmount} 
          razorpayKeyId={process.env.RAZORPAY_KEY_ID} 
        />
      </div>
    </div>
  );
}
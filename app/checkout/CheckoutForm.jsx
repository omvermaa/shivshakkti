"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createRazorpayOrder, verifyAndSaveOrder } from "../actions/checkout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Loader2, CheckCircle2, ShieldCheck, MapPin, LocateFixed } from "lucide-react";

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutForm({ cart, user, totalAmount, razorpayKeyId }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "India",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") value = value.replace(/\D/g, "").slice(0, 10);
    else if (name === "zipCode") value = value.replace(/\D/g, "").slice(0, 6);
    setFormData({ ...formData, [name]: value });
  };

  const handleAutofillLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          if (data && data.address) {
            const addr = data.address;
            const fetchedCity = addr.city || addr.town || addr.village || addr.state_district || "";
            const fetchedZip = addr.postcode ? addr.postcode.replace(/\D/g, "").slice(0, 6) : "";
            
            let fetchedState = addr.state || "";
            if (fetchedState.includes("Delhi")) fetchedState = "Delhi";
            
            const matchedState = indianStates.find(s => s.toLowerCase() === fetchedState.toLowerCase()) || "";

            setFormData(prev => ({
              ...prev,
              city: fetchedCity || prev.city,
              state: matchedState || prev.state,
              zipCode: fetchedZip || prev.zipCode,
            }));
          }
        } catch (error) {
          alert("Failed to fetch address details. Please fill manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        alert("Location access denied or unavailable. Please fill manually.");
        setIsLocating(false);
      }
    );
  };

  const isFormValid = Object.values(formData).every((val) => val.trim() !== "") 
                      && formData.phone.length === 10 
                      && formData.zipCode.length === 6;

  const handlePayment = async () => {
    setIsProcessing(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    const orderResponse = await createRazorpayOrder(totalAmount);
    if (!orderResponse.success) {
      alert("Failed to create order: " + orderResponse.error);
      setIsProcessing(false);
      return;
    }

    const options = {
      key: razorpayKeyId,
      amount: orderResponse.order.amount,
      currency: "INR",
      name: "ShivShakkti Tarot",
      description: "Mystical Items Purchase",
      order_id: orderResponse.order.id,
      prefill: {
        name: formData.name,
        email: user?.email || "",
        contact: formData.phone,
      },
      theme: { color: "#9333ea" },
      handler: async function (response) {
        const saveResult = await verifyAndSaveOrder(response, formData, cart, totalAmount);
        if (saveResult.success) {
          setIsSuccess(true);
          setTimeout(() => router.push("/orders"), 2000);
        } else {
          alert("Payment verification failed! Please contact support.");
          setIsProcessing(false);
        }
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      alert(response.error.description);
      setIsProcessing(false);
    });
    paymentObject.open();
  };

  if (isSuccess) {
    return (
      <Card className="bg-zinc-900 border-emerald-500/50 max-w-lg mx-auto py-12 text-center animate-in fade-in zoom-in duration-500">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">Order Placed Successfully!</h2>
        <p className="text-zinc-400 mb-6">Redirecting to your orders page...</p>
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center text-zinc-100">
                <MapPin className="w-5 h-5 mr-2 text-purple-400" />
                Shipping Details
              </CardTitle>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAutofillLocation}
              disabled={isLocating}
              className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs h-9"
            >
              {isLocating ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <LocateFixed className="w-3.5 h-3.5 mr-2 text-purple-400" />}
              Auto-fill
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" inputMode="numeric" value={formData.phone} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="street" className="text-zinc-300">Street Address</Label>
              <Input id="street" name="street" value={formData.street} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-zinc-300">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-zinc-300">State</Label>
                <select id="state" name="state" value={formData.state} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50">
                  <option value="" disabled>Select a state</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-zinc-300">ZIP / PIN Code</Label>
                <Input id="zipCode" name="zipCode" type="text" inputMode="numeric" value={formData.zipCode} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-zinc-300">Country</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} disabled className="bg-zinc-950 border-zinc-800 text-zinc-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800 sticky top-28">
          <CardHeader>
            <CardTitle className="text-zinc-100">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <div className="w-16 h-16 relative rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                    <Image src={item.product.images?.[0] || "/placeholder-image.jpg"} alt={item.product.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-zinc-100 line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm text-purple-400 font-semibold mt-1">₹{item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="text-emerald-400">Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-zinc-100 pt-3 border-t border-zinc-800">
                <span>Total</span>
                <span className="text-purple-400">₹{totalAmount}</span>
              </div>
            </div>

            <Button onClick={handlePayment} disabled={!isFormValid || isProcessing} className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50">
              {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : isFormValid ? <><ShieldCheck className="w-5 h-5" /> Pay ₹{totalAmount} via Razorpay</> : "Fill valid address to pay"}
            </Button>
            <p className="text-xs text-center text-zinc-500 flex items-center justify-center gap-1 mt-2">
              <ShieldCheck className="w-3 h-3" /> Secure checkout powered by Razorpay
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
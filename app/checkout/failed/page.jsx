"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function CheckoutFailedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redirect when countdown hits 0
    if (countdown === 0) {
      router.push("/checkout");
      return;
    }

    // Decrease timer every second
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-zinc-900 border border-rose-500/30 p-10 rounded-2xl max-w-md w-full shadow-2xl shadow-rose-500/10">
        
        <XCircle className="w-24 h-24 text-rose-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-zinc-100 mb-4">Payment Failed</h1>
        
        <p className="text-zinc-400 mb-8 leading-relaxed">
          We could not process your payment. This might be due to a network issue or insufficient funds. Do not worry, your cart is still saved!
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm text-zinc-500 font-medium flex items-center justify-center gap-2">
            Returning to checkout in <span className="text-rose-400 font-bold text-lg w-4">{countdown}</span> seconds...
          </div>
          
          <Button 
            onClick={() => router.push("/checkout")} 
            className="w-full bg-rose-600 hover:bg-rose-700 text-white mt-2"
          >
            Try Again Now
          </Button>
        </div>

      </div>
    </div>
  );
}
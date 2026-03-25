"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Home, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
// Add Confetti for that extra dopamine hit!
import Confetti from "react-confetti";
import { useEffect, useState, Suspense } from "react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  // Only run confetti on the client side to avoid hydration errors
  useEffect(() => {
    const updateDimension = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    // Use requestAnimationFrame to avoid setting state synchronously within the effect body
    const frameId = requestAnimationFrame(updateDimension);
    window.addEventListener("resize", updateDimension);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateDimension);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-32 pb-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Confetti Explosion! */}
      {windowDimension.width > 0 && (
        <Confetti 
          width={windowDimension.width} 
          height={windowDimension.height} 
          recycle={false} 
          numberOfPieces={400}
          colors={['#a855f7', '#d946ef', '#ec4899', '#fbcfe8']}
        />
      )}

      <div className="max-w-md w-full z-10 animate-in fade-in zoom-in duration-500">
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl shadow-purple-900/20 overflow-hidden relative">
          
          {/* Subtle glowing background effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />

          <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center text-center relative z-10">
            
            {/* Animated Checkmark */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-4 border-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-serif text-zinc-100 tracking-wide mb-3">
              Payment Successful!
            </h1>
            
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Your order has been received and your mystical artifacts are being prepared with positive intentions.
            </p>

            {/* Order Details Box */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 w-full mb-8 text-left">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Order Reference</p>
              <p className="text-purple-400 font-mono text-lg break-all">
                #{orderId || "Pending"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              <Link href="/orders" className="w-full block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-md gap-2">
                  <Package className="w-4 h-4" /> View Your Orders
                </Button>
              </Link>
              
              <Link href="/" className="w-full block">
                <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300 h-12 text-md gap-2">
                  <Home className="w-4 h-4" /> Return to Home
                </Button>
              </Link>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
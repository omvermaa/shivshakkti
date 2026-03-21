"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ShieldAlert, ArrowRight } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 1. Set up the automatic redirect after 5 seconds (5000ms)
    const redirectTimer = setTimeout(() => {
      router.push("/shop");
    }, 5000);

    // 2. Update the countdown number on the screen every second
    const intervalTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Cleanup timers if the user manually navigates away before 5 seconds
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(intervalTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-zinc-50">
      
      {/* Danger/Warning Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-zinc-900 border-rose-500/20 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Top colored accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-rose-600 to-rose-400"></div>
          
          <CardContent className="pt-10 pb-8 px-8 text-center flex flex-col items-center">
            
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-6">
              <ShieldAlert className="w-10 h-10 text-rose-500" />
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-2">
              Access Denied
            </h1>
            
            <p className="text-zinc-400 mb-8">
              The account you signed in with does not have administrator privileges.
            </p>

            <div className="w-full bg-zinc-950 rounded-lg p-4 border border-zinc-800 mb-6 flex flex-col items-center justify-center">
              <span className="text-sm text-zinc-500 mb-1">Redirecting to store in</span>
              <span className="text-3xl font-mono font-bold text-rose-400">{countdown}</span>
              <span className="text-xs text-zinc-500 mt-1">seconds</span>
            </div>

            <Button 
              asChild 
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium"
            >
              <Link href="/shop">
                Return to Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
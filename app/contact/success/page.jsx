"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function ContactSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Redirect when countdown hits 0
    if (countdown === 0) {
      router.push("/shop");
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
      <div className="bg-zinc-900 border border-emerald-500/30 p-10 rounded-2xl max-w-md w-full shadow-2xl shadow-emerald-500/10">
        <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-zinc-100 mb-4">Message Sent Successfully!</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Thank you for reaching out. We have received your cosmic inquiry and will contact you shortly.
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm text-zinc-500 font-medium flex items-center justify-center gap-2">
            Redirecting to homepage in <span className="text-purple-400 font-bold text-lg w-6">{countdown}</span> seconds...
          </div>
          
          <Button onClick={() => router.push("/shop")} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white mt-2">
            Return Home Now
          </Button>
        </div>
      </div>
    </div>
  );
}
import { Sparkles } from "lucide-react";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-50">
      {/* Mystical Spinning Rings */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-24 h-24 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        <div className="absolute w-16 h-16 border-r-2 border-l-2 border-purple-400/50 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
      </div>
      
      {/* Loading Text */}
      <h2 className="text-2xl font-serif tracking-[0.2em] text-zinc-100 uppercase animate-pulse mb-3">
        Entering the Realm
      </h2>
      <p className="text-zinc-500 tracking-wider text-sm">
        Gathering mystical artifacts...
      </p>
    </div>
  );
}
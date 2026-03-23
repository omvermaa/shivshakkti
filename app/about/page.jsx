import Image from "next/image";
import Link from "next/link";
import { Instagram, Sparkles, Moon, Sun } from "lucide-react";
import aboutImage from "./about.jpg";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20 px-6 lg:px-12 text-zinc-50">
      <div className="max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.1em] text-zinc-100 uppercase">
            About <span className="text-purple-500">ShivShakkti</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between the physical and the spiritual. We are dedicated to providing clarity, healing, and guidance through the ancient wisdom of Tarot and energy work.
          </p>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-purple-500/10">
            {/* Replace with an actual image of the client or a nice tarot aesthetic image from Cloudinary */}
            <Image 
              src={aboutImage} 
              alt="ShivShakkti Tarot Mystical Energy" 
              fill 
              className="object-cover opacity-80" 
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
                <Sun className="w-6 h-6 text-amber-400" />
                Our Philosophy
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                The name "ShivShakkti" represents the ultimate cosmic balance. Shiv is the pure consciousness, and Shakti is the dynamic energy that breathes life into the universe. Together, they form the foundation of our spiritual practice.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Whether you are seeking answers about love, career, or your spiritual path, our readings and carefully curated mystical items are designed to align your personal energy with the universe.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
                <Moon className="w-6 h-6 text-indigo-400" />
                The Collection
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Every crystal, tarot deck, and spiritual tool in our shop is energetically cleansed and intentionally selected to aid you on your journey. We believe that the tools you use should resonate with your highest self.
              </p>
            </div>
            
            <Link href="https://www.instagram.com/shivshakktitarot/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-medium hover:scale-105 transition-transform shadow-lg shadow-purple-500/25">
              <Instagram className="w-5 h-5" />
              Follow Our Journey
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
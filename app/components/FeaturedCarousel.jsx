"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay"; // <-- NEW: Imported Autoplay
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

export default function FeaturedCarousel({ featuredProducts }) {
  // --- NEW: Added Autoplay to the hook array ---
  // delay: 3500 means it swipes every 3.5 seconds
  // stopOnInteraction: false keeps it playing even after the user touches it
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  ]);

  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <div className="w-full mb-16">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl md:text-2xl font-serif tracking-wide text-zinc-100 uppercase">
          Featured Collections
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex gap-4">
          {featuredProducts.map((product) => (
            <div
              key={product._id}
              className="relative flex-[0_0_100%] sm:flex-[0_0_60%] md:flex-[0_0_48%] lg:flex-[0_0_33.33%] min-w-0"
            >
              <Link href={`/shop/${product._id}`}>
                <div className="relative h-72 md:h-80 w-full rounded-2xl overflow-hidden group border border-zinc-800 hover:border-purple-500/50 transition-colors">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
                    <div>
                      <Badge className="bg-purple-600 hover:bg-purple-700 text-white mb-2 shadow-lg shadow-purple-900/50 border-none">
                        Featured
                      </Badge>
                      <h3 className="text-xl font-bold text-zinc-100 line-clamp-1">
                        {product.name}
                      </h3>
                      {/* --- NEW: Smart Price Display --- */}
                      <div className="mt-2 flex items-center gap-2">
                        {/* The Main Price (Shows discount if it exists, otherwise shows regular) */}
                        <p
                          className={`font-semibold ${product.stock > 0 ? "text-purple-400" : "text-zinc-500"}`}
                        >
                          ₹
                          {product.discountedPrice &&
                          product.discountedPrice < product.price
                            ? product.discountedPrice
                            : product.price}
                        </p>

                        {/* The Slash Cut (ONLY renders if discountedPrice is less than regular price) */}
                        {product.discountedPrice &&
                          product.discountedPrice < product.price && (
                            <p className="text-xs text-zinc-500 line-through decoration-rose-500/70">
                              ₹{product.price}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-purple-600 transition-colors shrink-0 ml-4">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

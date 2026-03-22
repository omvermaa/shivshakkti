"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Card } from "./ui/card";

export default function ProductImageCarousel({ images, name }) {
  // 1. Embla setup for the main large carousel
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true, skipSnaps: false });
  // 2. Embla setup for the small thumbnail track
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sync index on main carousel scroll
  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  // Navigation handlers
  const scrollPrev = useCallback(() => emblaMainApi?.scrollPrev(), [emblaMainApi]);
  const scrollNext = useCallback(() => emblaMainApi?.scrollNext(), [emblaMainApi]);
  const onThumbClick = useCallback((index) => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    emblaMainApi.scrollTo(index);
  }, [emblaMainApi, emblaThumbsApi]);

  // Safety Fallback: No images
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600">
        <LayoutGrid className="w-12 h-12" />
      </div>
    );
  }

  // Safety Fallback: Only one image
  if (images.length === 1) {
    return (
      <div className="aspect-square relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl shadow-purple-500/5">
        <Image src={images[0]} alt={name} fill className="object-cover" unoptimized />
      </div>
    );
  }

  return (
    <div className="space-y-4 sticky top-28">
      
      {/* --- Main Large Carousel --- */}
      <div className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl shadow-purple-500/5">
        <div className="aspect-square overflow-hidden" ref={emblaMainRef}>
          <div className="flex h-full">
            {images.map((img, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full relative">
                <Image src={img} alt={`${name} - View ${index + 1}`} fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows (visible on hover) */}
        <button onClick={scrollPrev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/70 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-zinc-800/50 hover:bg-zinc-900">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={scrollNext} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/70 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-zinc-800/50 hover:bg-zinc-900">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Floating Index Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 rounded-full bg-black/50 backdrop-blur-sm">
          {images.map((_, index) => (
            <div key={index} className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? "bg-purple-500 w-4" : "bg-zinc-500"}`} />
          ))}
        </div>
      </div>

      {/* --- Clickable Thumbnails Track --- */}
      {/* We use a second embla carousel so the thumbnails themselves can scroll if there are too many */}
      <div className="overflow-hidden" ref={emblaThumbsRef}>
        <div className="flex gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
              className={`flex-[0_0_20%] sm:flex-[0_0_18%] min-w-0 aspect-square relative rounded-md overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-purple-600 shadow-md ring-2 ring-purple-600/30"
                  : "border-zinc-800 hover:border-zinc-700 opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumb ${index + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
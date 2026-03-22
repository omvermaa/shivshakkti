"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageCarousel({ images, name }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Main carousel setup
  const [mainViewportRef, emblaMainApi] = useEmblaCarousel({ loop: true });
  
  // Thumbnail carousel setup (dragFree allows smooth free-scrolling)
  const [thumbViewportRef, emblaThumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  // Handle clicking on a thumbnail to scroll the main carousel
  const onThumbClick = useCallback(
    (index) => {
      if (!emblaMainApi || !emblaThumbApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbApi]
  );

  // Sync thumbnail selection with the main carousel
  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  // Main arrow navigation
  const scrollPrev = useCallback(() => emblaMainApi && emblaMainApi.scrollPrev(), [emblaMainApi]);
  const scrollNext = useCallback(() => emblaMainApi && emblaMainApi.scrollNext(), [emblaMainApi]);

  // Fallback for no images
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <Image src="/placeholder-image.jpg" alt={name || "Product"} fill className="object-cover" unoptimized />
      </div>
    );
  }

  // Fallback for a single image
  if (images.length === 1) {
    return (
      <div className="aspect-square relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <Image src={images[0]} alt={name || "Product"} fill className="object-cover" unoptimized />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group" ref={mainViewportRef}>
        <div className="flex w-full h-full">
          {images.map((img, idx) => (
            <div key={idx} className="relative flex-[0_0_100%] w-full h-full min-w-0">
              <Image src={img} alt={`${name} - view ${idx + 1}`} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
        
        <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-purple-600 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-purple-600 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails Strip */}
      <div className="overflow-hidden" ref={thumbViewportRef}>
        <div className="flex gap-3">
          {images.map((img, idx) => (
            <button key={idx} onClick={() => onThumbClick(idx)} className={`relative flex-[0_0_22%] aspect-square rounded-xl overflow-hidden border-2 transition-all ${idx === selectedIndex ? "border-purple-500 opacity-100 shadow-[0_0_15px_rgba(147,51,234,0.3)]" : "border-zinc-800 opacity-50 hover:opacity-100 hover:border-zinc-600"}`}>
              <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
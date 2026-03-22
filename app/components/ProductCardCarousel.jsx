"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCardCarousel({ images, alt }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // We use e.preventDefault() to stop the <Link> wrapping the card from triggering when we just want to click the arrow!
  const scrollPrev = useCallback((e) => { e.preventDefault(); e.stopPropagation(); emblaApi?.scrollPrev(); }, [emblaApi]);
  const scrollNext = useCallback((e) => { e.preventDefault(); e.stopPropagation(); emblaApi?.scrollNext(); }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Fallback for no images
  if (!images || images.length === 0) {
    return <Image src="/placeholder-image.jpg" alt={alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />;
  }

  // Fallback for single image (no carousel needed)
  if (images.length === 1) {
    return <Image src={images[0]} alt={alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />;
  }

  return (
    <div className="relative w-full h-full group/carousel" ref={emblaRef}>
      <div className="flex w-full h-full">
        {images.map((img, idx) => (
          <div key={idx} className="relative flex-[0_0_100%] w-full h-full min-w-0">
            <Image src={img} alt={`${alt} - view ${idx + 1}`} fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows (Visible only on hover) */}
      <button onClick={scrollPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-purple-600 text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all z-10">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button onClick={scrollNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-purple-600 text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all z-10">
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {images.map((_, idx) => (
          <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === selectedIndex ? 'bg-purple-500 w-3' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
}
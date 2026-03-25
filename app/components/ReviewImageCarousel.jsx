"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

// Importing your static review images
import r1 from "../assets/r1.jpg";
import r2 from "../assets/r2.jpg";
import r3 from "../assets/r3.jpg";
import r4 from "../assets/r4.jpg";
import r5 from "../assets/r5.jpg";

export default function ReviewImageCarousel() {
  // dragFree allows for smooth, continuous swiping without snapping to a grid
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "center", dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const reviewImages = [r1, r2, r3, r4, r5];

  return (
    <div className="w-full mt-24 mb-10 pt-16 border-t border-zinc-800/50">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-zinc-100 mb-2">
          Love from the Realm
        </h2>
        <p className="text-zinc-400">Real experiences captured by our community</p>
      </div>

      {/* Added py-12 so the staggered images don't get their tops/bottoms cut off! */}
      <div className="overflow-hidden py-12" ref={emblaRef}>
        <div className="flex gap-6 px-4 items-center cursor-grab active:cursor-grabbing">
          {reviewImages.map((img, index) => {
            // Stagger Logic: Even indices go up, odd indices go down
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={index}
                className={`relative flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0 transition-transform duration-500 hover:z-10 hover:scale-[1.02] ${
                  isEven ? "-translate-y-6" : "translate-y-6"
                }`}
              >
                {/* 9/16 aspect ratio is perfect for standard phone screenshots */}
                <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden border border-zinc-800 shadow-xl shadow-purple-900/10 hover:border-purple-500/50 transition-colors">
                  <Image
                    src={img}
                    alt={`Customer Review ${index + 1}`}
                    fill
                    className="object-cover"
                    placeholder="blur" 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
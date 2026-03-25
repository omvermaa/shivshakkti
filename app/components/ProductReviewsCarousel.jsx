"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Star } from "lucide-react";

export default function ProductReviewsCarousel({ productName }) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })] 
  );

  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      // Authentic Indian Woman Portrait
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&auto=format&fit=crop",
      text: `I recently received my ${productName} and the energy is just beautiful. It genuinely feels so pure and perfectly aligned with my intentions!`,
      rating: 5,
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Rahul Verma",
      // Blank Profile Avatar (RV)
      avatar: "https://ui-avatars.com/api/?name=Rahul+Verma&background=27272a&color=a1a1aa",
      text: `The packaging was incredibly secure. The ${productName} looks stunning in person. Giving 4 stars only because delivery took a day longer than I expected.`,
      rating: 4, 
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Ananya Kapoor",
      // Authentic Indian Woman Portrait (Updated valid link)
      avatar: "https://img.freepik.com/premium-photo/beautiful-indian-woman-slightly-smiling-looking-camera-young-woman-with-beautiful-long-dark_1346048-70391.jpg?semt=ais_rp_50_assets&w=740&q=80",
      text: `Absolutely in love with it. You can actually feel the intention and positivity put into the ${productName}. Will definitely be ordering more items soon.`,
      rating: 5,
      date: "3 weeks ago"
    },
    {
      id: 4,
      name: "Vikram Desai",
      // Blank Profile Avatar (VD)
      avatar: "https://ui-avatars.com/api/?name=Vikram+Desai&background=27272a&color=a1a1aa",
      text: `The energy of the ${productName} is good, but it is slightly smaller than I imagined from the pictures. Still a very nice and authentic piece.`,
      rating: 3,
      date: "2 months ago"
    },
    {
      id: 5,
      name: "Kavya Menon",
      // Authentic Indian Woman Portrait
      avatar: "https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=200&h=200&auto=format&fit=crop",
      text: `I've bought a few mystical items online before, but the quality here is unmatched. The ${productName} exactly matches the description. Thank you!`,
      rating: 5,
      date: "1 week ago"
    }
  ];

  return (
    <div className="w-full mt-24 mb-10 pt-16 border-t border-zinc-800/50">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-zinc-100 mb-2">
          Voices of the Realm
        </h2>
        <p className="text-zinc-400">See what others are saying about this artifact</p>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 py-4">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
            >
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 h-full flex flex-col justify-between hover:border-purple-500/30 transition-colors shadow-sm">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'fill-purple-500 text-purple-500' : 'fill-zinc-800 text-zinc-700'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500">{review.date}</span>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">
                  "{review.text}"
                </p>

                <div className="flex items-center gap-3 mt-auto">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800">
                    <Image 
                      src={review.avatar} 
                      alt={review.name} 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{review.name}</p>
                    <p className="text-xs text-emerald-400 font-medium">Verified Buyer</p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Star } from "lucide-react";

export default function ProductReviewsCarousel({ productName }) {
  // Autoplays every 4 seconds, keeps playing even if user clicks
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })] 
  );

  // Dynamic reviews that inject the actual product name
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      avatar: "https://randomuser.me/api/portraits/women/43.jpg",
      text: `I recently received my ${productName} and the energy is just beautiful. It genuinely feels so pure and perfectly aligned with my intentions!`,
      rating: 5,
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Rahul Verma",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      text: `The packaging was incredibly secure and full of positive vibes. The ${productName} looks even more stunning in person. Highly recommend this shop!`,
      rating: 5,
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Ananya Kapoor",
      avatar: "https://randomuser.me/api/portraits/women/20.jpg",
      text: `Absolutely in love with it. You can actually feel the intention and positivity put into the ${productName}. Will definitely be ordering more items soon.`,
      rating: 5,
      date: "3 weeks ago"
    },
    {
      id: 4,
      name: "Vikram Desai",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: `Beautiful craftsmanship and powerful energy. The ${productName} exactly matches the description. Delivery was also faster than expected!`,
      rating: 5,
      date: "2 months ago"
    },
    {
      id: 5,
      name: "Kavya Menon",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      text: `I've bought a few mystical items online before, but the ${productName} is by far my favorite. The quality is unmatched. Thank you so much!`,
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
                
                {/* Stars & Date */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-purple-500 text-purple-500" />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500">{review.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">
                  "{review.text}"
                </p>

                {/* Customer Profile */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-700">
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
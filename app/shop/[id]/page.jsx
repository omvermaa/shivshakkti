
"use client"
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import crystal from "../../assets/Amethyst Crystal Cluster.webp"

// Mock database for all products
const allProducts = [
  {
    id: "1",
    name: "Amethyst Crystal Cluster",
    price: 1200,
    category: "Crystals",
    description: "This stunning Amethyst crystal cluster radiates calming energy. Perfect for your meditation altar or as a protective piece for your living space. Sourced ethically and cleansed under the full moon.",
    stock: 5,
    image: crystal
  },
  { id: "2", name: "The Rider-Waite Tarot Deck", price: 850, category: "Tarot Decks", image: "https://images.unsplash.com/photo-1633421118129-87d2511470ce?auto=format&fit=crop&q=80&w=500" },
  { id: "3", name: "Clear Quartz Pendulum", price: 450, category: "Pendulums", image: "https://images.unsplash.com/photo-1597931350692-0b13503a46fb?auto=format&fit=crop&q=80&w=500" },
  { id: "4", name: "Sage Smudge Stick", price: 250, category: "Incense", image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=500" },
  { id: "5", name: "Rose Quartz Heart", price: 600, category: "Crystals", image: "https://images.unsplash.com/photo-1602173574767-37ac01994b4a?auto=format&fit=crop&q=80&w=500" },
  { id: "6", name: "Citrine Raw Point", price: 900, category: "Crystals", image: "https://images.unsplash.com/photo-1597931350692-0b13503a46fb?auto=format&fit=crop&q=80&w=500" }
];

export default function ProductPage({ params }) {
  const currentId = params?.id || "1";
  
  // 1. Fetch the product using the ID from params
  const product = allProducts.find(p => p.id === currentId) || allProducts[0];

  // 2. Automatically find related products dynamically
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4); // Limit to 4 related products

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 pb-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/shop" className="inline-flex items-center text-sm text-zinc-400 hover:text-purple-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        {/* --- Main Product Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-24">
          <div className="aspect-square relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <Image 
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <Badge className="w-fit bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 mb-4 border-0">
              {product.category}
            </Badge>
            
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
              {product.name}
            </h1>
            
            <p className="text-2xl font-semibold text-purple-400 mb-6">
              ₹{product.price}
            </p>

            <Separator className="bg-zinc-800 mb-6" />

            <div className="prose prose-invert mb-8">
              <p className="text-zinc-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-zinc-400 mb-4">
                <div className={`w-2 h-2 rounded-full mr-2 ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </div>

              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white gap-2"
                disabled={product.stock === 0}
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-zinc-500 border-t border-zinc-800 pt-8">
              <div>
                <strong className="block text-zinc-300 mb-1">Shipping</strong>
                Ships within 2-3 business days across India.
              </div>
              <div>
                <strong className="block text-zinc-300 mb-1">Authenticity</strong>
                100% genuine products, ethically sourced.
              </div>
            </div>
          </div>
        </div>

        {/* --- You May Also Like Section (Manual Carousel) --- */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-8">You May Also Like</h2>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {relatedProducts.map((item) => (
                <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Link href={`/shop/${item.id}`} className="group block h-full">
                    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
                      <div className="aspect-square relative overflow-hidden bg-zinc-800 flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <Badge variant="outline" className="text-zinc-400 border-zinc-700 mb-3 text-xs">
                            {item.category}
                          </Badge>
                          <h3 className="font-medium text-zinc-100 mb-1 line-clamp-1">{item.name}</h3>
                        </div>
                        <p className="text-purple-400 font-semibold mt-2">₹{item.price}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation buttons: hidden on very small screens, visible on hover/sm+ */}
            <CarouselPrevious className="hidden sm:flex -left-4 md:-left-12 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-purple-500/50 transition-all" />
            <CarouselNext className="hidden sm:flex -right-4 md:-right-12 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-purple-500/50 transition-all" />
          </Carousel>
        </div>

      </div>
    </div>
  );
}
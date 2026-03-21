import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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

// Import Database connection and Product model
import { connectMongoDB } from "../../lib/mongodb";
import Product from "../../models/Product";
import AddToCart from "../../components/AddToCart";

export default async function ProductPage({ params }) {
  // 1. Await the params object (Required in Next.js 15+)
  const { id } = await params;

  // 2. Connect to the database
  await connectMongoDB();

  // 3. Fetch the specific product using the ID from the URL
  let product;
  try {
    product = await Product.findById(id).lean();
  } catch (error) {
    // If the ID format is invalid, Mongoose throws an error. Catch it and show 404.
    return notFound();
  }

  // If no product is found in the database, trigger the 404 page
  if (!product) {
    return notFound();
  }

  // 4. Fetch Dynamic Related Products (Same category, excluding the current product)
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id } // Do not show the current product in the recommendations
  })
    .limit(5)
    .lean();

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
              src={product.images?.[0] || "/placeholder-image.jpg"}
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
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* <div className="space-y-4">
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
            </div> */}

            <AddToCart 
              productId={product._id.toString()} 
              stock={product.stock} 
            />
            
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

        {/* --- Dynamic You May Also Like Section --- */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-8">You May Also Like</h2>
            
            <Carousel
              opts={{
                align: "start",
                loop: false, // Turned off looping in case there are only 1-2 related items
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {relatedProducts.map((item) => (
                  <CarouselItem key={item._id.toString()} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <Link href={`/shop/${item._id.toString()}`} className="group block h-full">
                      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-square relative overflow-hidden bg-zinc-800 flex-shrink-0">
                          <Image 
                            src={item.images?.[0] || "/placeholder-image.jpg"} 
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
              
              <CarouselPrevious className="hidden sm:flex -left-4 md:-left-12 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-purple-500/50 transition-all" />
              <CarouselNext className="hidden sm:flex -right-4 md:-right-12 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-purple-500/50 transition-all" />
            </Carousel>
          </div>
        )}

      </div>
    </div>
  );
}
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default async function ProductPage({ params }) {
  const { id } = await params;
  // In reality, fetch the product from MongoDB using id
  const product = {
    id: id,
    name: "Amethyst Crystal Cluster",
    price: 1200,
    category: "Crystals",
    description: "This stunning Amethyst crystal cluster radiates calming energy. Perfect for your meditation altar or as a protective piece for your living space. Sourced ethically and cleansed under the full moon.",
    stock: 5,
    image: "https://images.unsplash.com/photo-1587245937293-b0510ee4c2bb?auto=format&fit=crop&q=80&w=800"
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/shop" className="inline-flex items-center text-sm text-zinc-400 hover:text-purple-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="aspect-square relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <Image 
              // src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
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
            
            {/* Delivery / Extra Info */}
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
      </div>
    </div>
  );
}
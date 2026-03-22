import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// --- UPDATED IMPORT ---
import ProductImageCarousel from "../../components/ProductImageCarousel";
import { connectMongoDB } from "../../lib/mongodb";
import Product from "../../models/Product";
import AddToCart from "../../components/AddToCart"; // assuming this exists
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Truck, ShieldCheck, Tag } from "lucide-react";

export default async function ProductPage({ params }) {
  await connectMongoDB();

  const resolvedParams = await params;
  
  const product = await Product.findById(resolvedParams.id).lean();

  if (!product) {
    notFound();
  }

  // Double-check images is an array, fallback to placeholder if empty
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["/placeholder-product.jpg"];

  // Format description into paragraphs based on newlines
  const descriptionParagraphs = product.description.split('\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-16 px-6 lg:px-12 text-zinc-50 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm text-zinc-500 mb-8 tracking-wide">
          <Link href="/shop" className="hover:text-purple-400">Shop Now</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-300 capitalize">{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-zinc-100 font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          
          {/* --- LEFT COLUMN: New Carousel --- */}
          <div>
            <ProductImageCarousel images={images} name={product.name} />
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="space-y-8">
            <div className="space-y-3">
              <Badge variant="outline" className="text-purple-400 border-purple-900/50 bg-purple-950/30 px-3 py-1 text-xs">
                <Tag className="w-3.5 h-3.5 mr-1.5" />
                {product.category}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-zinc-100 leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-emerald-400 tracking-tight">₹{product.price}</p>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <p className="text-zinc-400">Availability:</p>
                {product.stock > 0 ? (
                  <Badge className="bg-emerald-600 text-white border-emerald-500">{product.stock} in stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              
              <AddToCart product={JSON.parse(JSON.stringify(product))} />
            </div>

            <Separator className="bg-zinc-800" />

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">Product Details</h3>
              <div className="prose prose-zinc prose-invert prose-sm text-zinc-300 leading-relaxed max-w-none">
                {descriptionParagraphs.map((para, index) => (
                  <p key={index} className="mb-4 last:mb-0">{para}</p>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-2 gap-4">
               <div className="flex items-start gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <Truck className="w-8 h-8 text-purple-500 shrink-0" />
                  <div>
                     <h4 className="font-semibold text-zinc-100 text-sm">Pan India Shipping</h4>
                     <p className="text-xs text-zinc-400 mt-1">Delivery within 5-7 working days.</p>
                  </div>
               </div>
               <div className="flex items-start gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <ShieldCheck className="w-8 h-8 text-purple-500 shrink-0" />
                  <div>
                     <h4 className="font-semibold text-zinc-100 text-sm">Secure Packaging</h4>
                     <p className="text-xs text-zinc-400 mt-1">Carefully packed mystical items.</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
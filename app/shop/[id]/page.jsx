import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductImageCarousel from "../../components/ProductImageCarousel";
import ProductCardCarousel from "../../components/ProductCardCarousel"; // <-- NEW: Reusing your mini carousel for the related grid
import { connectMongoDB } from "../../lib/mongodb";
import Product from "../../models/Product";
import AddToCart from "../../components/AddToCart"; 
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card"; // <-- NEW: Reusing the card UI
import { Truck, ShieldCheck, Tag, Sparkles } from "lucide-react"; // <-- NEW: Added Sparkles icon

export default async function ProductPage({ params }) {
  await connectMongoDB();

  const resolvedParams = await params;
  
  // Fetch current product
  const product = await Product.findById(resolvedParams.id).lean();

  if (!product) {
    notFound();
  }

  // --- NEW: Fetch Related Products ---
  // Find up to 4 products in the same category, EXCLUDING the current product
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id } // $ne means "not equal to"
  })
  .limit(4)
  .lean();

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

        {/* Main Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          
          {/* Left Column: Large Carousel */}
          <div>
            <ProductImageCarousel images={images} name={product.name} />
          </div>

          {/* Right Column: Product Details */}
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
                  <Badge variant="destructive" className="bg-rose-500">Out of Stock</Badge>
                )}
              </div>
              
              <AddToCart productId={product._id.toString()} stock={product.stock} />
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

        {/* --- NEW: More Like This Section --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-zinc-800/50">
            <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-zinc-100 uppercase mb-8 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-500" />
              More Like This
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link href={`/shop/${related._id.toString()}`} key={related._id.toString()} className="group cursor-pointer">
                  <Card className={`bg-zinc-900 border-zinc-800 overflow-hidden transition-all duration-300 h-full flex flex-col ${related.stock > 0 ? 'hover:border-purple-500/50' : 'opacity-75 grayscale-[0.5]'}`}>
                    
                    <div className="aspect-square relative overflow-hidden bg-zinc-800 flex-shrink-0">
                      <ProductCardCarousel images={related.images} alt={related.name} />
                      
                      {related.stock <= 0 && (
                        <div className="absolute top-3 right-3 z-10 pointer-events-none">
                          <Badge className="bg-rose-500 text-white shadow-lg border-none px-3 py-1 font-bold tracking-wider uppercase text-[10px]">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5 flex flex-col flex-grow justify-between relative">
                      <div>
                        <Badge variant="outline" className="text-zinc-400 border-zinc-700 mb-3 text-xs">
                          {related.category}
                        </Badge>
                        <h3 className="font-medium text-zinc-100 mb-1 line-clamp-1">{related.name}</h3>
                      </div>
                      
                      <p className={`font-semibold mt-2 ${related.stock > 0 ? 'text-purple-400' : 'text-zinc-500'}`}>
                        ₹{related.price}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
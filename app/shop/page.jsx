import Link from "next/link";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import PriceFilter from "../components/PriceFilter"; 
import SearchAutocomplete from "../components/SearchAutocomplete";
import ProductCardCarousel from "../components/ProductCardCarousel"; 
import FeaturedCarousel from "../components/FeaturedCarousel";
import MobileFilterWrapper from "../components/MobileFilterWrapper";
import { Sparkles, Compass, ArrowLeft } from "lucide-react"; // <-- NEW: Imported ArrowLeft

import { connectMongoDB } from "../lib/mongodb";
import Product from "../models/Product";

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }) {
  await connectMongoDB();

  const params = await searchParams;
  
  const currentCategory = params.category ? decodeURIComponent(params.category) : 'all';
  const currentMaxPrice = params.maxPrice ? Number(params.maxPrice) : 1000; 

  const query = {};

  if (params.q) {
    query.name = { $regex: params.q, $options: "i" };
  }

  if (currentCategory !== 'all') {
    // Case-insensitive exact match for category
    query.category = { $regex: new RegExp(`^${currentCategory}$`, "i") };
  }

  if (params.maxPrice) {
    query.price = { $lte: currentMaxPrice };
  }

  const categories = ['All', 'Spell Jars', 'Crystals', 'Incense', 'Jewellery', 'Bath Salts', 'Other'];

  // Performance & UX Logic
  // If they are on "All" and haven't searched for anything, prompt them to pick a category
  const showCategoryPrompt = currentCategory === 'all' && !params.q;

  // ONLY fetch products if we are not showing the prompt (saves database bandwidth!)
  let products = [];
  if (!showCategoryPrompt) {
    products = await Product.find(query).lean();
  }

  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  
  const allProductsForSearch = await Product.find({}, { name: 1, images: 1, category: 1, price: 1 }).lean();
  const searchSuggestions = allProductsForSearch.map(p => ({ 
    _id: p._id.toString(), 
    name: p.name, 
    images: p.images, 
    category: p.category, 
    price: p.price 
  }));

  const serializedFeatured = JSON.parse(JSON.stringify(featuredProducts));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Featured Products Carousel */}
        <FeaturedCarousel featuredProducts={serializedFeatured} />

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <MobileFilterWrapper>
            
            {/* --- NEW: Conditional Back Button instead of Categories List --- */}
            {currentCategory !== 'all' && (
              <div className="mb-8">
                <Link 
                  href={`/shop?maxPrice=${currentMaxPrice}`}
                  className="flex items-center justify-center md:justify-start gap-3 text-sm font-medium text-zinc-300 hover:text-purple-400 transition-colors bg-zinc-900/50 px-5 py-3 rounded-xl border border-zinc-800 hover:border-purple-500/50 w-full shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Explore Other Realms
                </Link>
              </div>
            )}

            {/* Price Filter always remains */}
            <div>
              <PriceFilter initialPrice={currentMaxPrice} />
            </div>
            
          </MobileFilterWrapper>

          {/* Main Content Grid */}
          <main className="flex-1">
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <SearchAutocomplete 
                initialQuery={params.q || ""} 
                currentCategory={currentCategory} 
                currentMaxPrice={currentMaxPrice} 
                suggestions={searchSuggestions} 
              />
            </div>

            {/* Category Selection Screen OR Product Grid */}
            {showCategoryPrompt ? (
              <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Compass className="w-12 h-12 text-purple-500 mb-6 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-serif tracking-wide text-zinc-100 uppercase mb-4 flex items-center gap-3">
                  Explore Our Realms
                </h2>
                <p className="text-zinc-400 mb-12 max-w-lg mx-auto text-lg">
                  Select a category to view our mystical artifacts and offerings.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
                  {categories.filter(c => c !== 'All').map(cat => (
                    <Link
                      key={cat}
                      href={`/shop?category=${cat.toLowerCase()}&maxPrice=${currentMaxPrice}`}
                      className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 flex flex-col items-center justify-center group shadow-md"
                    >
                      <span className="text-zinc-300 group-hover:text-purple-300 font-medium tracking-wide text-center">
                        {cat}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
                <p>No mystical items found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link href={`/shop/${product._id.toString()}`} key={product._id.toString()} className="group cursor-pointer">
                    <Card className={`bg-zinc-900 border-zinc-800 overflow-hidden transition-all duration-300 h-full flex flex-col ${product.stock > 0 ? 'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20' : 'opacity-75 grayscale-[0.5]'}`}>
                      
                      <div className="aspect-square relative overflow-hidden bg-zinc-800 flex-shrink-0">
                        <ProductCardCarousel images={product.images} alt={product.name} />
                        
                        {product.stock <= 0 && (
                          <div className="absolute top-3 right-3 z-10 pointer-events-none">
                            <Badge className="bg-rose-500 text-white hover:bg-rose-600 shadow-lg border-none px-3 py-1 font-bold tracking-wider uppercase text-[10px]">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-5 flex flex-col flex-grow justify-between relative">
                        <div>
                          <Badge variant="outline" className="text-zinc-400 border-zinc-700 mb-3 text-xs">
                            {product.category}
                          </Badge>
                          <h3 className="font-medium text-zinc-100 mb-1 line-clamp-1">{product.name}</h3>
                        </div>
                        
                        <p className={`font-semibold mt-2 ${product.stock > 0 ? 'text-purple-400' : 'text-zinc-500'}`}>
                          ₹{product.price}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
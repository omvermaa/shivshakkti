import Link from "next/link";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import PriceFilter from "../components/PriceFilter"; 
import SearchAutocomplete from "../components/SearchAutocomplete";
import ProductCardCarousel from "../components/ProductCardCarousel"; 
import FeaturedCarousel from "../components/FeaturedCarousel";
import MobileFilterWrapper from "../components/MobileFilterWrapper";

import { connectMongoDB } from "../lib/mongodb";
import Product from "../models/Product";

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }) {
  await connectMongoDB();

  // Await search params for Next.js 15+ compatibility
  const params = await searchParams;
  
  const currentCategory = params.category ? decodeURIComponent(params.category) : 'all';
  const currentMaxPrice = params.maxPrice ? Number(params.maxPrice) : 5000; 

  const query = {};

  if (params.q) {
    query.name = { $regex: params.q, $options: "i" };
  }

  if (currentCategory !== 'all') {
    const categoryMap = {
      'tarot decks': 'Tarot Decks',
      'crystals': 'Crystals',
      'pendulums': 'Pendulums',
      'incense': 'Incense',
      'jewelry': 'Jewelry',
      'other': 'Other'
    };
    query.category = categoryMap[currentCategory.toLowerCase()] || currentCategory;
  }

  if (params.maxPrice) {
    query.price = { $lte: currentMaxPrice };
  }

  // Fetch data
  const products = await Product.find(query).lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  
  const categories = ['All', 'Spell Jars', 'Oils', 'Crystals', 'Incense', 'Jewellery', 'Bath Salts', 'Other'];
  
  const allProductsForSearch = await Product.find({}, { name: 1, images: 1, category: 1, price: 1 }).lean();
  const searchSuggestions = allProductsForSearch.map(p => ({ 
    _id: p._id.toString(), 
    name: p.name, 
    images: p.images, 
    category: p.category, 
    price: p.price 
  }));

  // Clean IDs for Client Components
  const serializedFeatured = JSON.parse(JSON.stringify(featuredProducts));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Featured Products Carousel - Takes full width at the top */}
        <FeaturedCarousel featuredProducts={serializedFeatured} />

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters - Wrapped in Mobile Toggle for clean mobile UI */}
          <MobileFilterWrapper>
            <div>
              <h2 className="text-lg font-semibold tracking-wide text-zinc-100 mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isActive = (cat === 'All' && currentCategory === 'all') || 
                                   (currentCategory.toLowerCase() === cat.toLowerCase());
                  
                  const targetUrl = cat === 'All' 
                    ? `/shop?maxPrice=${currentMaxPrice}` 
                    : `/shop?category=${cat.toLowerCase()}&maxPrice=${currentMaxPrice}`;

                  return (
                    <Link 
                      key={cat} 
                      href={targetUrl}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                        isActive
                          ? "bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.2)]"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                      }`}
                    >
                      {cat}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
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

            {products.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
                <p>No mystical items found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link href={`/shop/${product._id.toString()}`} key={product._id.toString()} className="group cursor-pointer">
                    <Card className={`bg-zinc-900 border-zinc-800 overflow-hidden transition-all duration-300 h-full flex flex-col ${product.stock > 0 ? 'hover:border-purple-500/50' : 'opacity-75 grayscale-[0.5]'}`}>
                      
                      <div className="aspect-square relative overflow-hidden bg-zinc-800 flex-shrink-0">
                        {/* Mini Carousel */}
                        <ProductCardCarousel images={product.images} alt={product.name} />
                        
                        {/* Out of Stock Badge */}
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
                        
                        {/* Dynamic price color based on stock */}
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
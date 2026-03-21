import Link from "next/link";
import Image from "next/image";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";

// Import your database utilities
import { connectMongoDB } from "../lib/mongodb";
import Product from "../models/Product";

export default async function ShopPage({ searchParams }) {
  // 1. Connect to the database
  await connectMongoDB();

  // 2. Build the dynamic search query based on the URL parameters
  const query = {};

  // Text Search
  if (searchParams.q) {
    query.name = { $regex: searchParams.q, $options: "i" }; // Case-insensitive search
  }

  // Category Filter
  if (searchParams.category && searchParams.category !== 'all') {
    // Re-capitalize to match your strict enum schema (e.g., "tarot decks" -> "Tarot Decks")
    const categoryMap = {
      'tarot decks': 'Tarot Decks',
      'crystals': 'Crystals',
      'pendulums': 'Pendulums',
      'incense': 'Incense',
      'jewelry': 'Jewelry',
      'other': 'Other'
    };
    query.category = categoryMap[searchParams.category.toLowerCase()] || searchParams.category;
  }

  // Price Filter (assuming you pass maxPrice in the URL from your slider)
  if (searchParams.maxPrice) {
    query.price = { $lte: Number(searchParams.maxPrice) };
  }

  // 3. Fetch real products from MongoDB
  // We use .lean() to convert Mongoose documents into pure JavaScript objects, 
  // which makes rendering them much faster in Next.js.
  const products = await Product.find(query).lean();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h2 className="text-lg font-semibold tracking-wide text-zinc-100 mb-4">Categories</h2>
            <div className="space-y-2 flex flex-col">
              {['All', 'Tarot Decks', 'Crystals', 'Pendulums', 'Incense', 'Jewelry'].map((cat) => (
                <Link 
                  key={cat} 
                  href={cat === 'All' ? '/shop' : `/shop?category=${cat.toLowerCase()}`}
                  className="text-zinc-400 hover:text-purple-400 transition-colors text-sm text-left"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-wide text-zinc-100 mb-4">Max Price (₹)</h2>
            <Slider 
              defaultValue={[5000]} 
              max={10000} 
              step={100} 
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>₹0</span>
              <span>₹10000</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <Input 
              type="text" 
              defaultValue={searchParams.q || ""}
              placeholder="Search for mystical items..." 
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
            />
            <Button className="bg-purple-600 hover:bg-purple-700 text-white shrink-0">
              Search
            </Button>
          </div>

          {/* Real Product Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              <p>No mystical items found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                // We use product._id.toString() because MongoDB IDs are special objects
                <Link href={`/shop/${product._id.toString()}`} key={product._id.toString()} className="group cursor-pointer">
                  <Card className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden bg-zinc-800">
                      <Image 
                        // Assuming you save the first image URL in the `images` array
                        src={product.images?.[0] || "/placeholder-image.jpg"} 
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-5">
                      <Badge variant="outline" className="text-zinc-400 border-zinc-700 mb-3 text-xs">
                        {product.category}
                      </Badge>
                      <h3 className="font-medium text-zinc-100 mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-purple-400 font-semibold">₹{product.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
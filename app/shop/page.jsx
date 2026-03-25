import Link from "next/link";
import Image from "next/image"; // <-- NEW: Imported Next.js Image
import { Suspense } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import PriceFilter from "../components/PriceFilter";
import SearchAutocomplete from "../components/SearchAutocomplete";
import ProductCardCarousel from "../components/ProductCardCarousel";
import FeaturedCarousel from "../components/FeaturedCarousel";
import MobileFilterWrapper from "../components/MobileFilterWrapper";
import { Sparkles, Compass, ArrowLeft } from "lucide-react";
import Spray from "@/app/assets/spray.webp";
import spellJar from "@/app/assets/spelljars.webp";
import oil from "@/app/assets/oils.webp";
import crystal from "@/app/assets/crystals.webp";
import bracelets from "@/app/assets/bracelets.webp";
import bathSalt from "@/app/assets/bathsalts.webp";

import { connectMongoDB } from "../lib/mongodb";
import Product from "../models/Product";

export const dynamic = "force-dynamic";

const ABSOLUTE_MAX_PRICE = 1000;

// ==========================================
// 1. MAIN PAGE SHELL (Loads Instantly)
// ==========================================
export default async function ShopPage({ searchParams }) {
  await connectMongoDB();

  const params = await searchParams;

  const currentCategory = params.category
    ? decodeURIComponent(params.category)
    : "all";
  const currentMaxPrice = params.maxPrice
    ? Number(params.maxPrice)
    : ABSOLUTE_MAX_PRICE;
  const searchQuery = params.q || "";

  const showCategoryPrompt = currentCategory === "all" && !searchQuery;

  // --- NEW: Category Cards Array with High-Quality Placeholders ---
  const categoryCards = [
    { name: "Spell Jars", image: spellJar.src },
    { name: "Oils", image: oil.src },
    { name: "Crystals", image: crystal.src },
    { name: "Spray", image: Spray.src },
    { name: "Jewellery", image: bracelets.src },
    { name: "Bath Salts", image: bathSalt.src },
    {
      name: "Other",
      image:
        "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  const allProductsForSearch = await Product.find(
    {},
    { name: 1, images: 1, category: 1, price: 1 },
  ).lean();

  const searchSuggestions = allProductsForSearch.map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    images: p.images,
    category: p.category,
    price: p.price,
  }));

  const serializedFeatured = JSON.parse(JSON.stringify(featuredProducts));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <FeaturedCarousel featuredProducts={serializedFeatured} />

        <div className="flex flex-col md:flex-row gap-8">
          <MobileFilterWrapper>
            {currentCategory !== "all" && (
              <div className="mb-8">
                <Link
                  href={`/shop?maxPrice=${ABSOLUTE_MAX_PRICE}`}
                  className="flex items-center justify-center md:justify-start gap-3 text-sm font-medium text-zinc-300 hover:text-purple-400 transition-colors bg-zinc-900/50 px-5 py-3 rounded-xl border border-zinc-800 hover:border-purple-500/50 w-full shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Explore Other Realms
                </Link>
              </div>
            )}
            <div>
              <PriceFilter initialPrice={currentMaxPrice} />
            </div>
          </MobileFilterWrapper>

          <main className="flex-1">
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <SearchAutocomplete
                initialQuery={searchQuery}
                currentCategory={currentCategory}
                currentMaxPrice={currentMaxPrice}
                suggestions={searchSuggestions}
              />
            </div>

            {showCategoryPrompt ? (
              <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Compass className="w-10 h-10 text-purple-500 mb-6 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-serif tracking-wide text-zinc-100 uppercase mb-4">
                  Explore Our Realms
                </h2>
                <p className="text-zinc-400 mb-12 max-w-lg mx-auto text-lg">
                  Select a category to view our mystical artifacts and
                  offerings.
                </p>

                {/* --- NEW: Beautiful Image Category Cards Grid --- */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mx-auto">
                  {categoryCards.map((cat) => (
                    <Link
                      key={cat.name}
                      href={`/shop?category=${cat.name.toLowerCase()}&maxPrice=${ABSOLUTE_MAX_PRICE}`}
                      className="group relative flex flex-col items-center justify-end rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-purple-500 transition-all duration-500 shadow-md hover:shadow-purple-900/20 aspect-[4/5] sm:aspect-square"
                    >
                      {/* Background Image */}
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-40"
                        unoptimized
                      />

                      {/* Dark Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                      {/* Category Title */}
                      <div className="relative z-10 w-full p-5 text-center">
                        <span className="text-zinc-100 group-hover:text-purple-300 font-serif text-xl md:text-2xl tracking-wide drop-shadow-lg transition-colors">
                          {cat.name}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Suspense fallback={<GridLoadingSkeleton />}>
                <ProductGrid
                  currentCategory={currentCategory}
                  currentMaxPrice={currentMaxPrice}
                  searchQuery={searchQuery}
                />
              </Suspense>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. ASYNC PRODUCT GRID (Runs in background)
// ==========================================
async function ProductGrid({ currentCategory, currentMaxPrice, searchQuery }) {
  await connectMongoDB();

  const query = {};
  if (searchQuery) query.name = { $regex: searchQuery, $options: "i" };
  if (currentCategory !== "all")
    query.category = { $regex: new RegExp(`^${currentCategory}$`, "i") };

  if (currentMaxPrice < ABSOLUTE_MAX_PRICE) {
    query.price = { $lte: currentMaxPrice };
  }

  const products = await Product.find(query).lean();

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
        <p>No mystical items found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          href={`/shop/${product._id.toString()}`}
          key={product._id.toString()}
          className="group cursor-pointer"
        >
          <Card
            className={`bg-zinc-900 border-zinc-800 overflow-hidden transition-all duration-300 h-full flex flex-col ${product.stock > 0 ? "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20" : "opacity-75 grayscale-[0.5]"}`}
          >
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
                <Badge
                  variant="outline"
                  className="text-zinc-400 border-zinc-700 mb-3 text-xs"
                >
                  {product.category}
                </Badge>
                <h3 className="font-medium text-zinc-100 mb-1 line-clamp-1">
                  {product.name}
                </h3>
              </div>

              {/* --- NEW: Smart Price Display --- */}
              <div className="mt-2 text-2xl flex items-center gap-2">
                {/* The Main Price (Shows discount if it exists, otherwise shows regular) */}
                <p
                  className={`font-semibold ${product.stock > 0 ? "text-purple-400" : "text-zinc-500"}`}
                >
                  ₹
                  {product.discountedPrice &&
                  product.discountedPrice < product.price
                    ? product.discountedPrice
                    : product.price}
                </p>

                {/* The Slash Cut (ONLY renders if discountedPrice is less than regular price) */}
                {product.discountedPrice &&
                  product.discountedPrice < product.price && (
                    <p className="text-lg text-zinc-500 line-through decoration-rose-500/70">
                      ₹{product.price}
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

// ==========================================
// 3. LOADING ANIMATION (Shows while Grid fetches)
// ==========================================
function GridLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center w-full">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-16 h-16 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        <div className="absolute w-10 h-10 border-r-2 border-l-2 border-purple-400/50 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
      </div>
      <p className="text-zinc-400 font-medium tracking-widest uppercase text-sm animate-pulse">
        Summoning Artifacts...
      </p>
    </div>
  );
}

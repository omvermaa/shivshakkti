import Link from "next/link";
import Image from "next/image";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";

// Mock data to visualize the design
const mockProducts = [
  { id: "1", name: "Amethyst Crystal Cluster", price: 1200, category: "Crystals", image: "https://images.unsplash.com/photo-1587245937293-b0510ee4c2bb?auto=format&fit=crop&q=80&w=500" },
  { id: "2", name: "The Rider-Waite Tarot Deck", price: 850, category: "Tarot Decks", image: "https://images.unsplash.com/photo-1633421118129-87d2511470ce?auto=format&fit=crop&q=80&w=500" },
  { id: "3", name: "Clear Quartz Pendulum", price: 450, category: "Pendulums", image: "https://images.unsplash.com/photo-1597931350692-0b13503a46fb?auto=format&fit=crop&q=80&w=500" },
  { id: "4", name: "Sage Smudge Stick", price: 250, category: "Incense", image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=500" },
];

export default function ShopPage({ searchParams }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Mobile Search Bar */}
        <div className="flex md:hidden flex-col sm:flex-row gap-4">
          <Input 
            type="text" 
            placeholder="Search for mystical items..." 
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
          />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white shrink-0">
            Search
          </Button>
        </div>

        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h2 className="text-lg font-semibold tracking-wide text-zinc-100 mb-4">Categories</h2>
            <div className="space-y-2 flex flex-col">
              {['All', 'Tarot Decks', 'Crystals', 'Pendulums', 'Incense'].map((cat) => (
                <Link 
                  key={cat} 
                  href={`/shop?category=${cat.toLowerCase()}`}
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
              defaultValue={[2000]} 
              max={5000} 
              step={100} 
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>₹0</span>
              <span>₹5000</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Desktop Search Bar */}
          <div className="hidden md:flex mb-8 flex-col sm:flex-row gap-4">
            <Input 
              type="text" 
              placeholder="Search for mystical items..." 
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
            />
            <Button className="bg-purple-600 hover:bg-purple-700 text-white shrink-0">
              Search
            </Button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <Link href={`/shop/${product.id}`} key={product.id} className="group cursor-pointer">
                <Card className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                  <div className="aspect-square relative overflow-hidden bg-zinc-800">
                    <Image 
                      // src={product.image} 
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
        </main>
      </div>
    </div>
  );
}
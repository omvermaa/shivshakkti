import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

const mockInventory = [
  { id: "1", name: "Amethyst Crystal Cluster", price: 1200, category: "Crystals", stock: 5 },
  { id: "2", name: "The Rider-Waite Tarot Deck", price: 850, category: "Tarot Decks", stock: 12 },
  { id: "3", name: "Clear Quartz Pendulum", price: 450, category: "Pendulums", stock: 0 },
];

export default function ManageProducts() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Products</h1>
          <p className="text-zinc-400 mt-2">Manage your inventory and product listings.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add New Product
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="Search products..." 
              className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Data Table */}
        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400">Product Name</TableHead>
              <TableHead className="text-zinc-400">Category</TableHead>
              <TableHead className="text-zinc-400">Price</TableHead>
              <TableHead className="text-zinc-400">Stock</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInventory.map((item) => (
              <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                <TableCell className="font-medium text-zinc-100">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-300">₹{item.price}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
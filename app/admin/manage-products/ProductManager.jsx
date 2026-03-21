"use client";

import { useState } from "react";
import { saveProduct, deleteProduct } from "../../actions/product";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";

export default function ProductManager({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search bar
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open modal for Adding
  const handleAddNew = () => {
    setEditingProduct(null); // Clear form
    setIsDialogOpen(true);
  };

  // Open modal for Editing
  const handleEdit = (product) => {
    setEditingProduct(product); // Fill form with existing data
    setIsDialogOpen(true);
  };

  // Handle Form Submission (Add or Edit)
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    if (editingProduct) {
      formData.append("id", editingProduct._id);
    }

    const result = await saveProduct(formData);
    
    if (result.success) {
      setIsDialogOpen(false);
      // In a real app, you might re-fetch products here, but Server Actions + revalidatePath 
      // will automatically refresh the parent page anyway!
      window.location.reload(); 
    } else {
      alert("Failed to save product.");
    }
    setIsSaving(false);
  };

  // Handle Deletion
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      setProducts(products.filter(p => p._id !== id)); // Optimistic UI update
    }
  };

  return (
    <div className="space-y-6 text-zinc-50">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-purple-500/50"
          />
        </div>

        {/* Add Product Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl text-zinc-100">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={onSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">Product Name</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required className="bg-zinc-900 border-zinc-800" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-zinc-300">Price (₹)</Label>
                  <Input id="price" name="price" type="number" min="0" defaultValue={editingProduct?.price} required className="bg-zinc-900 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-zinc-300">Stock Quantity</Label>
                  <Input id="stock" name="stock" type="number" min="0" defaultValue={editingProduct?.stock} required className="bg-zinc-900 border-zinc-800" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-zinc-300">Category</Label>
                <select 
                  id="category" 
                  name="category" 
                  defaultValue={editingProduct?.category || "Tarot Decks"}
                  className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
                >
                  <option value="Tarot Decks">Tarot Decks</option>
                  <option value="Crystals">Crystals</option>
                  <option value="Pendulums">Pendulums</option>
                  <option value="Incense">Incense</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-zinc-300">Image URL</Label>
                <Input id="image" name="image" placeholder="https://..." defaultValue={editingProduct?.images?.[0]} className="bg-zinc-900 border-zinc-800" />
                <p className="text-xs text-zinc-500">Paste a link from Cloudinary, Imgur, or Unsplash.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-zinc-300">Description</Label>
                <Textarea id="description" name="description" rows={3} defaultValue={editingProduct?.description} required className="bg-zinc-900 border-zinc-800 resize-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingProduct ? "Update Product" : "Save Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
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
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((item) => (
                <TableRow key={item._id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
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
                      <Button onClick={() => handleEdit(item)} variant="ghost" size="icon" className="text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDelete(item._id)} variant="ghost" size="icon" className="text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
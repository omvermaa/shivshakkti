"use client";

import { useState } from "react";
import Image from "next/image";
import { saveProduct, deleteProduct } from "../../actions/product";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Plus, Search, Edit, Trash2, Loader2, ImagePlus, X } from "lucide-react";

export default function ProductManager({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for images
  const [existingImages, setExistingImages] = useState([]); // URLs already in MongoDB
  const [newFiles, setNewFiles] = useState([]); // Raw File objects to upload

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingProduct(null); 
    setExistingImages([]);
    setNewFiles([]);
    setIsDialogOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product); 
    setExistingImages(product.images || []);
    setNewFiles([]);
    setIsDialogOpen(true);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setNewFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeNewFile = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Helper to upload a single file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    // ⚠️ REPLACE THESE WITH YOUR CLOUDINARY DETAILS ⚠️
    formData.append("upload_preset", "shivshakkti_preset"); 
    const cloudName = "dxgvwi4uu"; 

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const form = e.currentTarget;
      const submitData = new FormData(form);
      
      if (editingProduct) {
        submitData.append("id", editingProduct._id);
      }

      // 1. Upload all NEW files to Cloudinary first
      const uploadedUrls = [];
      for (const file of newFiles) {
        const url = await uploadToCloudinary(file);
        if (url) uploadedUrls.push(url);
      }

      // 2. Combine kept existing images with the newly uploaded ones
      const finalImages = [...existingImages, ...uploadedUrls];
      
      // 3. Append as a stringified array for the server action to parse
      submitData.append("images", JSON.stringify(finalImages));

      // 4. Send to database
      const res = await saveProduct(submitData);

      if (res.success) {
        setIsDialogOpen(false);
        setEditingProduct(null);
        setExistingImages([]);
        setNewFiles([]);
        alert("Product saved successfully!");
        window.location.reload(); 
      } else {
        alert("Failed to save product: " + res.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while uploading/saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const response = await deleteProduct(id);
      if(response && response.success) {
        setProducts(products.filter(p => p._id !== id)); 
      } else {
        window.location.reload(); 
      }
    }
  };

  return (
    <div className="space-y-6 text-zinc-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100" />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if(!open) { setExistingImages([]); setNewFiles([]); } setIsDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-zinc-100">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Product Name</Label>
                <Input name="name" defaultValue={editingProduct?.name} required className="bg-zinc-900 border-zinc-800" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Price (₹)</Label>
                  <Input name="price" type="number" min="0" defaultValue={editingProduct?.price} required className="bg-zinc-900 border-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Stock Quantity</Label>
                  <Input name="stock" type="number" min="0" defaultValue={editingProduct?.stock} required className="bg-zinc-900 border-zinc-800" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Category</Label>
                <select name="category" defaultValue={editingProduct?.category || "Tarot Decks"} className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus-visible:ring-purple-500/50">
                  <option value="Tarot Decks">Tarot Decks</option>
                  <option value="Crystals">Crystals</option>
                  <option value="Pendulums">Pendulums</option>
                  <option value="Incense">Incense</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* MULTIPLE IMAGE UPLOAD SECTION */}
              <div className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <Label className="text-zinc-300 flex items-center gap-2"><ImagePlus className="w-4 h-4 text-purple-400"/> Product Images</Label>
                <Input 
                  type="file" 
                  accept="image/*"
                  multiple // Allow multiple files
                  onChange={handleFileSelect}
                  className="bg-zinc-950 border-zinc-800 text-zinc-400 file:text-zinc-100 file:bg-zinc-800 file:border-0 file:rounded-md file:px-3 file:py-1 cursor-pointer" 
                />
                
                {/* Image Preview Grid */}
                {(existingImages.length > 0 || newFiles.length > 0) && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {/* Render Existing DB Images */}
                    {existingImages.map((url, i) => (
                      <div key={`exist-${i}`} className="relative w-20 h-20 rounded-md overflow-hidden border border-zinc-700 group">
                        <Image src={url} alt={`Existing ${i}`} fill className="object-cover" unoptimized />
                        <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-black/70 hover:bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {/* Render New Files to Upload */}
                    {newFiles.map((file, i) => (
                      <div key={`new-${i}`} className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-purple-500/50 group">
                        <Image src={URL.createObjectURL(file)} alt={`New ${i}`} fill className="object-cover opacity-70" unoptimized />
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">NEW</div>
                        <button type="button" onClick={() => removeNewFile(i)} className="absolute top-1 right-1 bg-black/70 hover:bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Description</Label>
                <Textarea name="description" rows={3} defaultValue={editingProduct?.description} required className="bg-zinc-900 border-zinc-800 resize-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-zinc-700 hover:bg-zinc-800">Cancel</Button>
                <Button type="submit" disabled={isSaving || (existingImages.length === 0 && newFiles.length === 0)} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading...</> : editingProduct ? "Update Product" : "Save Product"}
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
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-400">Product</TableHead>
              <TableHead className="text-zinc-400">Category</TableHead>
              <TableHead className="text-zinc-400">Price</TableHead>
              <TableHead className="text-zinc-400">Stock</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((item) => (
              <TableRow key={item._id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-medium text-zinc-100 flex items-center gap-3">
                  <div className="w-10 h-10 relative rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                    <Image src={item.images?.[0] || "/placeholder-image.jpg"} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  {item.name}
                </TableCell>
                <TableCell><Badge variant="outline" className="text-zinc-400 border-zinc-700">{item.category}</Badge></TableCell>
                <TableCell className="text-zinc-300">₹{item.price}</TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${item.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => handleEdit(item)} variant="ghost" size="icon" className="text-zinc-400 hover:text-purple-400"><Edit className="w-4 h-4" /></Button>
                  <Button onClick={() => handleDelete(item._id)} variant="ghost" size="icon" className="text-zinc-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
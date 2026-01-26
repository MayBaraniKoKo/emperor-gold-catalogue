import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

const ProductsAdmin = () => {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubcategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ category_id: "", subcategory_id: "", name: "", description: "", price: "", original_price: "", discount: "0", image_url: "", alcohol_percentage: "", volume_ml: "", origin_country: "", is_featured: false, in_stock: true });

  const { toast } = useToast();

  const resetForm = () => setFormData({ category_id: "", subcategory_id: "", name: "", description: "", price: "", original_price: "", discount: "0", image_url: "", alcohol_percentage: "", volume_ml: "", origin_country: "", is_featured: false, in_stock: true });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      console.log('Starting upload for file:', file.name);
      
      // Create a safe unique filename
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `${fileName}`;

      console.log('Uploading to Products bucket with path:', filePath);
      
      const { data, error } = await supabase.storage.from('Products').upload(filePath, file, { upsert: true });
      
      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      console.log('Upload successful, data:', data);
      
      const { data: publicData } = await supabase.storage.from('Products').getPublicUrl(filePath);
      const publicUrl = (publicData as any)?.publicUrl ?? "";

      console.log('Public URL:', publicUrl);
      
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
      toast({ title: 'Success', description: 'Product image uploaded successfully' });
    } catch (err: any) {
      console.error('Full error object:', err);
      toast({ title: 'Upload failed', description: err.message || String(err), variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, price: parseFloat(formData.price), original_price: formData.original_price ? parseFloat(formData.original_price) : undefined, discount: parseFloat(formData.discount) || 0, alcohol_percentage: formData.alcohol_percentage ? parseFloat(formData.alcohol_percentage) : undefined, volume_ml: formData.volume_ml ? parseInt(formData.volume_ml) : undefined, subcategory_id: formData.subcategory_id || null };
    if (editingProduct) { await updateProduct.mutateAsync({ id: editingProduct.id, ...payload }); }
    else { await createProduct.mutateAsync(payload); }
    setIsOpen(false); setEditingProduct(null); resetForm();
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ category_id: p.category_id, subcategory_id: p.subcategory_id || "", name: p.name, description: p.description || "", price: String(p.price), original_price: p.original_price ? String(p.original_price) : "", discount: String(p.discount || 0), image_url: p.image_url || "", alcohol_percentage: p.alcohol_percentage ? String(p.alcohol_percentage) : "", volume_ml: p.volume_ml ? String(p.volume_ml) : "", origin_country: p.origin_country || "", is_featured: p.is_featured || false, in_stock: p.in_stock !== false });
    setIsOpen(true);
  };

  const getCategoryName = (id: string) => categories?.find(c => c.id === id)?.name || "";
  const filteredSubs = subcategories?.filter(s => s.category_id === formData.category_id) || [];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold">Products</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingProduct(null); resetForm(); } }}>
          <DialogTrigger asChild><Button className="gold-gradient text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Add Product</Button></DialogTrigger>
          <DialogContent className="bg-card max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingProduct ? "Edit" : "Add"} Product</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Category*</Label><Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v, subcategory_id: "" })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent className="bg-popover">{categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Subcategory</Label><Select value={formData.subcategory_id} onValueChange={(v) => setFormData({ ...formData, subcategory_id: v })}><SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger><SelectContent className="bg-popover">{filteredSubs.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div><Label>Name*</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Price*</Label><Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required /></div>
                <div><Label>Original Price</Label><Input type="number" step="0.01" value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: e.target.value })} placeholder="Before discount" /></div>
                <div><Label>Discount %</Label><Input type="number" step="0.1" min="0" max="100" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Volume (ml)</Label><Input type="number" value={formData.volume_ml} onChange={(e) => setFormData({ ...formData, volume_ml: e.target.value })} /></div>
                <div><Label>ABV %</Label><Input type="number" step="0.1" value={formData.alcohol_percentage} onChange={(e) => setFormData({ ...formData, alcohol_percentage: e.target.value })} /></div>
              </div>
              <div>
                <Label>Image</Label>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col flex-1">
                    <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Or paste an image URL" />
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
                      <label htmlFor="image-upload" className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                        Click to upload image or drag and drop
                      </label>
                    </div>
                  </div>
                  {formData.image_url && (
                    <img src={formData.image_url} alt={formData.name || 'preview'} className="w-28 h-28 object-cover rounded border border-border" />
                  )}
                </div>
              </div>
              <div><Label>Origin Country</Label><Input value={formData.origin_country} onChange={(e) => setFormData({ ...formData, origin_country: e.target.value })} /></div>
              <div className="flex gap-8">
                <div className="flex items-center gap-2"><Switch checked={formData.is_featured} onCheckedChange={(c) => setFormData({ ...formData, is_featured: c })} /><Label>Featured</Label></div>
                <div className="flex items-center gap-2"><Switch checked={formData.in_stock} onCheckedChange={(c) => setFormData({ ...formData, in_stock: c })} /><Label>In Stock</Label></div>
              </div>
              <Button type="submit" className="w-full gold-gradient text-primary-foreground">{editingProduct ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {products?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium flex items-center gap-2">{p.is_featured && <Star className="w-4 h-4 text-primary fill-current" />}{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{getCategoryName(p.category_id)}</TableCell>
                <TableCell>${Number(p.price).toFixed(2)}</TableCell>
                <TableCell><div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => deleteProduct.mutateAsync(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ProductsAdmin;

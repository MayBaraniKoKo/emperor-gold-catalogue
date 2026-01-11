import { useState } from "react";
import { useSubcategories, useCreateSubcategory, useUpdateSubcategory, useDeleteSubcategory, Subcategory } from "@/hooks/useSubcategories";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

const SubcategoriesAdmin = () => {
  const { data: subcategories, isLoading } = useSubcategories();
  const { data: categories } = useCategories();
  const createSubcategory = useCreateSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({ category_id: "", name: "", description: "", image_url: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSub) {
      await updateSubcategory.mutateAsync({ id: editingSub.id, ...formData });
    } else {
      await createSubcategory.mutateAsync(formData);
    }
    setIsOpen(false);
    setEditingSub(null);
    setFormData({ category_id: "", name: "", description: "", image_url: "" });
  };

  const handleEdit = (sub: Subcategory) => {
    setEditingSub(sub);
    setFormData({ category_id: sub.category_id, name: sub.name, description: sub.description || "", image_url: sub.image_url || "" });
    setIsOpen(true);
  };

  const getCategoryName = (id: string) => categories?.find(c => c.id === id)?.name || "";

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold">Subcategories</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingSub(null); setFormData({ category_id: "", name: "", description: "", image_url: "" }); } }}>
          <DialogTrigger asChild><Button className="gold-gradient text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Add Subcategory</Button></DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader><DialogTitle>{editingSub ? "Edit" : "Add"} Subcategory</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Category</Label>
                <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent className="bg-popover">{categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
              <Button type="submit" className="w-full gold-gradient text-primary-foreground">{editingSub ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {subcategories?.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.name}</TableCell>
                <TableCell className="text-muted-foreground">{getCategoryName(sub.category_id)}</TableCell>
                <TableCell><div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => handleEdit(sub)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => deleteSubcategory.mutateAsync(sub.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SubcategoriesAdmin;

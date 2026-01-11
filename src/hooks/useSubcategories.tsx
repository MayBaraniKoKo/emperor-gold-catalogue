import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface SubcategoryInput {
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  display_order?: number;
}

export const useSubcategories = (categoryId?: string) => {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      let query = supabase
        .from("subcategories")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Subcategory[];
    },
  });
};

export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (subcategory: SubcategoryInput) => {
      const { data, error } = await supabase
        .from("subcategories")
        .insert([subcategory])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({ title: "Subcategory created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error creating subcategory", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...subcategory }: SubcategoryInput & { id: string }) => {
      const { data, error } = await supabase
        .from("subcategories")
        .update(subcategory)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({ title: "Subcategory updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error updating subcategory", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({ title: "Subcategory deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting subcategory", description: error.message, variant: "destructive" });
    },
  });
};

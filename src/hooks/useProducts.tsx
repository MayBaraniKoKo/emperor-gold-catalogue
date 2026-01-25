import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount: number;
  image_url: string | null;
  alcohol_percentage: number | null;
  volume_ml: number | null;
  origin_country: string | null;
  is_featured: boolean | null;
  in_stock: boolean | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  category_id: string;
  subcategory_id?: string | null;
  name: string;
  description?: string;
  price: number;
  original_price?: number | null;
  discount?: number;
  image_url?: string;
  alcohol_percentage?: number;
  volume_ml?: number;
  origin_country?: string;
  is_featured?: boolean;
  in_stock?: boolean;
  display_order?: number;
}

export const useProducts = (options?: { categoryId?: string; subcategoryId?: string; featured?: boolean }) => {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (options?.categoryId) {
        query = query.eq("category_id", options.categoryId);
      }
      if (options?.subcategoryId) {
        query = query.eq("subcategory_id", options.subcategoryId);
      }
      if (options?.featured) {
        query = query.eq("is_featured", true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: ProductInput) => {
      const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error creating product", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...product }: ProductInput & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error updating product", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
    },
  });
};

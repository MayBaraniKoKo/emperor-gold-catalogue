import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCategory } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
  const { data: category, isLoading: categoryLoading } = useCategory(id!);
  const { data: subcategories } = useSubcategories(id);
  const { data: products, isLoading: productsLoading } = useProducts({
    categoryId: id,
    subcategoryId: selectedSubcategory || undefined,
  });

  if (categoryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs tracking-[0.3em] uppercase text-primary mb-4 block">
              Category
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="text-gold-gradient">{category?.name}</span>
            </h1>
            {category?.description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>

          {/* Subcategories Filter */}
          {subcategories && subcategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button
                variant={selectedSubcategory === null ? "default" : "outline"}
                onClick={() => setSelectedSubcategory(null)}
                className={selectedSubcategory === null ? "gold-gradient text-primary-foreground" : "border-primary/30"}
              >
                All
              </Button>
              {subcategories.map((sub) => (
                <Button
                  key={sub.id}
                  variant={selectedSubcategory === sub.id ? "default" : "outline"}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={selectedSubcategory === sub.id ? "gold-gradient text-primary-foreground" : "border-primary/30"}
                >
                  {sub.name}
                </Button>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={Number(product.price)}
                  originalPrice={product.original_price ? Number(product.original_price) : undefined}
                  discount={product.discount || 0}
                  imageUrl={product.image_url}
                  alcoholPercentage={product.alcohol_percentage}
                  volumeMl={product.volume_ml}
                  originCountry={product.origin_country}
                  isFeatured={product.is_featured ?? false}
                  inStock={product.in_stock ?? true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products in this category yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryDetail;

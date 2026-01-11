import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredProducts, isLoading: productsLoading } = useProducts({ featured: true });

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      
      {/* Categories Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-xs tracking-[0.3em] uppercase text-primary mb-4 block">
              Our Collection
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse by <span className="text-gold-gradient">Category</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated selection of premium spirits, 
              organized for your convenience.
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-secondary rounded-lg animate-pulse" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.slice(0, 6).map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  description={category.description}
                  imageUrl={category.image_url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No categories yet. Add some via the CMS!</p>
              <Link to="/login">
                <Button variant="outline" className="border-primary/30">
                  Go to Admin
                </Button>
              </Link>
            </div>
          )}

          {categories && categories.length > 6 && (
            <div className="text-center mt-12">
              <Link to="/categories">
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                  View All Categories
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-primary mb-4 block">
              Handpicked Selection
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured <span className="text-gold-gradient">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our most sought-after spirits, chosen for their exceptional quality and character.
            </p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={Number(product.price)}
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
              <p className="text-muted-foreground">No featured products yet. Add some via the CMS!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button className="gold-gradient text-primary-foreground shadow-gold hover:opacity-90">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-foreground text-gold-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Experience the <span className="text-gold-gradient">Emperor's Choice</span>
            </h2>
            <p className="text-gold-200/70 text-lg mb-10">
              Join our exclusive community of spirit enthusiasts and discover 
              the finest selections from around the world.
            </p>
            <Link to="/products">
              <Button size="lg" className="gold-gradient text-primary-foreground px-10 py-6 shadow-gold hover:opacity-90">
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

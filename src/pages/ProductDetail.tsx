import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id ?? "");
  const { addToCart } = useCart();

  if (isLoading) return <div className="container mx-auto px-6 py-20">Loading...</div>;
  if (error) return <div className="container mx-auto px-6 py-20">Error: {error.message}</div>;
  if (!product) return <div className="container mx-auto px-6 py-20">Product not found</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-secondary rounded-lg overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-[560px] object-cover" />
              ) : (
                <div className="w-full h-[560px] flex items-center justify-center gold-gradient opacity-30">
                  <span className="text-3xl font-semibold text-primary-foreground">No image</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">{product.name}</h1>
                  <p className="text-muted-foreground mt-2">{product.origin_country}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {product.discount > 0 && product.original_price ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-lg text-muted-foreground line-through">
                          MMK {Number(product.original_price).toFixed(2)}
                        </span>
                        <span className="px-3 py-1 bg-destructive text-destructive-foreground rounded-full text-sm font-medium">
                          {product.discount.toFixed(1)}% OFF
                        </span>
                      </div>
                      <div className="font-display text-3xl font-bold text-gold-gradient">MMK {Number(product.price).toFixed(2)}</div>
                    </>
                  ) : (
                    <div className="font-display text-3xl font-bold text-gold-gradient">MMK {Number(product.price).toFixed(2)}</div>
                  )}
                </div>
              </div>

              {product.description && <p className="text-muted-foreground leading-relaxed">{product.description}</p>}

              <div className="flex flex-wrap gap-3">
                {product.volume_ml && <span className="px-3 py-1 bg-secondary rounded">{product.volume_ml}ml</span>}
                {product.alcohol_percentage && <span className="px-3 py-1 bg-secondary rounded">{product.alcohol_percentage}% ABV</span>}
                {product.is_featured && <span className="px-3 py-1 gold-gradient rounded text-primary-foreground">Featured</span>}
              </div>

              <div className="flex items-center gap-4">
                <Button className="gold-gradient" onClick={() => {
                  const { id: pid, name, price, image_url } = product;
                  addToCart({ id: pid, name, price: Number(price), image_url }, 1);
                }}>
                  Add to cart
                </Button>
                <Link to="/products">
                  <Button variant="ghost">Back to products</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;

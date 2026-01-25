import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="font-display text-2xl font-bold mb-4">Your Cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products from the catalog.</p>
            <Button asChild>
              <a href="/products" className="gold-gradient text-primary-foreground px-6 py-3 rounded inline-block">Browse products</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-bold mb-6">Your Cart</h2>

          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 bg-card rounded p-4">
                {it.image_url ? <img src={it.image_url} alt={it.name} className="w-24 h-24 object-cover rounded" /> : <div className="w-24 h-24 bg-secondary rounded" />}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-muted-foreground text-sm">${it.price.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(it.price * it.quantity).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Input type="number" min={1} value={String(it.quantity)} onChange={(e) => updateQuantity(it.id, Math.max(1, Number(e.target.value) || 1))} className="w-24" />
                    <Button variant="ghost" onClick={() => removeFromCart(it.id)}>Remove</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div>
              <div className="text-muted-foreground">Total items: {totalItems}</div>
              <div className="font-display text-2xl font-bold">${totalPrice.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => clearCart()}>Clear cart</Button>
              <a href="/checkout">
                <Button className="gold-gradient">Proceed to Checkout</Button>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;

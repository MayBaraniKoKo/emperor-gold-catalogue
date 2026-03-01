import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 py-20 max-w-3xl text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Thank you!</h1>
          {order ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">Your order <strong>{order.id}</strong> has been received.</p>
              <div className="text-left bg-card p-4 rounded">
                <div><strong>Name:</strong> {order.name}</div>
                <div><strong>Phone:</strong> {order.phone}</div>
                <div><strong>Address:</strong> {order.address}</div>
                <div><strong>Total:</strong> MMK {Number(order.total).toFixed(2)}</div>
                <div className="mt-2 text-muted-foreground text-sm">We will contact you shortly to confirm delivery.</div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Your order has been placed. Check your orders in your dashboard.</p>
          )}

          <div className="mt-8">
            <Link to="/products">
              <Button className="gold-gradient">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;

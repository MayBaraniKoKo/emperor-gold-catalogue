import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Full name is required";
    if (!phone.trim()) return "Phone number is required";
    if (!address.trim()) return "Address is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast({ title: "Validation error", description: err, variant: "destructive" });
    if (items.length === 0) return toast({ title: "Your cart is empty", variant: "destructive" });

    setSubmitting(true);

    // Client-side order object for local fallback and UI
    const localOrder = {
      id: `order_${Date.now()}`,
      created_at: new Date().toISOString(),
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      note: note.trim(),
      items,
      total: totalPrice,
    };

    // Try to save server-side to Supabase orders table
    try {
      const { data: inserted, error: insertErr } = await (supabase as any)
        .from("orders")
        .insert([
          {
            name: localOrder.name,
            phone: localOrder.phone,
            address: localOrder.address,
            items: localOrder.items,
            total: localOrder.total,
            status: "pending",
            note: localOrder.note,
            remark: "",
          },
        ])
        .select()
        .single();

      if (insertErr) {
        // fallback to local storage
        const raw = localStorage.getItem("_egc_orders_v1");
        const orders = raw ? JSON.parse(raw) : [];
        orders.push(localOrder);
        localStorage.setItem("_egc_orders_v1", JSON.stringify(orders));

        clearCart();
        toast({ title: "Order saved locally", description: "Server insert failed — saved locally as a fallback" });
        navigate("/order-success", { state: { order: localOrder } });
        return;
      }

      // On success, use the server record as the order object
      const order = { ...localOrder, id: inserted.id, created_at: inserted.created_at };
      clearCart();
      toast({ title: "Order placed", description: `Thanks ${order.name}, your order id is ${order.id}` });
      navigate("/order-success", { state: { order } });
    } catch (err: any) {
      // Final fallback to local storage on unexpected errors
      const raw = localStorage.getItem("_egc_orders_v1");
      const orders = raw ? JSON.parse(raw) : [];
      orders.push(localOrder);
      localStorage.setItem("_egc_orders_v1", JSON.stringify(orders));

      clearCart();
      toast({ title: "Order placed locally", description: "An error occurred while contacting the server; order saved locally" });
      navigate("/order-success", { state: { order: localOrder } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 py-20 max-w-3xl">
          <h1 className="font-display text-3xl font-bold mb-6">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label>Phone number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div>
              <Label>Address</Label>
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

            <div>
              <Label>Note (optional)</Label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            <div className="bg-card p-4 rounded space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Items</div>
                <div className="font-bold">{items.length}</div>
              </div>

              <div className="space-y-2">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center gap-4">
                    {it.image_url ? (
                      <img src={it.image_url} alt={it.name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-secondary rounded" />
                    )}

                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-muted-foreground text-sm">{it.quantity} × ${it.price.toFixed(2)}</div>
                    </div>

                    <div className="font-medium">${(it.price * it.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="text-muted-foreground">Total</div>
                <div className="font-display text-xl font-bold text-gold-gradient">${totalPrice.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" className="gold-gradient" disabled={submitting}>Order</Button>
              <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;

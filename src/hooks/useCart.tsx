import * as React from "react";
import type { ReactNode } from "react";
import { toast as showToast } from "@/hooks/use-toast";
import type { Product } from "@/hooks/useProducts";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (p: { id: string; name: string; price: number; image_url?: string | null }, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CART_STORAGE_KEY = "_egc_cart_v1";

const CartContext = React.createContext<CartContextValue | undefined>(undefined);

function readFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch (err) {
    return [];
  }
}

function writeToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    // ignore
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = React.useState<CartItem[]>(() => readFromStorage());

  React.useEffect(() => {
    writeToStorage(items);
  }, [items]);

  const addToCart = (p: { id: string; name: string; price: number; image_url?: string | null }, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { id: p.id, name: p.name, price: p.price, quantity: qty, image_url: p.image_url }];
    });

    showToast({ title: "Added to cart", description: `${qty} × ${p.name}` });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    showToast({ title: "Removed from cart" });
  };

  const updateQuantity = (id: string, qty: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it)).filter((i) => i.quantity > 0));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((s, it) => s + it.quantity, 0);
  const totalPrice = items.reduce((s, it) => s + it.quantity * it.price, 0);

  const value: CartContextValue = React.useMemo(() => ({ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

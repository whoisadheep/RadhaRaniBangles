"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/data";

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addItem: (product: Product, size?: string, quantity?: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = "radha-rani-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      // The cart is an external browser store; restore it once after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setItems(JSON.parse(saved));
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addItem: (product, size = "2.6", quantity = 1) => {
      setItems((current) => {
        const existingIndex = current.findIndex(
          (item) => item.product.id === product.id && item.size === size
        );
        if (existingIndex === -1) return [...current, { product, size, quantity }];
        return current.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      });
    },
    updateQuantity: (index, quantity) => setItems((current) =>
      current.flatMap((item, itemIndex) =>
        itemIndex !== index ? [item] : quantity > 0 ? [{ ...item, quantity }] : []
      )
    ),
    removeItem: (index) => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index)),
    clearCart: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

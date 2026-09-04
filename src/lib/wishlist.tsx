"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/data";

interface WishlistContextValue {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const WISHLIST_STORAGE_KEY = "radha-rani-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch {
      window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, hydrated]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlist,
      wishlistCount: wishlist.length,
      isInWishlist: (productId: string) => wishlist.some((p) => p.id === productId),
      toggleWishlist: (product: Product) => {
        setWishlist((prev) => {
          const exists = prev.some((p) => p.id === product.id);
          if (exists) {
            return prev.filter((p) => p.id !== product.id);
          } else {
            return [...prev, product];
          }
        });
      },
      addToWishlist: (product: Product) => {
        setWishlist((prev) => {
          if (prev.some((p) => p.id === product.id)) return prev;
          return [...prev, product];
        });
      },
      removeFromWishlist: (productId: string) => {
        setWishlist((prev) => prev.filter((p) => p.id !== productId));
      },
      clearWishlist: () => setWishlist([]),
    }),
    [wishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { useQuickView } from "@/lib/quick-view";
import { formatPrice, getDiscountPercentage, cn } from "@/lib/utils";
import type { Product } from "@/lib/data";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { openQuickView } = useQuickView();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [allAdded, setAllAdded] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleAddToCart = (product: Product) => {
    addItem(product, product.size || "2.6", 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleAddAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((product) => {
      addItem(product, product.size || "2.6", 1);
    });
    setAllAdded(true);
    setTimeout(() => setAllAdded(false), 2200);
  };

  const handleClearAll = () => {
    if (confirmClear) {
      clearWishlist();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 sm:pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#A16207" stroke="#A16207" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent">
                Your Saved Pieces
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary">
              My Wishlist
            </h1>
            <p className="font-body text-sm sm:text-base text-muted-foreground mt-2 max-w-xl">
              Cherish your chosen bangles. When you are ready, easily add them to your shopping bag or purchase on WhatsApp.
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddAllToCart}
                className={cn(
                  "px-6 py-3 rounded-full font-body text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer shadow-md flex items-center gap-2",
                  allAdded
                    ? "bg-emerald-700 text-white"
                    : "bg-accent hover:bg-accent-dark text-on-accent hover:shadow-[0_4px_20px_rgba(161,98,7,0.3)]"
                )}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {allAdded ? "All Added to Bag ✓" : `Add All (${wishlist.length}) to Bag`}
              </button>

              <button
                onClick={handleClearAll}
                className={cn(
                  "px-4 py-3 rounded-full border font-body text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer",
                  confirmClear
                    ? "border-red-500 bg-red-50 text-red-600 font-semibold"
                    : "border-border text-muted-foreground hover:border-red-300 hover:text-red-500"
                )}
              >
                {confirmClear ? "Confirm Clear?" : "Clear All"}
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        {wishlist.length === 0 ? (
          /* Empty Wishlist State */
          <div className="py-20 lg:py-28 text-center max-w-xl mx-auto animate-fade-in-up">
            <div className="w-24 h-24 mx-auto rounded-full bg-cream border-2 border-accent/20 flex items-center justify-center mb-6 shadow-inner">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A16207"
                strokeWidth="1.3"
                className="text-accent"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="font-body text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed">
              You haven&apos;t saved any bangles to your wishlist yet. Explore our handcrafted bridal sets, 22K gold kadas, and diamond bangles to find pieces you adore.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/collections"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary-dark text-on-primary font-body text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Explore Collections
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-border hover:border-primary text-secondary font-body text-xs uppercase tracking-widest transition-colors duration-300"
              >
                Back to Homepage
              </Link>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-14 pt-10 border-t border-border/60">
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold">
                Popular Categories to Explore
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  "Gold Bangles",
                  "Bridal Sets",
                  "Kundan Bangles",
                  "Diamond Bangles",
                  "Everyday Wear",
                  "Silver Bangles",
                ].map((tag) => (
                  <Link
                    key={tag}
                    href="/collections"
                    className="text-xs font-body px-4 py-2 rounded-full border border-border/80 bg-white/60 hover:border-accent hover:text-accent transition-colors duration-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Populated Wishlist Grid */
          <div className="mt-8">
            <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Showing {wishlist.length} saved {wishlist.length === 1 ? "item" : "items"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {wishlist.map((product) => {
                const isItemAdded = addedItems[product.id];

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-2xl border border-border/60 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top Image Container */}
                    <div>
                      <div className="relative aspect-[3/4] overflow-hidden bg-champagne img-zoom">
                        <Link href={`/product/${product.slug}`} className="block w-full h-full cursor-pointer">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </Link>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                          {product.isNew && (
                            <span className="bg-primary text-on-primary font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                              New
                            </span>
                          )}
                          {product.isBestseller && (
                            <span className="bg-accent text-on-accent font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                              Bestseller
                            </span>
                          )}
                          {product.originalPrice && (
                            <span className="bg-rose-gold text-white font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                              -{getDiscountPercentage(product.originalPrice, product.price)}%
                            </span>
                          )}
                        </div>

                        {/* Quick View Button (Desktop Hover Center) */}
                        <div className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openQuickView(product);
                            }}
                            className="pointer-events-auto opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/95 hover:bg-white text-primary hover:text-accent font-body text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 cursor-pointer border border-white/60 hover:scale-105"
                            aria-label={`Quick view ${product.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            Quick View
                          </button>
                        </div>

                        {/* Remove from Wishlist Button */}
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-border/80 text-muted-foreground hover:text-red-500 hover:bg-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105"
                          title="Remove from wishlist"
                          aria-label={`Remove ${product.name} from wishlist`}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>

                      {/* Product Information */}
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-body text-[11px] uppercase tracking-widest text-muted-foreground">
                            {product.category}
                          </span>
                          {product.material && (
                            <span className="font-body text-[10px] text-accent font-medium px-2 py-0.5 rounded bg-accent/10">
                              {product.material}
                            </span>
                          )}
                        </div>

                        <Link href={`/product/${product.slug}`} className="block group-hover:text-accent transition-colors">
                          <h3 className="font-heading text-lg font-semibold text-primary line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-baseline gap-2.5 mt-2">
                          <span className="font-body text-lg font-semibold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="font-body text-xs text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-5 pt-0 flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={cn(
                          "flex-1 py-3 px-4 rounded-xl font-body text-xs uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2",
                          isItemAdded
                            ? "bg-emerald-700 text-white shadow-sm"
                            : "bg-primary text-on-primary hover:bg-accent transition-colors shadow-xs"
                        )}
                        aria-live="polite"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {isItemAdded ? "Added to Bag ✓" : "Move to Bag"}
                      </button>

                      <Link
                        href={`/product/${product.slug}`}
                        className="p-3 rounded-xl border border-border hover:border-accent text-secondary hover:text-accent transition-colors flex items-center justify-center cursor-pointer"
                        title="View details"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Brand Trust & Value Props Banner ── */}
        <div className="mt-20 pt-12 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-border/40">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-primary">100% Certified</h4>
              <p className="font-body text-xs text-muted-foreground mt-0.5">BIS Hallmarked & Authenticated</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-border/40">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-primary">Free Insured Shipping</h4>
              <p className="font-body text-xs text-muted-foreground mt-0.5">Safe door-to-door delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-border/40">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-primary">15-Day Exchange</h4>
              <p className="font-body text-xs text-muted-foreground mt-0.5">Hassle-free size exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-border/40">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-primary">Lifetime Care</h4>
              <p className="font-body text-xs text-muted-foreground mt-0.5">Free cleaning & polish service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

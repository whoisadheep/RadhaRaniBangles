"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuickView } from "@/lib/quick-view";
import { useCart } from "@/lib/cart";
import { formatPrice, getDiscountPercentage, cn } from "@/lib/utils";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";

const SIZES = ["2.2", "2.4", "2.6", "2.8", "2.10"];

export function QuickViewModal() {
  const { product, isOpen, closeQuickView } = useQuickView();
  const { addItem } = useCart();

  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("2.6");
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  // Synchronize internal state whenever a new product is loaded
  useEffect(() => {
    if (product) {
      setActiveImage(product.images?.[0] || "");
      setSelectedSize("2.6");
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  // Handle escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeQuickView();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeQuickView]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={closeQuickView}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] text-foreground rounded-2xl sm:rounded-3xl shadow-2xl border border-accent/20 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] z-10 animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 cursor-pointer border border-border/50"
          aria-label="Close preview"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-10 items-start">
            {/* Left — Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-champagne border border-border/50 shadow-inner">
                <img
                  src={activeImage || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
                  {product.isNew && (
                    <span className="bg-primary text-on-primary font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      New
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-accent text-on-accent font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      Bestseller
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-rose-gold text-white font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      -{getDiscountPercentage(product.originalPrice, product.price)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails if multiple images exist */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((imgSrc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgSrc)}
                      className={cn(
                        "w-16 h-16 rounded-xl overflow-hidden bg-champagne border-2 transition-all cursor-pointer flex-shrink-0",
                        (activeImage || product.images[0]) === imgSrc
                          ? "border-accent ring-2 ring-accent/20 scale-95"
                          : "border-transparent opacity-65 hover:opacity-100"
                      )}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Product Information & Actions */}
            <div className="flex flex-col">
              {/* Category */}
              <p className="font-body text-[11px] uppercase tracking-[0.25em] text-accent font-semibold mb-1.5">
                {product.category}
              </p>

              {/* Title */}
              <h2
                id="quick-view-title"
                className="font-heading text-2xl sm:text-3xl font-semibold text-primary leading-tight"
              >
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2.5 mt-2.5">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={star <= Math.round(product.rating) ? "#A16207" : "none"}
                      stroke="#A16207"
                      strokeWidth="1.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="font-body text-xs text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="font-body text-base text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="font-body text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                      Save {getDiscountPercentage(product.originalPrice, product.price)}%
                    </span>
                  </>
                )}
              </div>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                Inclusive of all taxes • Free shipping over ₹2,999
              </p>

              {/* Material and Spec badge */}
              <div className="flex flex-wrap gap-2 mt-4 text-xs font-body">
                <span className="px-3 py-1 rounded-full bg-cream border border-border/60 text-secondary">
                  Material: <strong className="text-primary font-medium">{product.material}</strong>
                </span>
                {product.weight && (
                  <span className="px-3 py-1 rounded-full bg-cream border border-border/60 text-secondary">
                    Weight: <strong className="text-primary font-medium">{product.weight}</strong>
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="font-body text-xs sm:text-sm text-secondary line-clamp-3 mt-4 leading-relaxed">
                {product.description}
              </p>

              <hr className="my-5 border-border/60" />

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-xs uppercase tracking-wider font-semibold text-primary">
                    Bangle Size (inches)
                  </span>
                  <span className="font-body text-[11px] text-accent">
                    {selectedSize === "2.6" ? "Most popular size" : `Size ${selectedSize}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-11 h-11 rounded-xl border font-body text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-center",
                        selectedSize === size
                          ? "border-accent bg-accent/15 text-accent font-semibold shadow-xs scale-105"
                          : "border-border text-secondary hover:border-accent/40 bg-white"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-4">
                <span className="font-body text-xs uppercase tracking-wider font-semibold text-primary">
                  Quantity:
                </span>
                <div className="inline-flex items-center border border-border rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-secondary hover:text-accent transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-body text-xs font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-secondary hover:text-accent transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-accent hover:bg-accent-dark text-on-accent font-body text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold active:scale-98"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {added ? "Added to Bag ✓" : "Add to Bag"}
                </button>

                <a
                  href={getProductWhatsAppUrl(product, selectedSize, quantity)}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[#25D366] text-[#128C3B] hover:bg-[#25D366]/10 font-body text-xs uppercase tracking-widest py-3.5 px-5 rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16.02 3C8.83 3 3 8.82 3 16c0 2.3.6 4.54 1.74 6.5L3 29l6.68-1.72A12.94 12.94 0 0 0 16.02 29C23.2 29 29 23.18 29 16S23.2 3 16.02 3Zm0 23.63c-2.02 0-4-.54-5.72-1.57l-.4-.24-3.96 1.02 1.06-3.86-.26-.4A10.57 10.57 0 1 1 16.02 26.63Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* View Full Product Link */}
              <div className="mt-4 text-center">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={closeQuickView}
                  className="font-body text-xs text-primary/70 hover:text-accent inline-flex items-center gap-1.5 transition-colors cursor-pointer border-b border-transparent hover:border-accent pb-0.5"
                >
                  View Full Product Details & Sizing Specs
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>

              {/* Micro Trust Strip */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-border/50 text-center font-body text-[10px] text-muted-foreground">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[#A16207]">✦</span>
                  <span>100% BIS Hallmarked</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[#A16207]">✦</span>
                  <span>Insured Transit</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[#A16207]">✦</span>
                  <span>15-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

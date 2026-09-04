"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { getCartWhatsAppUrl } from "@/lib/whatsapp";

const FREE_SHIPPING_THRESHOLD = 2999;

export function CartDrawer() {
  const { items, itemCount, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (!mounted) return;
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, mounted]);

  // Handle ESC key to close
  useEffect(() => {
    if (!mounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer, mounted]);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  const handleNavigate = (url: string) => {
    closeDrawer();
    router.push(url);
  };

  return (
    <div
      aria-hidden={!isDrawerOpen}
      className={`fixed inset-0 z-[70] transition-all duration-300 ${
        isDrawerOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
    >
      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ── Slide-Out Drawer Panel ── */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        className={`fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-10 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/70 bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A16207"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 className="font-heading text-xl font-semibold text-primary">
              Shopping Bag
            </h2>
            <span className="bg-accent/10 text-accent font-body text-xs font-semibold px-2 py-0.5 rounded-full">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          <button
            onClick={closeDrawer}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Free Shipping Progress Bar ── */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-cream/60 border-b border-border/50">
            <div className="flex items-center justify-between text-xs font-body mb-1.5">
              {hasFreeShipping ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  🎉 You unlocked <strong>FREE Express Shipping!</strong>
                </span>
              ) : (
                <span className="text-secondary font-medium">
                  Add <strong className="text-accent">{formatPrice(amountToFreeShipping)}</strong> more for <strong>FREE Shipping</strong>
                </span>
              )}
              <span className="text-[11px] font-semibold text-muted-foreground">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  hasFreeShipping
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                    : "bg-gradient-to-r from-[#D4A853] to-[#A16207]"
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Cart Items Content ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-border/60">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center mb-4 shadow-inner">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A16207"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl font-semibold text-primary">
                Your bag is empty
              </h3>
              <p className="font-body text-xs text-muted-foreground mt-1.5 max-w-[260px] leading-relaxed">
                Discover our royal handcrafted bangles and find your perfect adornment.
              </p>
              <button
                onClick={() => handleNavigate("/collections")}
                className="mt-6 bg-accent hover:bg-accent-dark text-on-accent font-body text-xs uppercase tracking-widest px-7 py-3 rounded-full transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={`${item.product.id}-${item.size}-${index}`} className="py-4 flex gap-3.5 items-start">
                {/* Product Thumbnail */}
                <button
                  type="button"
                  onClick={() => handleNavigate(`/product/${item.product.slug}`)}
                  className="w-18 h-22 rounded-xl overflow-hidden bg-champagne shrink-0 border border-border/40 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>

                {/* Info & Actions */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                        {item.product.category}
                      </p>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1 -mr-1 cursor-pointer"
                        aria-label={`Remove ${item.product.name}`}
                        title="Remove item"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    <h4 className="font-heading text-sm font-semibold text-primary truncate mt-0.5">
                      <button
                        type="button"
                        onClick={() => handleNavigate(`/product/${item.product.slug}`)}
                        className="hover:text-accent transition-colors text-left truncate w-full cursor-pointer"
                      >
                        {item.product.name}
                      </button>
                    </h4>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body text-[11px] text-secondary bg-neutral-100 px-2 py-0.5 rounded-md">
                        Size: {item.size}&quot;
                      </span>
                      <span className="font-body text-xs font-semibold text-primary">
                        {formatPrice(item.product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between mt-3 pt-2">
                    <div className="inline-flex items-center border border-border/80 rounded-lg bg-white shadow-2xs">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-secondary hover:text-accent hover:bg-neutral-50 transition-colors cursor-pointer rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="w-8 h-7 flex items-center justify-center font-body text-xs font-semibold border-x border-border/60">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-secondary hover:text-accent hover:bg-neutral-50 transition-colors cursor-pointer rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>

                    <p className="font-body text-sm font-semibold text-primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer / Checkout Actions ── */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border/70 bg-[#FAF8F5] space-y-3">
            {/* Promo Code Note */}
            <div className="flex items-center justify-between bg-white border border-accent/20 rounded-xl px-3 py-2 text-xs font-body">
              <span className="text-secondary flex items-center gap-1.5">
                <span className="text-accent">🏷️</span> Code <strong>RADHA10</strong> for 10% off
              </span>
              <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">
                Active
              </span>
            </div>

            {/* Subtotal row */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-baseline justify-between font-body text-xs text-secondary">
                <span>Subtotal</span>
                <span className="font-semibold text-sm text-primary">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between font-body text-xs text-secondary">
                <span>Shipping</span>
                <span className={hasFreeShipping ? "text-emerald-700 font-semibold" : "text-primary font-medium"}>
                  {hasFreeShipping ? "FREE" : "₹199 (Free over ₹2,999)"}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-border/50 font-body">
                <span className="text-sm font-semibold text-primary">Total</span>
                <div className="text-right">
                  <span className="font-heading text-xl font-bold text-primary">
                    {formatPrice(hasFreeShipping ? subtotal : subtotal + 199)}
                  </span>
                  <p className="text-[10px] text-muted-foreground -mt-0.5">Taxes included</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              {/* Checkout Button */}
              <button
                onClick={() => handleNavigate("/checkout")}
                className="w-full bg-accent hover:bg-accent-dark text-on-accent font-body text-xs uppercase tracking-widest py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Proceed to Checkout
              </button>

              {/* Instant WhatsApp Order Button */}
              <a
                href={getCartWhatsAppUrl(items, hasFreeShipping ? subtotal : subtotal + 199)}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-body text-xs uppercase tracking-widest py-3 rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <svg width="17" height="17" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                  <path d="M16.02 3C8.83 3 3 8.82 3 16c0 2.3.6 4.54 1.74 6.5L3 29l6.68-1.72A12.94 12.94 0 0 0 16.02 29C23.2 29 29 23.18 29 16S23.2 3 16.02 3Zm0 23.63c-2.02 0-4-.54-5.72-1.57l-.4-.24-3.96 1.02 1.06-3.86-.26-.4A10.57 10.57 0 1 1 16.02 26.63Z" />
                </svg>
                Instant Order on WhatsApp
              </a>

              {/* View Full Cart Page Link */}
              <div className="text-center pt-1">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="font-body text-[11px] text-muted-foreground hover:text-accent underline underline-offset-4 transition-colors cursor-pointer"
                >
                  View Full Cart Page
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-body">
              <span className="flex items-center gap-1">
                <span className="text-accent">✓</span> BIS Hallmarked
              </span>
              <span className="flex items-center gap-1">
                <span className="text-accent">✓</span> 100% Insured
              </span>
              <span className="flex items-center gap-1">
                <span className="text-accent">✓</span> Easy Returns
              </span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

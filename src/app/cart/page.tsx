"use client";

import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem } = useCart();

  const updateQty = (index: number, delta: number) => {
    const item = cartItems[index];
    if (item) updateQuantity(index, item.quantity + delta);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 2999 ? 0 : 199;
  const total = subtotal + shipping;

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-cream via-background to-champagne py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-primary animate-fade-in-up">
            Shopping Bag
          </h1>
          <nav className="mt-4 animate-fade-in-up stagger-1" aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground">
              <li><Link href="/" className="hover:text-accent transition-colors cursor-pointer">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-primary font-medium">Cart</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-20 animate-fade-in-up">
              <div className="w-24 h-24 mx-auto rounded-full bg-cream flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A16207" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl text-primary">Your bag is empty</h2>
              <p className="font-body text-sm text-muted-foreground mt-2 mb-6">
                Looks like you haven&apos;t added any bangles yet.
              </p>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-on-accent font-body text-sm uppercase tracking-widest px-8 py-3.5 rounded-full transition-colors cursor-pointer"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                {/* Header Row */}
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 pb-4 border-b border-border font-body text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span>Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                  <span className="w-8" />
                </div>

                {/* Items */}
                <div className="divide-y divide-border">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="py-6 sm:grid sm:grid-cols-[2fr_1fr_1fr_auto] sm:gap-4 sm:items-center animate-fade-in-up"
                    >
                      {/* Product Info */}
                      <div className="flex gap-4">
                        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-champagne shrink-0 overflow-hidden border border-border/40">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                            {item.product.category}
                          </p>
                          <h3 className="font-heading text-base font-semibold text-primary mt-0.5 truncate">
                            <Link href={`/product/${item.product.slug}`} className="hover:text-accent transition-colors cursor-pointer">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="font-body text-sm text-secondary mt-1">
                            {formatPrice(item.product.price)}
                          </p>
                          <p className="font-body text-xs text-muted-foreground mt-0.5">
                            Size: {item.size}&quot;
                          </p>
                        </div>
                      </div>

                      {/* Desktop Quantity, Total, Remove */}
                      <div className="hidden sm:flex items-center justify-center">
                        <div className="inline-flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQty(index, -1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                            aria-label="Decrease"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center font-body text-sm font-semibold border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(index, 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                            aria-label="Increase"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>
                      </div>

                      <p className="hidden sm:block font-body text-base font-semibold text-primary text-right">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>

                      <button
                        onClick={() => removeItem(index)}
                        className="hidden sm:flex w-8 h-8 items-center justify-center text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>

                      {/* Mobile Row: Quantity + Price + Remove */}
                      <div className="flex sm:hidden items-center justify-between mt-4 pt-3 border-t border-border/40">
                        <div className="inline-flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQty(index, -1)}
                            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                            aria-label="Decrease"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="w-8 h-7 flex items-center justify-center font-body text-xs font-semibold border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(index, 1)}
                            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                            aria-label="Increase"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>

                        <p className="font-body text-sm font-semibold text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>

                        <button
                          onClick={() => removeItem(index)}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-secondary hover:text-accent transition-colors cursor-pointer group"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:-translate-x-1">
                      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 glass-gold rounded-2xl p-6 lg:p-8 animate-fade-in-up stagger-2">
                  <h2 className="font-heading text-xl font-semibold text-primary mb-6">
                    Order Summary
                  </h2>

                  <dl className="space-y-3">
                    <div className="flex justify-between font-body text-sm">
                      <dt className="text-secondary">Subtotal</dt>
                      <dd className="font-semibold text-primary">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between font-body text-sm">
                      <dt className="text-secondary">Shipping</dt>
                      <dd className={cn("font-semibold", shipping === 0 ? "text-green-600" : "text-primary")}>
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </dd>
                    </div>
                    {shipping > 0 && (
                      <p className="font-body text-[11px] text-accent">
                        Add {formatPrice(2999 - subtotal)} more for free shipping
                      </p>
                    )}
                    <div className="border-t border-border pt-3 flex justify-between font-body text-base">
                      <dt className="font-semibold text-primary">Total</dt>
                      <dd className="font-heading text-xl font-bold text-primary">
                        {formatPrice(total)}
                      </dd>
                    </div>
                  </dl>

                  {/* Coupon */}
                  <div className="mt-6">
                    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        placeholder="Coupon code"
                        className="flex-1 min-w-0 bg-white/80 border border-border rounded-lg px-4 py-2.5 font-body text-sm outline-none focus:border-accent transition-colors"
                        aria-label="Coupon code"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 border border-accent text-accent rounded-lg font-body text-xs uppercase tracking-wider hover:bg-accent hover:text-on-accent transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  </div>

                  {/* Checkout */}
                  <Link href="/checkout" className="w-full mt-6 bg-accent hover:bg-accent-dark text-on-accent font-body text-sm uppercase tracking-widest py-4 rounded-full transition-all duration-300 cursor-pointer hover:shadow-[0_8px_30px_rgba(161,98,7,0.25)] flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Proceed to Checkout
                  </Link>

                  {/* Trust */}
                  <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-center gap-4">
                    {["Visa", "Mastercard", "UPI"].map((m) => (
                      <span key={m} className="font-body text-[10px] tracking-wide text-muted-foreground px-2 py-0.5 border border-border/50 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

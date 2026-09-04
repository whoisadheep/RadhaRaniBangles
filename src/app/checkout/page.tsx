"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/supabase/orders";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal > 2999 ? 0 : 199;
  const total = subtotal + shipping;

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    setError("");
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const id = await createOrder({
        customer: String(form.get("customer")),
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        address: String(form.get("address")),
        items: items.map((item) => ({ name: item.product.name, quantity: item.quantity, price: item.product.price, size: item.size })),
        total,
      });
      clearCart();
      setOrderId(id);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We couldn't place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (orderId) return (
    <section className="min-h-[65vh] flex items-center justify-center px-4">
      <div className="max-w-lg text-center glass-gold rounded-2xl p-10">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-accent">Order received</p>
        <h1 className="font-heading text-4xl font-semibold text-primary mt-3">Thank you for your order</h1>
        <p className="font-body text-sm text-secondary mt-4 leading-relaxed">Your order <strong>{orderId}</strong> is confirmed. We&apos;ll contact you at the email or phone number provided to arrange payment and delivery.</p>
        <Link href="/collections" className="inline-flex mt-7 bg-accent text-on-accent font-body text-xs uppercase tracking-widest px-7 py-3.5 rounded-full hover:bg-accent-dark">Continue Shopping</Link>
      </div>
    </section>
  );

  if (!items.length) return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 text-center">
      <div><h1 className="font-heading text-4xl text-primary">Your bag is empty</h1><p className="font-body text-secondary mt-3">Add something beautiful before checking out.</p><Link href="/collections" className="inline-flex mt-6 bg-accent text-on-accent font-body text-xs uppercase tracking-widest px-7 py-3.5 rounded-full">Browse Collection</Link></div>
    </section>
  );

  return (
    <section className="py-10 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8"><Link href="/cart" className="font-body text-xs uppercase tracking-widest text-accent">← Back to bag</Link><h1 className="font-heading text-4xl sm:text-5xl font-semibold text-primary mt-3">Checkout</h1></div>
        <div className="grid lg:grid-cols-[1.3fr_.7fr] gap-8 lg:gap-12">
          <form onSubmit={submitOrder} className="space-y-6" aria-describedby={error ? "checkout-error" : undefined}>
            <div className="rounded-2xl border border-border bg-white p-6 sm:p-8"><h2 className="font-heading text-2xl font-semibold text-primary mb-5">Delivery details</h2><div className="grid sm:grid-cols-2 gap-4"><label className="sm:col-span-2 font-body text-sm text-secondary">Full name<input required name="customer" autoComplete="name" className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-accent" /></label><label className="font-body text-sm text-secondary">Email<input required type="email" name="email" autoComplete="email" className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-accent" /></label><label className="font-body text-sm text-secondary">Phone<input required type="tel" name="phone" autoComplete="tel" className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-accent" /></label><label className="sm:col-span-2 font-body text-sm text-secondary">Delivery address<textarea required name="address" autoComplete="street-address" rows={4} className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-accent" /></label></div></div>
            {error && <p id="checkout-error" role="alert" className="font-body text-sm text-destructive">{error}</p>}
            <button disabled={isSubmitting} className="w-full bg-accent text-on-accent font-body text-sm uppercase tracking-widest py-4 rounded-full hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}</button>
          </form>
          <aside className="h-fit rounded-2xl glass-gold p-6"><h2 className="font-heading text-2xl font-semibold text-primary">Your order</h2><div className="mt-5 space-y-4">{items.map((item) => <div key={`${item.product.id}-${item.size}`} className="flex gap-3"><img src={item.product.images[0]} alt="" className="w-14 h-16 object-cover rounded-lg"/><div className="flex-1 font-body text-sm"><p className="font-semibold text-primary">{item.product.name}</p><p className="text-muted-foreground">Size {item.size}&quot; · Qty {item.quantity}</p></div><p className="font-body text-sm font-semibold text-primary">{formatPrice(item.product.price * item.quantity)}</p></div>)}</div><dl className="border-t border-border mt-5 pt-4 space-y-2 font-body text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div><div className="flex justify-between"><dt>Shipping</dt><dd>{shipping ? formatPrice(shipping) : "Free"}</dd></div><div className="flex justify-between font-semibold text-primary text-base pt-2"><dt>Total</dt><dd>{formatPrice(total)}</dd></div></dl><p className="font-body text-xs text-muted-foreground mt-5 leading-relaxed">After submitting, our team will confirm your order and payment method with you.</p></aside>
        </div>
      </div>
    </section>
  );
}

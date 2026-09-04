"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { findOrdersByPhone, Order } from "@/lib/supabase/orders";
import { formatPrice } from "@/lib/utils";

const statusCopy: Record<Order["status"], { title: string; description: string; color: string }> = {
  pending: { title: "Order received", description: "We have received your order and will confirm it shortly.", color: "bg-amber-500" },
  processing: { title: "Being prepared", description: "Your pieces are being prepared for dispatch.", color: "bg-blue-500" },
  shipped: { title: "On its way", description: "Your order has been dispatched.", color: "bg-purple-500" },
  delivered: { title: "Delivered", description: "Your order has been delivered.", color: "bg-emerald-500" },
  cancelled: { title: "Cancelled", description: "This order has been cancelled. Contact us if you need help.", color: "bg-rose-500" },
};

export default function TrackOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError(""); setSearched(false);
    const phone = String(new FormData(event.currentTarget).get("phone") || "");
    try { setOrders(await findOrdersByPhone(phone)); setSearched(true); }
    catch (caught) { setOrders([]); setError(caught instanceof Error ? caught.message : "We couldn't look up your order."); }
    finally { setLoading(false); }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-cream via-background to-champagne py-14 lg:py-20 text-center">
        <div className="max-w-xl mx-auto px-4"><p className="font-body text-xs uppercase tracking-[0.22em] text-accent">Customer care</p><h1 className="font-heading text-4xl sm:text-5xl font-semibold text-primary mt-3">Track your order</h1><p className="font-body text-sm text-secondary mt-4">Enter the phone number you used at checkout to see the latest update.</p></div>
      </section>
      <section className="py-10 lg:py-16"><div className="max-w-2xl mx-auto px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-5 sm:p-7 shadow-sm"><label htmlFor="phone" className="font-body text-xs uppercase tracking-widest text-primary font-semibold">Phone number</label><div className="flex flex-col sm:flex-row gap-3 mt-3"><input id="phone" name="phone" required type="tel" placeholder="e.g. +91 98765 43210" className="min-w-0 flex-1 rounded-lg border border-border px-4 py-3 font-body text-sm outline-none focus:border-accent"/><button disabled={loading} className="bg-accent text-on-accent rounded-lg px-6 py-3 font-body text-xs uppercase tracking-widest hover:bg-accent-dark disabled:opacity-60">{loading ? "Looking up…" : "Track order"}</button></div>{error && <p role="alert" className="mt-3 font-body text-sm text-destructive">{error}</p>}</form>
        {searched && orders.length === 0 && <div className="mt-8 text-center rounded-2xl bg-cream p-8"><h2 className="font-heading text-2xl text-primary">No orders found</h2><p className="font-body text-sm text-secondary mt-2">Check the number and try again, or <Link href="/contact" className="text-accent underline">contact us</Link>.</p></div>}
        <div className="mt-8 space-y-5">{orders.map((order) => { const status = statusCopy[order.status]; return <article key={order.id} className="rounded-2xl border border-border bg-white p-6 sm:p-7"><div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3"><div><p className="font-body text-xs uppercase tracking-widest text-muted-foreground">Order {order.id}</p><h2 className="font-heading text-2xl font-semibold text-primary mt-1">{status.title}</h2></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 font-body text-xs capitalize text-primary"><span className={`w-2 h-2 rounded-full ${status.color}`} />{order.status}</span></div><p className="font-body text-sm text-secondary mt-3">{status.description}</p>{order.trackingId && <p className="font-body text-sm mt-4 text-primary">Tracking ID: <strong>{order.trackingId}</strong></p>}<div className="border-t border-border mt-5 pt-4 space-y-2">{order.items.map((item, index) => <div key={`${item.name}-${index}`} className="flex justify-between gap-4 font-body text-sm"><span className="text-secondary">{item.name} <span className="text-muted-foreground">× {item.quantity}</span></span><span className="font-semibold text-primary">{formatPrice(item.price * item.quantity)}</span></div>)}<div className="flex justify-between pt-2 font-body text-sm font-semibold text-primary"><span>Total</span><span>{formatPrice(order.total)}</span></div></div></article>; })}</div>
      </div></section>
    </>
  );
}

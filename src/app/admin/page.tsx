"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { products, categories, Product } from "@/lib/data";
import { formatPrice, cn } from "@/lib/utils";
import { fetchProducts } from "@/lib/supabase/products";
import { fetchOrders } from "@/lib/supabase/orders";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════════
   Mock Data — Recent Orders
   ═══════════════════════════════════════════════════ */

interface RecentOrder {
  id: string;
  customer: {
    name: string;
    city: string;
  };
  item: string;
  amount: number;
  status: "Delivered" | "Shipped" | "Pending";
  date: string;
}

const RECENT_ORDERS: RecentOrder[] = [];

const STATUS_CONFIG: Record<
  RecentOrder["status"],
  { badge: string; dot: string }
> = {
  Pending: {
    badge: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    dot: "bg-amber-400",
  },
  Shipped: {
    badge: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    dot: "bg-sky-400",
  },
  Delivered: {
    badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    dot: "bg-emerald-400",
  },
};

export default function AdminDashboardPage() {
  const [productList, setProductList] = useState<Product[]>(products);
  const [orderList, setOrderList] = useState<any[]>([]);
  const supabaseActive = isSupabaseConfigured();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [liveProducts, liveOrders] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
        ]);
        if (liveProducts && liveProducts.length > 0) {
          setProductList(liveProducts);
        }
        setOrderList(liveOrders || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    }
    loadDashboard();
  }, []);

  const topProducts = productList.slice(0, 4);
  const totalRevenue = orderList.reduce((sum, o) => sum + (Number(o.total || o.amount) || 0), 0);
  const totalOrdersCount = orderList.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* ─── 1. Page Header ─── */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-[#A16207]/[0.09] p-6 sm:p-8 shadow-2xl shadow-black/10">
        <div className="pointer-events-none absolute -right-12 -top-16 w-48 h-48 rounded-full bg-[#D4A853]/10 blur-3xl" />
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.25em] text-[#D4A853] mb-2">Atelier overview</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-white tracking-wide">
            Good to see you, Admin.
          </h1>
          <p className="font-body text-sm text-white/55 mt-2 max-w-xl">
            Keep an eye on orders, inventory, and the conversations that shape your next sale.
          </p>
        </div>
        <div className="relative flex flex-wrap items-center gap-3">
          {supabaseActive ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-body text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Supabase
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-body text-white/60">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Offline Mode
            </div>
          )}
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4A853] hover:bg-[#f4cf7f] text-[#1c1712] text-xs font-body font-semibold transition-colors cursor-pointer shadow-lg shadow-[#A16207]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#100e0d]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      {/* ─── 2. KPI Cards Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white/[0.045] border border-white/[0.09] rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 3h12" />
                <path d="M6 8h12" />
                <path d="M6 13l8.5 8" />
                <path d="M6 13h3a4 4 0 0 0 0-8" />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-body">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
              +12.5%
            </span>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-white">
              {formatPrice(totalRevenue)}
            </p>
            <p className="font-body text-xs text-white/40 uppercase tracking-wider mt-1">
              Total Revenue
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white/[0.045] border border-white/[0.09] rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-body">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
              +8.3%
            </span>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-white">{totalOrdersCount}</p>
            <p className="font-body text-xs text-white/40 uppercase tracking-wider mt-1">
              Total Orders
            </p>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white/[0.045] border border-white/[0.09] rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-[#A16207]/15 border border-[#A16207]/30 flex items-center justify-center text-[#D4A853]">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="6 3 18 3 22 9 12 22 2 9" />
                <line x1="12" y1="22" x2="12" y2="9" />
                <line x1="2" y1="9" x2="22" y2="9" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-[#D4A853] bg-[#A16207]/10 px-2 py-0.5 rounded-full border border-[#A16207]/25 font-body">
              Live
            </span>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-white">
              {productList.length}
            </p>
            <p className="font-body text-xs text-white/40 uppercase tracking-wider mt-1">
              Active Products
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white/[0.045] border border-white/[0.09] rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 font-body">
              Sections
            </span>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-white">
              {categories.length}
            </p>
            <p className="font-body text-xs text-white/40 uppercase tracking-wider mt-1">
              Categories
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3. Recent Orders Table ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-white tracking-wide">
              Recent Orders
            </h2>
            <p className="font-body text-xs text-white/40 mt-0.5">
              Latest client purchases and delivery status
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="font-body text-xs text-[#D4A853] hover:text-[#f3d38e] transition-colors flex items-center gap-1.5 group"
          >
            View all orders
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        <div className="bg-[#191614]/70 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl shadow-black/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                  <th className="font-body text-[11px] uppercase tracking-wider text-white/40 font-semibold px-5 py-3.5">
                    Order ID
                  </th>
                  <th className="font-body text-[11px] uppercase tracking-wider text-white/40 font-semibold px-5 py-3.5">
                    Customer
                  </th>
                  <th className="font-body text-[11px] uppercase tracking-wider text-white/40 font-semibold px-5 py-3.5">
                    Items
                  </th>
                  <th className="font-body text-[11px] uppercase tracking-wider text-white/40 font-semibold px-5 py-3.5">
                    Amount
                  </th>
                  <th className="font-body text-[11px] uppercase tracking-wider text-white/40 font-semibold px-5 py-3.5">
                    Status
                  </th>
                  <th className="font-body text-[11px] uppercase tracking-wider text-white/40 font-semibold px-5 py-3.5">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-white/40">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="1" y="3" width="15" height="13" rx="1" />
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        </svg>
                      </div>
                      <p className="font-heading text-sm text-white/70">No orders placed yet</p>
                      <p className="font-body text-xs text-white/40 mt-1">Incoming customer orders will appear here automatically.</p>
                    </td>
                  </tr>
                ) : (
                  orderList.slice(0, 5).map((order) => {
                    const statusStr = String(order.status || "pending");
                    const statusKey = (statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase()) as "Delivered" | "Shipped" | "Pending";
                    const statusInfo = STATUS_CONFIG[statusKey] || STATUS_CONFIG.Pending;
                    const customerName = typeof order.customer === "object" ? order.customer.name : (order.customer || "Guest Customer");
                    const customerCity = typeof order.customer === "object" ? order.customer.city : (order.address?.split(",")?.[1]?.trim() || "India");
                    const itemName = order.item || (order.items && order.items[0]?.name) || "Jewelry Order";
                    const amount = Number(order.total || order.amount || 0);

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-5 py-4 font-body font-mono text-xs font-medium text-[#D4A853]">
                          {order.id}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-body text-sm font-medium text-white">
                            {customerName}
                          </p>
                          <p className="font-body text-[11px] text-white/40">
                            {customerCity}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-body text-sm text-white/80">
                          {itemName}
                        </td>
                        <td className="px-5 py-4 font-heading text-base font-semibold text-white">
                          {formatPrice(amount)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border font-body",
                              statusInfo.badge
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                statusInfo.dot
                              )}
                            />
                            {statusKey}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-body text-xs text-white/50 whitespace-nowrap">
                          {order.date}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── 4. Top Selling Products ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-white tracking-wide">
              Top Selling Products
            </h2>
            <p className="font-body text-xs text-white/40 mt-0.5">
              High-demand bangles and signature collections
            </p>
          </div>
          <Link
            href="/admin/products"
            className="font-body text-xs text-[#D4A853] hover:text-[#f3d38e] transition-colors flex items-center gap-1.5 group"
          >
            Manage catalog
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/[0.045] border border-white/[0.09] rounded-2xl p-4 flex items-center gap-3.5 hover:border-[#D4A853]/45 hover:bg-white/[0.07] transition-all duration-200 group"
            >
              {/* Product Image: rounded-lg, 48x48 */}
              <Image
                src={product.images[0]}
                alt={product.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover bg-white/5 shrink-0 border border-white/[0.08] group-hover:scale-105 transition-transform duration-200"
              />
              <div className="min-w-0 flex-1">
                <h3
                  className="font-heading font-semibold text-sm text-white truncate group-hover:text-[#D4A853] transition-colors"
                  title={product.name}
                >
                  {product.name}
                </h3>
                <p className="font-body text-xs text-white/40 truncate mt-0.5">
                  {product.category}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-heading font-bold text-sm text-[#D4A853]">
                    {formatPrice(product.price)}
                  </span>
                  <div
                    className="flex items-center gap-1"
                    title={`${product.rating} out of 5 stars`}
                  >
                    <div className="flex text-[#D4A853]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={cn(
                            "w-2.5 h-2.5",
                            star <= Math.round(product.rating)
                              ? "fill-[#D4A853] text-[#D4A853]"
                              : "fill-white/10 text-white/20"
                          )}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-body text-[10px] text-white/50">
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

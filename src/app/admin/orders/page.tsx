"use client";

import { useState, useMemo, useEffect } from "react";
import { formatPrice, cn } from "@/lib/utils";
import { fetchOrders, updateOrderStatus, deleteOrder } from "@/lib/supabase/orders";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════════
   Types & Interfaces
   ═══════════════════════════════════════════════════ */

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  address: string;
  date: string;
  trackingId?: string;
}

type FilterTab = "all" | OrderStatus;

/* ═══════════════════════════════════════════════════
   No fake initial orders
   ═══════════════════════════════════════════════════ */

const INITIAL_ORDERS: Order[] = [];

/* ═══════════════════════════════════════════════════
   Status Badges Helper
   ═══════════════════════════════════════════════════ */

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  processing: {
    label: "Processing",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  shipped: {
    label: "Shipped",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    dot: "bg-purple-400",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
        config.bg,
        config.text,
        config.border
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   Main Orders Management Page
   ═══════════════════════════════════════════════════ */

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<OrderStatus>("pending");
  const [editTrackingId, setEditTrackingId] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const supabaseActive = isSupabaseConfigured();

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchOrders();
        setOrders((data || []) as Order[]);
      } catch (err) {
        console.error("Failed to load orders from Supabase:", err);
        setOrders([]);
      }
    }
    loadOrders();
  }, []);

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    await deleteOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrder?.id === orderId) setSelectedOrder(null);
    setToastMessage("Order deleted successfully");
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filter tabs config
  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      processing: orders.filter((o) => o.status === "processing").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  // Tab count lookup
  const getTabCount = (tab: FilterTab) => {
    if (tab === "all") return stats.total;
    return stats[tab];
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (selectedStatus !== "all" && order.status !== selectedStatus) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesCustomer = order.customer.toLowerCase().includes(query);
        const matchesEmail = order.email.toLowerCase().includes(query);
        const matchesPhone = order.phone.toLowerCase().includes(query);
        const matchesAddress = order.address.toLowerCase().includes(query);
        const matchesTracking = order.trackingId?.toLowerCase().includes(query);
        const matchesItems = order.items.some((item) =>
          item.name.toLowerCase().includes(query)
        );
        return (
          matchesId ||
          matchesCustomer ||
          matchesEmail ||
          matchesPhone ||
          matchesAddress ||
          matchesTracking ||
          matchesItems
        );
      }
      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  // Open modal for an order
  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditTrackingId(order.trackingId || "");
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  // Save changes to order
  const handleSaveChanges = async () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          status: editStatus,
          trackingId: editTrackingId.trim() || undefined,
        };
      }
      return o;
    });

    setOrders(updatedOrders);

    try {
      await updateOrderStatus(
        selectedOrder.id,
        editStatus,
        editTrackingId.trim() || undefined
      );
    } catch (err) {
      console.error("Failed to update order status in Supabase:", err);
    }

    // Show temporary toast feedback
    setToastMessage(`Order ${selectedOrder.id} updated successfully`);
    setTimeout(() => setToastMessage(null), 3000);

    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 bg-[#1C1917] border border-[#D4A853]/40 text-white px-4 py-3 rounded-xl shadow-xl animate-fade-in font-body text-xs">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4A853"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Page Header & Stats Row ── */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <h1 className="font-heading text-2xl lg:text-3xl font-semibold text-white tracking-wide">
              Orders
            </h1>
            <span className="font-body text-xs px-2.5 py-0.5 rounded-full bg-[#A16207]/15 text-[#D4A853] border border-[#A16207]/30">
              {stats.total} Total
            </span>
            {supabaseActive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Supabase
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Offline Mode (Local State)
              </span>
            )}
          </div>
          <p className="font-body text-xs lg:text-sm text-white/50">
            View, track, and update fulfillment for customer orders
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
          {/* Total Orders */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between hover:border-white/[0.12] transition-colors">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <span className="font-body text-[11px] uppercase tracking-wider font-medium">
                Total Orders
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl lg:text-3xl font-bold text-white">
                {stats.total}
              </span>
              <span className="font-body text-[11px] text-white/40">orders</span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/20 transition-colors">
            <div className="flex items-center justify-between text-amber-400/80 mb-2">
              <span className="font-body text-[11px] uppercase tracking-wider font-medium text-white/40">
                Pending
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl lg:text-3xl font-bold text-amber-400">
                {stats.pending}
              </span>
              <span className="font-body text-[11px] text-amber-400/50">awaiting</span>
            </div>
          </div>

          {/* Shipped */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-colors">
            <div className="flex items-center justify-between text-purple-400/80 mb-2">
              <span className="font-body text-[11px] uppercase tracking-wider font-medium text-white/40">
                Shipped
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl lg:text-3xl font-bold text-purple-400">
                {stats.shipped}
              </span>
              <span className="font-body text-[11px] text-purple-400/50">in transit</span>
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/20 transition-colors">
            <div className="flex items-center justify-between text-emerald-400/80 mb-2">
              <span className="font-body text-[11px] uppercase tracking-wider font-medium text-white/40">
                Delivered
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl lg:text-3xl font-bold text-emerald-400">
                {stats.delivered}
              </span>
              <span className="font-body text-[11px] text-emerald-400/50">completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Filter Tabs & Search Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = selectedStatus === tab.key;
            const count = getTabCount(tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full font-body text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5",
                  isActive
                    ? "bg-[#A16207]/20 text-[#D4A853] border border-[#A16207]/40 shadow-sm shadow-[#A16207]/10"
                    : "bg-white/[0.03] text-white/50 hover:text-white/80 hover:bg-white/[0.06] border border-transparent"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-[#D4A853]/20 text-[#D4A853]"
                      : "bg-white/10 text-white/40"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 font-body text-xs text-white placeholder:text-white/30 focus:border-[#A16207]/50 focus:outline-none focus:ring-1 focus:ring-[#A16207]/20 transition-all"
          />
          <svg
            className="absolute left-3 top-2.5 text-white/40 pointer-events-none"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-white/40 hover:text-white transition-colors cursor-pointer text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Orders Table ── */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[840px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="py-3.5 px-4 font-body text-[11px] font-semibold tracking-wider uppercase text-white/40">
                  Order ID
                </th>
                <th className="py-3.5 px-4 font-body text-[11px] font-semibold tracking-wider uppercase text-white/40">
                  Customer
                </th>
                <th className="py-3.5 px-4 font-body text-[11px] font-semibold tracking-wider uppercase text-white/40">
                  Items
                </th>
                <th className="py-3.5 px-4 font-body text-[11px] font-semibold tracking-wider uppercase text-white/40">
                  Total
                </th>
                <th className="py-3.5 px-4 font-body text-[11px] font-semibold tracking-wider uppercase text-white/40">
                  Status
                </th>
                <th className="py-3.5 px-4 font-body text-[11px] font-semibold tracking-wider uppercase text-white/40">
                  Date
                </th>
                <th className="py-3.5 px-4 font-body text-[11px] font-semibold tracking-wider uppercase text-white/40 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-white/40">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        className="mb-2 text-white/20"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      <p className="font-body text-sm text-white/60">No orders found</p>
                      <p className="font-body text-xs text-white/30 mt-0.5">
                        Try adjusting your filters or search terms
                      </p>
                      {(selectedStatus !== "all" || searchQuery) && (
                        <button
                          onClick={() => {
                            setSelectedStatus("all");
                            setSearchQuery("");
                          }}
                          className="mt-3 font-body text-xs text-[#D4A853] hover:underline cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const totalItems = order.items.reduce(
                    (acc, curr) => acc + curr.quantity,
                    0
                  );
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Order ID */}
                      <td className="py-4 px-4 font-mono text-xs text-[#D4A853] font-medium whitespace-nowrap">
                        {order.id}
                      </td>

                      {/* Customer Name + Phone */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-body text-xs font-medium text-white group-hover:text-white">
                          {order.customer}
                        </div>
                        <div className="font-body text-[11px] text-white/40">
                          {order.phone}
                        </div>
                      </td>

                      {/* Items Summary */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-body text-xs text-white/80">
                          {totalItems} {totalItems === 1 ? "item" : "items"}
                        </div>
                        <div className="font-body text-[11px] text-white/40 truncate max-w-[200px]" title={order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}>
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 font-body text-xs font-semibold text-white whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 font-body text-xs text-white/60 whitespace-nowrap">
                        {order.date}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModal(order)}
                          className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-[#A16207]/20 text-white/70 hover:text-[#D4A853] border border-white/[0.08] hover:border-[#A16207]/40 font-body text-xs font-medium transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination / summary bar */}
        <div className="py-3 px-4 border-t border-white/[0.06] bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between text-xs font-body text-white/40 gap-2">
          <span>
            Showing <strong className="text-white/70">{filteredOrders.length}</strong> of{" "}
            <strong className="text-white/70">{orders.length}</strong> orders
          </span>
          <span className="text-[11px] text-white/30">
            Click &quot;View&quot; on any order to update status or add tracking ID
          </span>
        </div>
      </div>

      {/* ── 4. Order Detail Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={handleCloseModal}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-2xl bg-[#0C0A09] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#A16207]/20 border border-[#A16207]/30 flex items-center justify-center text-[#D4A853]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl font-semibold text-white">
                      Order Details
                    </h2>
                    <span className="font-mono text-xs text-[#D4A853] font-semibold bg-[#A16207]/15 px-2 py-0.5 rounded border border-[#A16207]/30">
                      {selectedOrder.id}
                    </span>
                  </div>
                  <p className="font-body text-xs text-white/40 mt-0.5">
                    Placed on {selectedOrder.date}
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Customer Info Card */}
              <div>
                <h3 className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#D4A853] mb-3 flex items-center gap-1.5">
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Customer Information
                </h3>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider">
                      Name
                    </span>
                    <span className="text-white font-medium text-sm mt-0.5 block">
                      {selectedOrder.customer}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider">
                      Phone
                    </span>
                    <a
                      href={`tel:${selectedOrder.phone}`}
                      className="text-[#D4A853] hover:underline mt-0.5 block"
                    >
                      {selectedOrder.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider">
                      Email
                    </span>
                    <a
                      href={`mailto:${selectedOrder.email}`}
                      className="text-white/80 hover:text-[#D4A853] hover:underline mt-0.5 block truncate"
                    >
                      {selectedOrder.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider">
                      Shipping Address
                    </span>
                    <span className="text-white/80 mt-0.5 block leading-relaxed">
                      {selectedOrder.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#D4A853] mb-3 flex items-center gap-1.5">
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
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Items Ordered ({selectedOrder.items.length})
                </h3>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                  <div className="divide-y divide-white/[0.04]">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="p-3.5 flex items-center justify-between gap-4 text-xs font-body"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-white/40 text-[11px] mt-0.5">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="font-semibold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Summary Row */}
                  <div className="p-3.5 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between">
                    <span className="font-body text-xs font-medium text-white/60">
                      Order Total
                    </span>
                    <span className="font-heading text-lg font-bold text-[#D4A853]">
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Tracking Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Status Dropdown */}
                <div>
                  <label
                    htmlFor="order-status-select"
                    className="block font-body text-[11px] uppercase tracking-wider text-white/50 mb-2 font-medium"
                  >
                    Order Status
                  </label>
                  <div className="relative">
                    <select
                      id="order-status-select"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                      className="w-full appearance-none bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 font-body text-xs text-white focus:outline-none focus:border-[#A16207]/60 focus:ring-1 focus:ring-[#A16207]/20 transition-all cursor-pointer"
                    >
                      <option value="pending" className="bg-[#1C1917] text-white">
                        Pending (Awaiting fulfillment)
                      </option>
                      <option value="processing" className="bg-[#1C1917] text-white">
                        Processing (Packing in progress)
                      </option>
                      <option value="shipped" className="bg-[#1C1917] text-white">
                        Shipped (Handed to courier)
                      </option>
                      <option value="delivered" className="bg-[#1C1917] text-white">
                        Delivered (Completed)
                      </option>
                      <option value="cancelled" className="bg-[#1C1917] text-white">
                        Cancelled (Voided)
                      </option>
                    </select>
                    <div className="absolute right-3.5 top-3 pointer-events-none text-white/40">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Tracking ID input */}
                <div>
                  <label
                    htmlFor="tracking-id-input"
                    className="block font-body text-[11px] uppercase tracking-wider text-white/50 mb-2 font-medium"
                  >
                    Tracking ID / AWB Number
                  </label>
                  <input
                    id="tracking-id-input"
                    type="text"
                    value={editTrackingId}
                    onChange={(e) => setEditTrackingId(e.target.value)}
                    placeholder="e.g. BLUEDART-8829104"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 font-body text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60 focus:ring-1 focus:ring-[#A16207]/20 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-body text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete Order
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white font-body text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="px-5 py-2 rounded-xl bg-[#A16207] hover:bg-[#7C4D05] text-white font-body text-xs font-semibold tracking-wide transition-all shadow-md hover:shadow-[#A16207]/20 cursor-pointer flex items-center gap-1.5"
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

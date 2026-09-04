"use client";

import { useState, useMemo, useEffect } from "react";
import { cn, formatPrice } from "@/lib/utils";
import {
  fetchCoupons,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon,
  type Coupon,
} from "@/lib/supabase/coupons";

/* ═══════════════════════════════════════════════════
   No fake initial coupons
   ═══════════════════════════════════════════════════ */

const INITIAL_COUPONS: Coupon[] = [];

type FilterStatus = "all" | "active" | "inactive";

function formatExpiryDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function isExpired(dateString: string): boolean {
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const expiry = new Date(year, month - 1, day, 23, 59, 59);
    return expiry.getTime() < Date.now();
  } catch {
    return false;
  }
}

/* ═══════════════════════════════════════════════════
   Coupons Management Page
   ═══════════════════════════════════════════════════ */

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    minOrder: "",
    maxUses: "",
    expiresAt: "",
  });

  // Derived metrics
  const totalCoupons = coupons.length;
  const activeCouponsCount = coupons.filter((c) => c.active).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  // Filtered coupons list
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      // Status filter
      if (filterStatus === "active" && !coupon.active) return false;
      if (filterStatus === "inactive" && coupon.active) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return coupon.code.toLowerCase().includes(q);
      }

      return true;
    });
  }, [coupons, filterStatus, searchQuery]);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const data = await fetchCoupons();
        setCoupons(data || []);
      } catch (err) {
        console.error("Failed to load coupons:", err);
        setCoupons([]);
      }
    }
    loadCoupons();
  }, []);

  // Handlers
  const handleToggleActive = async (id: string) => {
    const target = coupons.find((c) => c.id === id);
    if (!target) return;
    const nextActive = !target.active;
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: nextActive } : c))
    );
    await toggleCouponStatus(id, nextActive);
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete coupon code "${code}"?`)) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      await deleteCoupon(id);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleOpenModal = () => {
    setFormData({
      code: "",
      discount: "",
      type: "percentage",
      minOrder: "1999",
      maxUses: "200",
      expiresAt: "2026-12-31",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError("");
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formData.code.trim().toUpperCase().replace(/\s+/g, "");

    if (!cleanCode) {
      setFormError("Please enter a valid coupon code.");
      return;
    }

    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      setFormError(`Coupon code "${cleanCode}" already exists.`);
      return;
    }

    const discountNum = Number(formData.discount);
    if (isNaN(discountNum) || discountNum <= 0) {
      setFormError("Discount value must be greater than 0.");
      return;
    }

    if (formData.type === "percentage" && discountNum > 100) {
      setFormError("Percentage discount cannot exceed 100%.");
      return;
    }

    const minOrderNum = Number(formData.minOrder) || 0;
    const maxUsesNum = Number(formData.maxUses) || 100;

    if (!formData.expiresAt) {
      setFormError("Please specify an expiration date.");
      return;
    }

    const created = await createCoupon({
      code: cleanCode,
      discount: discountNum,
      type: formData.type,
      minOrder: minOrderNum,
      maxUses: maxUsesNum,
      expiresAt: formData.expiresAt,
    });

    if (created) {
      setCoupons((prev) => [created, ...prev]);
    } else {
      const fallbackCoupon: Coupon = {
        id: `cpn-${Date.now()}`,
        code: cleanCode,
        discount: discountNum,
        type: formData.type,
        minOrder: minOrderNum,
        maxUses: maxUsesNum,
        usedCount: 0,
        active: true,
        expiresAt: formData.expiresAt,
      };
      setCoupons((prev) => [fallbackCoupon, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl lg:text-3xl font-semibold text-white tracking-wide">
              Coupons
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-body font-medium bg-[#A16207]/20 text-[#D4A853] border border-[#A16207]/40">
              {activeCouponsCount} Active
            </span>
          </div>
          <p className="font-body text-xs text-white/40 mt-1">
            Create and manage promotional discount codes and gift vouchers
          </p>
        </div>

        {/* Create Coupon Button */}
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#A16207] hover:bg-[#7C4D05] text-white font-body text-xs uppercase tracking-wider font-semibold shadow-md transition-all duration-200 cursor-pointer w-fit"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Coupon
        </button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
          <p className="font-body text-[11px] uppercase tracking-wider text-white/40 mb-1">
            Total Coupons
          </p>
          <p className="font-heading text-2xl font-bold text-white">
            {totalCoupons}
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
          <p className="font-body text-[11px] uppercase tracking-wider text-white/40 mb-1">
            Active Campaigns
          </p>
          <p className="font-heading text-2xl font-bold text-[#D4A853]">
            {activeCouponsCount}
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 col-span-2 sm:col-span-1">
          <p className="font-body text-[11px] uppercase tracking-wider text-white/40 mb-1">
            Total Redemptions
          </p>
          <p className="font-heading text-2xl font-bold text-white">
            {totalRedemptions.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Filter Buttons */}
        <div className="flex items-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 gap-1">
          <button
            onClick={() => setFilterStatus("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg font-body text-xs font-medium transition-all duration-200 cursor-pointer",
              filterStatus === "all"
                ? "bg-[#A16207]/20 text-[#D4A853] border border-[#A16207]/30 shadow-sm"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            )}
          >
            All ({totalCoupons})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg font-body text-xs font-medium transition-all duration-200 cursor-pointer",
              filterStatus === "active"
                ? "bg-[#A16207]/20 text-[#D4A853] border border-[#A16207]/30 shadow-sm"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            )}
          >
            Active ({activeCouponsCount})
          </button>
          <button
            onClick={() => setFilterStatus("inactive")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg font-body text-xs font-medium transition-all duration-200 cursor-pointer",
              filterStatus === "inactive"
                ? "bg-[#A16207]/20 text-[#D4A853] border border-[#A16207]/30 shadow-sm"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            )}
          >
            Inactive ({totalCoupons - activeCouponsCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 font-body text-xs text-white placeholder:text-white/30 outline-none focus:border-[#A16207]/50 focus:ring-1 focus:ring-[#A16207]/20 transition-all"
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Coupons Grid ── */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#D4A853]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="5" x2="5" y2="19" />
              <circle cx="6.5" cy="6.5" r="2.5" />
              <circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
          </div>
          <h3 className="font-heading text-lg font-medium text-white mb-1">
            No coupons found
          </h3>
          <p className="font-body text-xs text-white/40 mb-4">
            {searchQuery
              ? `No coupon codes matched "${searchQuery}".`
              : "No coupons available under the selected filter."}
          </p>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 rounded-lg bg-[#A16207] hover:bg-[#7C4D05] text-white font-body text-xs font-medium cursor-pointer"
          >
            Create New Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((coupon) => {
            const usagePercent = Math.min(
              100,
              Math.round((coupon.usedCount / coupon.maxUses) * 100)
            );
            const expired = isExpired(coupon.expiresAt);

            return (
              <div
                key={coupon.id}
                className={cn(
                  "bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all flex flex-col justify-between relative group",
                  !coupon.active && "opacity-60 hover:opacity-80"
                )}
              >
                {/* ── Card Top: Code + Actions ── */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {/* Monospace gold code */}
                      <span className="font-mono text-xl font-bold tracking-wider text-[#D4A853]">
                        {coupon.code}
                      </span>
                      {/* Copy button */}
                      <button
                        type="button"
                        onClick={() => handleCopyCode(coupon.code)}
                        title="Copy code"
                        className="p-1 rounded text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        {copiedCode === coupon.code ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Right Controls: Active Toggle Switch + Delete Button */}
                    <div className="flex items-center gap-2">
                      {/* Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={coupon.active}
                        onClick={() => handleToggleActive(coupon.id)}
                        title={coupon.active ? "Deactivate coupon" : "Activate coupon"}
                        className={cn(
                          "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
                          coupon.active ? "bg-[#A16207]" : "bg-white/15"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out my-auto ml-0.75",
                            coupon.active ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                        title="Delete coupon"
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* ── Discount Display & Type Badge ── */}
                  <div className="flex items-baseline justify-between gap-2 mb-4">
                    <div className="font-heading text-2xl font-bold text-white">
                      {coupon.type === "percentage"
                        ? `${coupon.discount}% OFF`
                        : `${formatPrice(coupon.discount)} OFF`}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold font-body tracking-wider bg-white/[0.06] text-white/60 border border-white/[0.08]">
                      {coupon.type === "percentage" ? "Percentage" : "Fixed Amount"}
                    </span>
                  </div>

                  {/* ── Minimum Order & Expiry Details ── */}
                  <div className="space-y-1.5 pb-4 border-b border-white/[0.06] text-xs font-body">
                    <div className="flex justify-between text-white/60">
                      <span>Min Order:</span>
                      <span className="text-white font-medium">
                        {formatPrice(coupon.minOrder)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-white/60">
                      <span>Expiry:</span>
                      <span
                        className={cn(
                          "font-medium",
                          expired ? "text-red-400" : "text-white/80"
                        )}
                      >
                        {formatExpiryDate(coupon.expiresAt)}
                        {expired && " (Expired)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Card Bottom: Usage Progress Bar ── */}
                <div className="pt-4 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-body text-white/50">
                    <span>Usage</span>
                    <span className="text-white/80 font-medium">
                      {coupon.usedCount} / {coupon.maxUses} ({usagePercent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        usagePercent >= 90
                          ? "bg-gradient-to-r from-amber-500 to-red-500"
                          : "bg-gradient-to-r from-[#A16207] to-[#D4A853]"
                      )}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
         Create Coupon Modal
         ═══════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up">
          <div
            className="w-full max-w-md bg-[#141210] border border-white/[0.1] rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient gold glow */}
            <div
              className="absolute -top-16 -right-16 w-32 h-32 rounded-full pointer-events-none opacity-20"
              style={{
                background: "radial-gradient(circle, #A16207 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
              <div>
                <h2 className="font-heading text-xl font-semibold text-white tracking-wide">
                  Create New Coupon
                </h2>
                <p className="font-body text-xs text-white/40 mt-0.5">
                  Set promo code rules and limits
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-body text-xs">
                  {formError}
                </div>
              )}

              {/* Code */}
              <div>
                <label className="block font-body text-[11px] uppercase tracking-wider text-white/50 mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI30"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3.5 py-2.5 font-mono text-sm uppercase text-[#D4A853] placeholder:text-white/20 outline-none focus:border-[#A16207] focus:ring-1 focus:ring-[#A16207]/30 transition-all"
                />
              </div>

              {/* Type and Discount Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-[11px] uppercase tracking-wider text-white/50 mb-1.5">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full bg-[#1C1917] border border-white/[0.1] rounded-lg px-3 py-2.5 font-body text-xs text-white outline-none focus:border-[#A16207] focus:ring-1 focus:ring-[#A16207]/30 transition-all cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-[11px] uppercase tracking-wider text-white/50 mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={formData.type === "percentage" ? "e.g. 20" : "e.g. 500"}
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3.5 py-2.5 font-body text-xs text-white placeholder:text-white/20 outline-none focus:border-[#A16207] focus:ring-1 focus:ring-[#A16207]/30 transition-all"
                  />
                </div>
              </div>

              {/* Min Order & Max Uses Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-[11px] uppercase tracking-wider text-white/50 mb-1.5">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1999"
                    value={formData.minOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, minOrder: e.target.value })
                    }
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3.5 py-2.5 font-body text-xs text-white placeholder:text-white/20 outline-none focus:border-[#A16207] focus:ring-1 focus:ring-[#A16207]/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-body text-[11px] uppercase tracking-wider text-white/50 mb-1.5">
                    Max Redemptions
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 200"
                    value={formData.maxUses}
                    onChange={(e) =>
                      setFormData({ ...formData, maxUses: e.target.value })
                    }
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3.5 py-2.5 font-body text-xs text-white placeholder:text-white/20 outline-none focus:border-[#A16207] focus:ring-1 focus:ring-[#A16207]/30 transition-all"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block font-body text-[11px] uppercase tracking-wider text-white/50 mb-1.5">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3.5 py-2.5 font-body text-xs text-white outline-none focus:border-[#A16207] focus:ring-1 focus:ring-[#A16207]/30 transition-all [color-scheme:dark]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08] mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-lg text-white/60 hover:text-white font-body text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#A16207] hover:bg-[#7C4D05] text-white font-body text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer shadow-md"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

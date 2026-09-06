"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchAllReviews, deleteReview, submitReview, Review } from "@/lib/supabase/reviews";
import { fetchProducts } from "@/lib/supabase/products";
import { Product, products as fallbackProducts } from "@/lib/data";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add review modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formProductId, setFormProductId] = useState(fallbackProducts[0]?.id || "prod-1");
  const [formAuthor, setFormAuthor] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [revs, prods] = await Promise.all([fetchAllReviews(), fetchProducts()]);
      setReviews(revs);
      if (prods && prods.length > 0) {
        setProducts(prods);
        setFormProductId(prods[0].id);
      }
    } catch (err) {
      console.error("Failed to load reviews in admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer review?")) return;
    setDeletingId(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor.trim() || !formComment.trim()) return;

    setSubmitting(true);
    try {
      const created = await submitReview({
        productId: formProductId,
        authorName: formAuthor.trim(),
        authorLocation: formLocation.trim() || undefined,
        rating: formRating,
        title: formTitle.trim() || undefined,
        comment: formComment.trim(),
        verifiedPurchase: true,
      });

      setReviews((prev) => [created, ...prev]);
      setShowAddModal(false);
      setFormAuthor("");
      setFormLocation("");
      setFormTitle("");
      setFormComment("");
      setFormRating(5);
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Product lookup map
  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesRating = selectedRating === "all" || Math.round(r.rating) === selectedRating;
      const prodName = productMap.get(r.productId)?.name || "";
      const matchesSearch =
        searchQuery === "" ||
        r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.authorLocation && r.authorLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prodName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRating && matchesSearch;
    });
  }, [reviews, selectedRating, searchQuery, productMap]);

  // Statistics
  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : "0.0";
    const fiveStar = reviews.filter((r) => Math.round(r.rating) === 5).length;
    const verified = reviews.filter((r) => r.verifiedPurchase).length;
    return { total, avg, fiveStar, verified };
  }, [reviews]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Customer Reviews
          </h1>
          <p className="font-body text-xs sm:text-sm text-white/50 mt-1">
            Moderate, review, and manage customer feedback across your catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A16207] to-[#D4A853] text-black font-body text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity self-start sm:self-auto cursor-pointer shadow-lg shadow-[#A16207]/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Verified Review
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
          <p className="font-body text-[11px] uppercase tracking-wider text-white/40">Total Reviews</p>
          <p className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1.5">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
          <p className="font-body text-[11px] uppercase tracking-wider text-white/40">Average Rating</p>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="font-heading text-2xl sm:text-3xl font-bold text-[#D4A853]">{stats.avg}</p>
            <span className="text-[#D4A853] text-lg">★</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
          <p className="font-body text-[11px] uppercase tracking-wider text-white/40">5-Star Feedback</p>
          <p className="font-heading text-2xl sm:text-3xl font-bold text-emerald-400 mt-1.5">{stats.fiveStar}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
          <p className="font-body text-[11px] uppercase tracking-wider text-white/40">Verified Buyers</p>
          <p className="font-heading text-2xl sm:text-3xl font-bold text-blue-400 mt-1.5">{stats.verified}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by author, location, product, or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-body text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-[#D4A853]"
          />
        </div>

        {/* Rating Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["all", 5, 4, 3, 2, 1] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(r)}
              className={`px-3 py-1.5 rounded-lg font-body text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                selectedRating === r
                  ? "bg-[#A16207] text-white font-semibold shadow-xs"
                  : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {r === "all" ? "All Stars" : `${r} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table / List */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
          <p className="font-heading text-lg text-white/80">No reviews found</p>
          <p className="font-body text-xs text-white/40 mt-1">Try adjusting your search query or star filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((rev) => {
            const product = productMap.get(rev.productId);
            return (
              <div
                key={rev.id}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Stars */}
                    <div className="flex items-center text-[#D4A853]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="text-sm">
                          {s <= rev.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>

                    <span className="font-body text-xs font-semibold text-white">{rev.authorName}</span>
                    {rev.authorLocation && (
                      <span className="font-body text-[11px] text-white/40">• {rev.authorLocation}</span>
                    )}

                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-body text-[10px] font-medium">
                        ✓ Verified Buyer
                      </span>
                    )}

                    <span className="font-body text-[11px] text-white/30 ml-auto md:ml-0">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title & Comment */}
                  {rev.title && (
                    <p className="font-heading text-sm font-semibold text-white/90">{rev.title}</p>
                  )}
                  <p className="font-body text-xs sm:text-sm text-white/70 leading-relaxed max-w-4xl">
                    {rev.comment}
                  </p>

                  {/* Product Tag */}
                  {product && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-body text-[11px] text-white/40">Product:</span>
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="font-body text-xs text-[#D4A853] hover:underline flex items-center gap-1"
                      >
                        {product.name}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                  <button
                    type="button"
                    disabled={deletingId === rev.id}
                    onClick={() => handleDelete(rev.id)}
                    className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                    title="Delete Review"
                  >
                    {deletingId === rev.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    )}
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#141210] border border-white/[0.1] rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer p-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 className="font-heading text-xl font-bold text-white mb-1">Add Customer Review</h3>
            <p className="font-body text-xs text-white/50 mb-5">
              Input verified feedback directly into the live catalog database.
            </p>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block font-body text-xs text-white/70 uppercase tracking-wider mb-1.5">
                  Select Product *
                </label>
                <select
                  value={formProductId}
                  onChange={(e) => setFormProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-body text-xs sm:text-sm focus:outline-none focus:border-[#D4A853]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#141210] text-white">
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-body text-xs text-white/70 uppercase tracking-wider mb-1.5">
                  Rating (1-5) *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormRating(s)}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center font-heading text-base font-bold cursor-pointer transition-colors ${
                        formRating >= s
                          ? "border-[#D4A853] bg-[#D4A853]/20 text-[#D4A853]"
                          : "border-white/[0.1] text-white/40 hover:border-white/30"
                      }`}
                    >
                      {s}★
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-xs text-white/70 uppercase tracking-wider mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. Shalini Singhal"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-body text-xs sm:text-sm focus:outline-none focus:border-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs text-white/70 uppercase tracking-wider mb-1.5">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Hyderabad, Telangana"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-body text-xs sm:text-sm focus:outline-none focus:border-[#D4A853]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-xs text-white/70 uppercase tracking-wider mb-1.5">
                  Review Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Breathtaking finish & authentic weight"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-body text-xs sm:text-sm focus:outline-none focus:border-[#D4A853]"
                />
              </div>

              <div>
                <label className="block font-body text-xs text-white/70 uppercase tracking-wider mb-1.5">
                  Review Text *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Paste or write the customer feedback..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-body text-xs sm:text-sm focus:outline-none focus:border-[#D4A853] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.1] text-white/70 font-body text-xs uppercase tracking-wider font-semibold hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formAuthor.trim() || !formComment.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A16207] to-[#D4A853] text-black font-body text-xs uppercase tracking-wider font-bold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {submitting ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

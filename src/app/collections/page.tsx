"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products as fallbackProducts, categories, Product } from "@/lib/data";
import { formatPrice, getDiscountPercentage, cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { fetchProducts } from "@/lib/supabase/products";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Best Rating", value: "rating" },
];

export default function CollectionsPage() {
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedProductId(product.id);
    window.setTimeout(() => setAddedProductId(null), 1800);
  };

  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const live = await fetchProducts();
        if (live && live.length > 0) {
          setProductList(live);
        }
      } catch (err) {
        console.error("Collections fetchProducts error:", err);
      }
    }
    loadLiveProducts();
  }, []);

  const filtered = productList
    .filter(
      (p) => selectedCategory === "all" || p.categorySlug === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <>
      {/* ── Page Header ── */}
      <section className="bg-gradient-to-br from-cream via-background to-champagne py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary animate-fade-in-up">
            Our Collections
          </h1>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto animate-fade-in-up stagger-1">
            Discover handcrafted bangles that blend timeless tradition with modern elegance.
          </p>
          {/* Breadcrumb */}
          <nav className="mt-6 animate-fade-in-up stagger-2" aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-accent transition-colors cursor-pointer">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-primary font-medium">Collections</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-10 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* ── Sidebar (Desktop) ── */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28">
                <h3 className="font-body text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-5">
                  Categories
                </h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={cn(
                        "w-full text-left font-body text-sm py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer",
                        selectedCategory === "all"
                          ? "bg-accent/10 text-accent font-medium"
                          : "text-secondary hover:text-accent hover:bg-accent/5"
                      )}
                    >
                      All Collections
                      <span className="float-right text-xs text-muted-foreground">
                        {productList.length}
                      </span>
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={cn(
                          "w-full text-left font-body text-sm py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer",
                          selectedCategory === cat.slug
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-secondary hover:text-accent hover:bg-accent/5"
                        )}
                      >
                        {cat.name}
                        <span className="float-right text-xs text-muted-foreground">
                          {cat.productCount}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Price Range */}
                <div className="mt-8">
                  <h3 className="font-body text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-5">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Under ₹5,000",
                      "₹5,000 - ₹25,000",
                      "₹25,000 - ₹50,000",
                      "₹50,000 - ₹1,00,000",
                      "Above ₹1,00,000",
                    ].map((range) => (
                      <label
                        key={range}
                        className="flex items-center gap-3 font-body text-sm text-secondary cursor-pointer hover:text-accent transition-colors group"
                      >
                        <div className="w-4 h-4 rounded border border-border group-hover:border-accent transition-colors flex items-center justify-center">
                          <div className="w-2 h-2 rounded-sm bg-accent scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                        {range}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div className="mt-8">
                  <h3 className="font-body text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-5">
                    Material
                  </h3>
                  <div className="space-y-2">
                    {["22K Gold", "18K Gold", "Sterling Silver", "Platinum", "Gold-plated"].map(
                      (mat) => (
                        <label
                          key={mat}
                          className="flex items-center gap-3 font-body text-sm text-secondary cursor-pointer hover:text-accent transition-colors group"
                        >
                          <div className="w-4 h-4 rounded border border-border group-hover:border-accent transition-colors flex items-center justify-center">
                            <div className="w-2 h-2 rounded-sm bg-accent scale-0 group-hover:scale-100 transition-transform" />
                          </div>
                          {mat}
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Products Area ── */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
                <p className="font-body text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-primary">{filtered.length}</span>{" "}
                  products
                </p>

                <div className="flex items-center gap-3">
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 font-body text-xs uppercase tracking-wider px-4 py-2 border border-border rounded-full hover:border-accent transition-colors cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                    Filters
                  </button>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="font-body text-xs uppercase tracking-wider px-4 py-2 border border-border rounded-full bg-transparent outline-none focus:border-accent transition-colors cursor-pointer"
                    aria-label="Sort products"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mobile Filters (categories only) */}
              {showFilters && (
                <div className="lg:hidden mb-6 flex flex-wrap gap-2 animate-fade-in-down">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={cn(
                      "font-body text-xs px-4 py-2 rounded-full border transition-all cursor-pointer",
                      selectedCategory === "all"
                        ? "bg-primary text-on-primary border-primary"
                        : "border-border text-secondary hover:border-accent"
                    )}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={cn(
                        "font-body text-xs px-4 py-2 rounded-full border transition-all cursor-pointer",
                        selectedCategory === cat.slug
                          ? "bg-primary text-on-primary border-primary"
                          : "border-border text-secondary hover:border-accent"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filtered.map((product) => (
                  <div key={product.id} className="group relative animate-fade-in-up">
                    {/* Image */}
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-champagne mb-4 img-zoom border border-border/40">
                      {/* Product Image Link */}
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
                          <span className="bg-primary text-on-primary font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                            New
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="bg-accent text-on-accent font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                            Bestseller
                          </span>
                        )}
                        {product.originalPrice && (
                          <span className="bg-rose-gold text-white font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                            -{getDiscountPercentage(product.originalPrice, product.price)}%
                          </span>
                        )}
                      </div>

                      {/* Wishlist */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={cn(
                          "absolute top-3 right-3 z-10 w-9 h-9 rounded-full glass flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 shadow-sm",
                          isInWishlist(product.id)
                            ? "opacity-100 bg-white shadow-md text-accent"
                            : "opacity-85 sm:opacity-0 sm:group-hover:opacity-100 bg-white/80"
                        )}
                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={isInWishlist(product.id) ? "#A16207" : "none"}
                          stroke={isInWishlist(product.id) ? "#A16207" : "currentColor"}
                          strokeWidth="1.5"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>

                      {/* Quick Add (Desktop Hover) */}
                      <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-10">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="w-full bg-primary/90 backdrop-blur-md text-on-primary font-body text-xs uppercase tracking-widest py-3 rounded-lg hover:bg-accent transition-colors duration-300 cursor-pointer"
                          aria-live="polite"
                        >
                          {addedProductId === product.id ? "Added ✓" : "Add to Cart"}
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <Link href={`/product/${product.slug}`} className="cursor-pointer block">
                      <p className="font-body text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-heading text-lg font-semibold text-primary group-hover:text-accent transition-colors duration-300">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-body text-base font-semibold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="font-body text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill={star <= Math.round(product.rating) ? "#A16207" : "none"}
                              stroke="#A16207"
                              strokeWidth="1.5"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <span className="font-body text-[11px] text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>
                    </Link>

                    {/* Mobile Add to Cart Button (Always visible on mobile) */}
                    <div className="sm:hidden mt-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className={cn(
                          "w-full font-body text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95",
                          addedProductId === product.id
                            ? "bg-emerald-700 text-white"
                            : "bg-accent hover:bg-accent-dark text-on-accent"
                        )}
                        aria-live="polite"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {addedProductId === product.id ? "Added to Bag ✓" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-heading text-2xl text-muted-foreground">
                    No products found
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

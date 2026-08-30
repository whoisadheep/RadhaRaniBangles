"use client";

import { useState } from "react";
import Link from "next/link";
import { products, categories, testimonials } from "@/lib/data";
import { formatPrice, getDiscountPercentage, cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════
   Product Card
   ═══════════════════════════════════════════════ */

function ProductCard({ product }: { product: typeof products[number] }) {
  const [isWished, setIsWished] = useState(false);

  return (
    <div className="group relative animate-fade-in-up">
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-champagne mb-4 img-zoom border border-border/40 shadow-sm group-hover:shadow-md transition-shadow duration-500">
        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
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

        {/* Wishlist */}
        <button
          onClick={() => setIsWished(!isWished)}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110 shadow-sm"
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isWished ? "#A16207" : "none"}
            stroke={isWished ? "#A16207" : "currentColor"}
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
          <button className="w-full bg-primary/95 backdrop-blur-md text-on-primary font-body text-xs uppercase tracking-widest py-3 rounded-lg hover:bg-accent transition-colors duration-300 cursor-pointer shadow-lg">
            Add to Cart
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
        {/* Rating */}
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
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Homepage
   ═══════════════════════════════════════════════ */

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"all" | "bestseller" | "new">("all");

  const filteredProducts =
    activeTab === "all"
      ? products.slice(0, 8)
      : activeTab === "bestseller"
        ? products.filter((p) => p.isBestseller).slice(0, 8)
        : products.filter((p) => p.isNew).slice(0, 8);

  const instagramImages = [
    { id: 1, src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80", tag: "@radharanibangles" },
    { id: 2, src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80", tag: "#RoyalBangles" },
    { id: 3, src: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=600&q=80", tag: "#BridalChura" },
    { id: 4, src: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80", tag: "#GoldElegance" },
    { id: 5, src: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=600&q=80", tag: "#KundanMagic" },
    { id: 6, src: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80", tag: "#DiamondBangles" },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1 — Hero (Tiffany & Co Inspiration)
          ══════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-cream via-background to-champagne">
        {/* Ambient background glows */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-rose-gold/[0.04] blur-3xl pointer-events-none" />

        {/* Decorative dots pattern */}
        <div className="absolute top-32 left-10 hidden lg:grid grid-cols-5 gap-2 opacity-20 pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-accent" />
          ))}
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 w-full py-12 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              {/* Category Tag */}
              <div className="inline-flex items-center gap-3 mb-6 animate-fade-in-up">
                <div className="w-8 h-[1px] bg-accent hidden lg:block" />
                <span className="font-body text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">
                  Radha Rani Heritage
                </span>
              </div>

              {/* Heading */}
              <h1 className="animate-fade-in-up stagger-1">
                <span className="block font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-primary leading-[1.08]">
                  Adorn Your
                </span>
                <span className="block font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.08] mt-1">
                  <em className="italic text-accent font-normal">Grace</em>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="font-body text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mt-6 leading-relaxed animate-fade-in-up stagger-2">
                Experience the exquisite artistry of Indian bangles.
                Marked by timeless craftsmanship, royal motifs, and pure elegance.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mt-8 animate-fade-in-up stagger-3">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-on-accent font-body text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 cursor-pointer group hover:shadow-[0_8px_30px_rgba(161,98,7,0.25)]"
                >
                  Explore Collection
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest text-secondary hover:text-accent transition-colors duration-300 cursor-pointer hover-underline py-4"
                >
                  Our Craft Story
                </Link>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 mt-10 pt-8 border-t border-border/60 animate-fade-in-up stagger-4">
                {[
                  { value: "10K+", label: "Happy Customers" },
                  { value: "500+", label: "Unique Designs" },
                  { value: "22K", label: "Gold Certified" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="font-heading text-2xl lg:text-3xl font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hero Image Showcase */}
            <div className="order-1 lg:order-2 flex justify-center animate-fade-in-up">
              <div className="relative w-full max-w-[480px] lg:max-w-[560px] flex items-center justify-center">
                {/* Ambient glow behind bangles */}
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-champagne/40 to-transparent rounded-full blur-2xl scale-90 pointer-events-none" />

                {/* Hero Bangles Transparent Cutout */}
                <div className="relative z-10 animate-float">
                  <img
                    src="/images/hero-bangles.png"
                    alt="Radha Rani Luxury Bangles Showcase"
                    className="w-full h-auto object-contain max-h-[500px] drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)] transition-transform duration-700 hover:scale-105 select-none"
                  />
                </div>

                {/* Floating Glass Badges (Visible on Mobile & Desktop) */}
                <div className="absolute right-0 sm:-right-2 top-2 sm:top-10 z-20 glass-gold rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] animate-float stagger-2 flex items-center gap-2 sm:gap-3 backdrop-blur-md border border-accent/20">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-[10px] sm:text-xs">
                    22K
                  </div>
                  <div>
                    <p className="font-heading text-xs sm:text-sm font-bold text-primary leading-tight">Pure Gold</p>
                    <p className="font-body text-[8px] sm:text-[9px] uppercase tracking-wider text-muted-foreground">BIS Hallmarked</p>
                  </div>
                </div>

                <div className="absolute left-0 sm:-left-2 bottom-2 sm:bottom-10 z-20 glass-gold rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] animate-float stagger-4 flex items-center gap-2 sm:gap-3 backdrop-blur-md border border-accent/20">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-heading text-xs sm:text-sm font-bold text-primary leading-tight">Handcrafted</p>
                    <p className="font-body text-[8px] sm:text-[9px] uppercase tracking-wider text-muted-foreground">Master Artisans</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — Categories Showcase
          ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary section-heading">
              Explore Our Collections
            </h2>
            <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
              From everyday elegance to bridal grandeur — find the perfect bangle for every moment.
            </p>
          </div>

          {/* Category Grid with Real Photos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/collections`}
                className={cn(
                  "group text-center cursor-pointer animate-fade-in-up",
                  `stagger-${i + 1}`
                )}
              >
                <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-white via-cream to-champagne/80 border-2 border-accent/20 group-hover:border-accent p-3 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_15px_35px_rgba(161,98,7,0.2)] group-hover:scale-105 shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-0.5 select-none"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-heading text-base sm:text-lg font-semibold text-primary mt-4 group-hover:text-accent transition-colors duration-300">
                  {cat.name}
                </h3>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  {cat.productCount} pieces
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — Featured Products
          ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-cream/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Heading + Tabs */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary section-heading">
              Curated For You
            </h2>
            <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
              Handpicked pieces that capture the essence of Indian artistry and modern luxury.
            </p>

            {/* Tabs (Responsive on Mobile) */}
            <div className="w-full flex justify-center mt-8 px-2">
              <div className="flex items-center gap-1 bg-muted/70 rounded-full p-1 sm:p-1.5 shadow-inner max-w-full">
                {[
                  { key: "all" as const, label: "All" },
                  { key: "bestseller" as const, label: "Bestsellers" },
                  { key: "new" as const, label: "New Arrivals" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "font-body text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest px-3 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap",
                      activeTab === tab.key
                        ? "bg-primary text-on-primary shadow-md font-semibold"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All */}
          <div className="text-center mt-14">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest text-primary border-b-2 border-primary hover:text-accent hover:border-accent pb-1 transition-colors duration-300 cursor-pointer group"
            >
              View All Products
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — Promotional Bridal Banner
          ══════════════════════════════════════════ */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        {/* Background Image with Dark-Gold Overlay */}
        <img
          src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=1600&q=85"
          alt="Bridal Bangles Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/90" />
        <div className="absolute inset-0 bg-accent/15 mix-blend-overlay" />

        {/* Decorative Gold Border */}
        <div className="absolute top-6 left-6 right-6 bottom-6 border border-accent/25 rounded-sm pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <span className="inline-block font-body text-[11px] uppercase tracking-[0.3em] text-accent-light mb-4">
            Exclusive Royal Collection
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
            Bridal Chura &amp; Sets <em className="italic font-normal text-accent-light">2025</em>
          </h2>
          <p className="font-body text-white/70 text-base sm:text-lg max-w-xl mx-auto mt-5 leading-relaxed">
            Begin your forever with our magnificent bridal bangle sets. Each piece is crafted
            with auspicious red-gold meenakari and sparkling stones.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 mt-8 bg-accent hover:bg-accent-light text-on-accent font-body text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 cursor-pointer hover:shadow-[0_8px_30px_rgba(161,98,7,0.4)]"
          >
            Discover Bridal Sets
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — Testimonials with Avatars
          ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary section-heading">
              What Our Customers Say
            </h2>
            <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
              Real stories from women who adorned themselves with Radha Rani Bangles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.slice(0, 3).map((t, i) => (
              <div
                key={t.id}
                className={cn(
                  "glass-gold rounded-2xl p-8 hover:shadow-[0_12px_40px_rgba(161,98,7,0.12)] transition-all duration-500 hover:-translate-y-1 animate-fade-in-up flex flex-col justify-between",
                  `stagger-${i + 1}`
                )}
              >
                <div>
                  {/* Quote icon */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-accent/40 mb-4"
                  >
                    <path
                      d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
                      fill="currentColor"
                    />
                    <path
                      d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
                      fill="currentColor"
                    />
                  </svg>

                  <p className="font-heading text-base sm:text-lg italic leading-relaxed text-card-foreground">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3 pt-4 border-t border-border/40">
                  {/* Avatar */}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-accent/30 shadow-sm"
                  />
                  <div>
                    <p className="font-body text-sm font-semibold text-primary">
                      {t.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {t.location}
                    </p>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill={s <= t.rating ? "#A16207" : "none"}
                        stroke="#A16207"
                        strokeWidth="1.5"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — Instagram Feed Showcase
          ══════════════════════════════════════════ */}
      <section className="py-20 bg-cream/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary">
              Follow Us <span className="text-accent">@RadhaRaniBangles</span>
            </h2>
            <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mt-2">
              Tag us in your moments of elegance #RadhaRaniJewels
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {instagramImages.map((item) => (
              <a
                key={item.id}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden bg-champagne cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500"
              >
                <img
                  src={item.src}
                  alt={item.tag}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Hover overlay with Instagram Icon and hashtag */}
                <div className="absolute inset-0 bg-primary/70 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D4A853"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="5" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span className="font-body text-xs text-white/90 font-medium mt-2">
                    {item.tag}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7 — Newsletter + Trust
          ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-champagne via-cream to-background">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Newsletter */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary section-heading">
              Stay in Touch
            </h2>
            <p className="font-body text-muted-foreground mt-4">
              Be the first to know about exclusive offers, festive collections, and royal styling tips.
            </p>
            <form
              className="flex mt-8 max-w-md mx-auto shadow-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 min-w-0 bg-white border border-border rounded-l-full px-4 sm:px-6 py-3.5 font-body text-sm outline-none focus:border-accent transition-colors duration-300"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-dark text-on-accent px-5 sm:px-8 py-3.5 rounded-r-full font-body text-xs uppercase tracking-widest font-semibold transition-colors duration-300 cursor-pointer shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2" ry="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                ),
                title: "Free Express Shipping",
                desc: "Insured transit on orders above ₹2,999",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                title: "Secure Checkout",
                desc: "256-bit encrypted payments",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
                  </svg>
                ),
                title: "100% BIS Hallmarked",
                desc: "Certified purity on all gold & silver",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                ),
                title: "15-Day Easy Returns",
                desc: "Doorstep pickup & full refund",
              },
            ].map((badge) => (
              <div
                key={badge.title}
                className="text-center p-6 rounded-2xl glass hover:shadow-md transition-all duration-300 border border-white/60"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-4">
                  {badge.icon}
                </div>
                <h3 className="font-body text-sm font-semibold text-primary uppercase tracking-wider">
                  {badge.title}
                </h3>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { products } from "@/lib/data";
import { formatPrice, getDiscountPercentage, cn } from "@/lib/utils";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find((p) => p.slug === slug);

  const [selectedSize, setSelectedSize] = useState("2.6");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "reviews">("description");
  const [isWished, setIsWished] = useState(false);
  const [activeImage, setActiveImage] = useState(product?.images[0] || "");

  if (!product) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-primary">Product Not Found</h1>
          <p className="font-body text-muted-foreground mt-3">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/collections"
            className="inline-block mt-6 bg-accent text-on-accent font-body text-xs uppercase tracking-widest px-8 py-3 rounded-full hover:bg-accent-dark transition-colors cursor-pointer"
          >
            Browse Collections
          </Link>
        </div>
      </section>
    );
  }

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const sizes = ["2.2", "2.4", "2.6", "2.8", "2.10"];

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="bg-cream/50 border-b border-border/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-accent transition-colors cursor-pointer">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/collections" className="hover:text-accent transition-colors cursor-pointer">Collections</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-primary font-medium truncate max-w-[120px] sm:max-w-[200px]">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Product Detail ── */}
      <section className="py-10 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left — Images */}
            <div className="animate-fade-in-up">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-champagne border border-border/40 shadow-sm">
                <img
                  src={activeImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-primary text-on-primary font-body text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                      New
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-accent text-on-accent font-body text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {product.images.map((imgSrc, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(imgSrc)}
                    className={cn(
                      "w-20 h-20 rounded-xl overflow-hidden bg-champagne border-2 transition-all cursor-pointer shadow-xs",
                      (activeImage || product.images[0]) === imgSrc
                        ? "border-accent ring-2 ring-accent/20"
                        : "border-transparent hover:border-accent/40 opacity-70 hover:opacity-100"
                    )}
                  >
                    <img
                      src={imgSrc}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right — Product Info */}
            <div className="animate-fade-in-up stagger-1">
              <p className="font-body text-[11px] uppercase tracking-[0.25em] text-accent mb-2">
                {product.category}
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={star <= Math.round(product.rating) ? "#A16207" : "none"}
                      stroke="#A16207"
                      strokeWidth="1.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="font-body text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-6">
                <span className="font-heading text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="font-body text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="font-body text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Save {getDiscountPercentage(product.originalPrice, product.price)}%
                    </span>
                  </>
                )}
              </div>
              <p className="font-body text-xs text-muted-foreground mt-1">
                Inclusive of all taxes
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-border my-6" />

              {/* Description short */}
              <p className="font-body text-sm text-secondary leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-body text-xs uppercase tracking-[0.2em] font-semibold text-primary">
                    Select Size (inches)
                  </p>
                  <Link
                    href="/size-guide"
                    className="font-body text-xs text-accent hover-underline cursor-pointer"
                  >
                    Size Guide
                  </Link>
                </div>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 rounded-lg border font-body text-sm transition-all duration-300 cursor-pointer",
                        selectedSize === size
                          ? "border-accent bg-accent/10 text-accent font-semibold"
                          : "border-border text-secondary hover:border-accent/50"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <p className="font-body text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">
                  Quantity
                </p>
                <div className="inline-flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-secondary hover:text-accent transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-body text-sm font-semibold border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-secondary hover:text-accent transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Add to Cart + Wishlist */}
              <div className="flex gap-3 mt-8">
                <button className="flex-1 bg-accent hover:bg-accent-dark text-on-accent font-body text-sm uppercase tracking-widest py-4 rounded-full transition-all duration-300 cursor-pointer hover:shadow-[0_8px_30px_rgba(161,98,7,0.25)] flex items-center justify-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsWished(!isWished)}
                  className={cn(
                    "w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer",
                    isWished
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-secondary hover:border-accent hover:text-accent"
                  )}
                  aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={isWished ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
                {[
                  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "BIS Hallmark" },
                  { icon: "M1 3v15a2 2 0 0 0 2 2h15M16 8l-4 4-2-2-4 4", label: "Free Shipping" },
                  { icon: "M3 10h4l3-7 4 14 3-7h4", label: "15-Day Returns" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#A16207"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto"
                    >
                      <path d={item.icon} />
                    </svg>
                    <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="mt-16 lg:mt-24">
            <div className="flex border-b border-border overflow-x-auto">
              {[
                { key: "description" as const, label: "Description" },
                { key: "details" as const, label: "Details & Care" },
                { key: "reviews" as const, label: `Reviews (${product.reviews})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "font-body text-xs sm:text-sm uppercase tracking-wider px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 cursor-pointer border-b-2 -mb-px whitespace-nowrap",
                    activeTab === tab.key
                      ? "border-accent text-accent font-semibold"
                      : "border-transparent text-muted-foreground hover:text-primary"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-8 max-w-3xl">
              {activeTab === "description" && (
                <div className="font-body text-sm text-secondary leading-relaxed space-y-4 animate-fade-in-up">
                  <p>{product.description}</p>
                  <p>
                    {product.craftsmanshipDetails ||
                      "Each piece is meticulously handcrafted by skilled artisans who have inherited generations of craftsmanship. The attention to detail in every curve, pattern, and finish reflects our commitment to preserving Indian jewelry traditions while embracing contemporary aesthetics."}
                  </p>
                </div>
              )}

              {activeTab === "details" && (
                <div className="animate-fade-in-up">
                  <dl className="space-y-3">
                    {[
                      { term: "Material", def: product.material },
                      { term: "Weight", def: product.weight || "Contact for details" },
                      { term: "Size", def: product.size || "Available in multiple sizes" },
                      { term: "Hallmark", def: product.hallmark || "BIS Certified (where applicable)" },
                      ...(product.boxContents ? [{ term: "Package", def: product.boxContents }] : []),
                    ].map((item) => (
                      <div key={item.term} className="flex gap-4 py-2 border-b border-border/50">
                        <dt className="font-body text-sm font-semibold text-primary w-32 shrink-0">
                          {item.term}
                        </dt>
                        <dd className="font-body text-sm text-secondary">{item.def}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6">
                    <h4 className="font-body text-sm font-semibold text-primary mb-2">Care Instructions</h4>
                    <ul className="font-body text-sm text-secondary space-y-1.5 list-disc list-inside">
                      {(product.careInstructions && product.careInstructions.length > 0
                        ? product.careInstructions
                        : [
                            "Store in a cool, dry place away from moisture",
                            "Avoid contact with perfume, chemicals, and water",
                            "Clean gently with a soft dry cloth",
                            "Store separately to prevent scratches",
                          ]
                      ).map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-center">
                      <p className="font-heading text-4xl font-bold text-primary">{product.rating}</p>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? "#A16207" : "none"} stroke="#A16207" strokeWidth="1.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <p className="font-body text-xs text-muted-foreground mt-1">
                        {product.reviews} reviews
                      </p>
                    </div>
                  </div>
                  <p className="font-body text-sm text-muted-foreground italic">
                    Customer reviews will be displayed here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Related Products ── */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 lg:mt-24">
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary section-heading text-center mb-10">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {relatedProducts.map((rp) => (
                  <Link key={rp.id} href={`/product/${rp.slug}`} className="group cursor-pointer animate-fade-in-up">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-champagne mb-3 img-zoom border border-border/40 shadow-xs">
                      <img
                        src={rp.images[0]}
                        alt={rp.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="font-body text-[11px] uppercase tracking-widest text-muted-foreground">{rp.category}</p>
                    <h3 className="font-heading text-base font-semibold text-primary group-hover:text-accent transition-colors mt-0.5">
                      {rp.name}
                    </h3>
                    <p className="font-body text-sm font-semibold text-primary mt-1">{formatPrice(rp.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

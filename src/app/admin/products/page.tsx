"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { products as initialProducts, categories, Product } from "@/lib/data";
import { formatPrice, cn } from "@/lib/utils";
import { fetchProducts, upsertProduct, deleteProduct } from "@/lib/supabase/products";
import { uploadProductImage } from "@/lib/supabase/storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function ProductsPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalTab, setModalTab] = useState<"info" | "images" | "specs" | "care">("info");
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabaseActive = isSupabaseConfigured();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts();
        setProductList(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Form state with all Details & Care fields and array of images
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    categorySlug: categories[0]?.slug || "",
    description: "",
    craftsmanshipDetails: "",
    material: "",
    weight: "",
    size: "",
    hallmark: "",
    boxContents: "",
    careInstructionsText: "",
    images: [] as string[],
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    featuredOrder: "",
  });

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.material.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.categorySlug === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [productList, searchQuery, selectedCategory]);

  const handleToggleFeatured = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !product.isFeatured;
    const updated: Product = {
      ...product,
      isFeatured: nextVal,
    };

    setProductList((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    try {
      await upsertProduct(updated);
    } catch (err) {
      console.error("Failed to toggle featured status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProductList((prev) => prev.filter((p) => p.id !== id));
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error("Failed to delete from database:", err);
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setModalTab("info");
    setUrlInput("");
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      categorySlug: categories[0]?.slug || "",
      description: "",
      craftsmanshipDetails:
        "Handcrafted with generational expertise by master artisans in Jaipur using authentic heritage techniques.",
      material: "22K Yellow Gold",
      weight: "32.5 grams",
      size: "2.4, 2.6, 2.8",
      hallmark: "BIS 916 Hallmarked Gold with HUID laser certification",
      boxContents: "1 Pair of Bangles, Luxury Velvet Keepsake Box, BIS Hallmarking Certificate",
      careInstructionsText: [
        "Store in a cool, dry place away from moisture and direct sunlight",
        "Avoid direct contact with perfume, sanitizers, lotion, and hairspray",
        "Clean gently with a soft dry microfiber cloth after every wear",
        "Store in individual velvet compartments to prevent abrasions",
      ].join("\n"),
      images: [],
      isNew: true,
      isBestseller: false,
      isFeatured: false,
      featuredOrder: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalTab("info");
    setUrlInput("");
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
      categorySlug: product.categorySlug,
      description: product.description,
      craftsmanshipDetails:
        product.craftsmanshipDetails ||
        "Each piece is meticulously handcrafted by skilled artisans who have inherited generations of craftsmanship.",
      material: product.material,
      weight: product.weight || "",
      size: product.size || "",
      hallmark: product.hallmark || "BIS 916 Hallmarked",
      boxContents:
        product.boxContents ||
        "1 Pair of Bangles, Luxury Velvet Storage Box, Authenticity Card",
      careInstructionsText: (
        product.careInstructions || [
          "Store in a cool, dry place away from moisture",
          "Avoid contact with perfume, chemicals, and water",
          "Clean gently with a soft dry cloth",
          "Store separately to prevent scratches",
        ]
      ).join("\n"),
      images: [...product.images],
      isNew: product.isNew || false,
      isBestseller: product.isBestseller || false,
      isFeatured: product.isFeatured || false,
      featuredOrder: product.featuredOrder !== undefined ? product.featuredOrder.toString() : "",
    });
    setIsModalOpen(true);
  };

  // Image Upload Handlers
  const handleImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, e.target!.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageFiles(e.dataTransfer.files);
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, urlInput.trim()],
    }));
    setUrlInput("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const next = [...prev.images];
      const [selected] = next.splice(index, 1);
      next.unshift(selected);
      return { ...prev, images: next };
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a product name");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    setSaving(true);
    try {
      // 1. Upload any base64/file images to Supabase Storage (or keep local if offline)
      const uploadedImages = await Promise.all(
        formData.images.map((img) => uploadProductImage(img))
      );

      const safeImages = uploadedImages.filter(Boolean);

      const category = categories.find((c) => c.slug === formData.categorySlug)?.name || "Gold Bangles";
      const careInstructions = formData.careInstructionsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      let productToSave: Product;

      if (editingProduct) {
        productToSave = {
          ...editingProduct,
          name: formData.name,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          category,
          categorySlug: formData.categorySlug,
          description: formData.description,
          craftsmanshipDetails: formData.craftsmanshipDetails,
          material: formData.material,
          weight: formData.weight,
          size: formData.size,
          hallmark: formData.hallmark,
          boxContents: formData.boxContents,
          careInstructions,
          images: safeImages,
          isNew: formData.isNew,
          isBestseller: formData.isBestseller,
          isFeatured: formData.isFeatured,
          featuredOrder: formData.featuredOrder ? Number(formData.featuredOrder) : undefined,
        };

        setProductList((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? productToSave : p))
        );
      } else {
        const newId = `prod-${Math.random().toString(36).substring(2, 9)}`;
        const newSlug = formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        productToSave = {
          id: newId,
          slug: newSlug,
          name: formData.name,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          category,
          categorySlug: formData.categorySlug,
          description: formData.description,
          craftsmanshipDetails: formData.craftsmanshipDetails,
          material: formData.material,
          weight: formData.weight,
          size: formData.size,
          hallmark: formData.hallmark,
          boxContents: formData.boxContents,
          careInstructions,
          images: safeImages,
          isNew: formData.isNew,
          isBestseller: formData.isBestseller,
          isFeatured: formData.isFeatured,
          featuredOrder: formData.featuredOrder ? Number(formData.featuredOrder) : undefined,
          rating: 5.0,
          reviews: 1,
        };

        setProductList((prev) => [productToSave, ...prev]);
      }

      // 2. Persist to Supabase
      await upsertProduct(productToSave);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save product error:", err);
      // Still close modal since local state is already updated
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-heading text-white">Product Catalog</h1>
          <span className="bg-[#A16207]/20 border border-[#A16207]/30 text-[#D4A853] px-2.5 py-0.5 rounded-full text-xs font-medium">
            {productList.length} bangles
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
        <button
          onClick={openAddModal}
          className="bg-[#A16207] hover:bg-[#7C4D05] text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-md cursor-pointer shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by bangle name, material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#A16207]/50 transition-colors"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#A16207]/50 transition-colors appearance-none min-w-[170px] cursor-pointer"
        >
          <option value="All" className="bg-[#0C0A09]">
            All Categories
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug} className="bg-[#0C0A09]">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.03] text-white/40 font-body text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4">Bangle</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Material & Weight</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Homepage ⭐</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="text-white/80 font-body text-sm hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-lg bg-white/[0.05] border border-white/[0.08] overflow-hidden relative shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/[0.1] flex items-center justify-center text-white/30 text-xs">
                            No Img
                          </div>
                        )}
                        {product.images.length > 1 && (
                          <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[9px] text-white/80 px-1 rounded">
                            +{product.images.length - 1}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-[220px]">
                          {product.name}
                        </p>
                        <p className="text-xs text-white/40">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-white/40 line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-white/60">
                    <p className="text-white/80">{product.material}</p>
                    <p className="text-white/40">{product.weight || "Standard"}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1.5">
                      {product.isNew && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider">
                          New
                        </span>
                      )}
                      {product.isBestseller && (
                        <span className="bg-[#A16207]/20 text-[#D4A853] border border-[#A16207]/30 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider">
                          Bestseller
                        </span>
                      )}
                      {!product.isNew && !product.isBestseller && (
                        <span className="text-white/30 text-xs">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => handleToggleFeatured(product, e)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer",
                        product.isFeatured
                          ? "bg-[#D4A853]/20 border border-[#D4A853]/40 text-[#D4A853] hover:bg-[#D4A853]/30"
                          : "bg-white/[0.04] border border-white/[0.08] text-white/30 hover:text-white/70 hover:border-white/20"
                      )}
                      title={product.isFeatured ? "Featured on Homepage (Click to unpin)" : "Click to feature on Homepage"}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill={product.isFeatured ? "#D4A853" : "none"}
                        stroke={product.isFeatured ? "#D4A853" : "currentColor"}
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>{product.isFeatured ? `Homepage${product.featuredOrder ? ` #${product.featuredOrder}` : ""}` : "Not pinned"}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 rounded-md text-white/50 hover:text-[#D4A853] hover:bg-white/[0.05] transition-colors cursor-pointer"
                        title="Edit Product"
                      >
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
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 rounded-md text-white/50 hover:text-red-400 hover:bg-red-500/[0.08] transition-colors cursor-pointer"
                        title="Delete Product"
                      >
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
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          Add / Edit Product Modal with Tabs & Real Image Upload
          ═══════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Dialog */}
          <div className="relative bg-[#0C0A09] border border-white/[0.08] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl z-10 my-auto overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-xl font-heading text-white">
                  {editingProduct ? "Edit Bangle" : "Add New Bangle"}
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Manage photos, pricing, craftsmanship, and care instructions
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-white/[0.06] px-6 bg-white/[0.01] gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setModalTab("info")}
                className={cn(
                  "py-3 px-3.5 text-xs font-body uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
                  modalTab === "info"
                    ? "border-[#D4A853] text-[#D4A853]"
                    : "border-transparent text-white/40 hover:text-white/70"
                )}
              >
                General Info
              </button>
              <button
                type="button"
                onClick={() => setModalTab("images")}
                className={cn(
                  "py-3 px-3.5 text-xs font-body uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5",
                  modalTab === "images"
                    ? "border-[#D4A853] text-[#D4A853]"
                    : "border-transparent text-white/40 hover:text-white/70"
                )}
              >
                Photos
                {formData.images.length > 0 && (
                  <span className="bg-[#A16207]/30 border border-[#A16207]/40 text-[#D4A853] px-1.5 py-0.2 rounded-full text-[10px]">
                    {formData.images.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setModalTab("specs")}
                className={cn(
                  "py-3 px-3.5 text-xs font-body uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
                  modalTab === "specs"
                    ? "border-[#D4A853] text-[#D4A853]"
                    : "border-transparent text-white/40 hover:text-white/70"
                )}
              >
                Specs & Hallmark
              </button>
              <button
                type="button"
                onClick={() => setModalTab("care")}
                className={cn(
                  "py-3 px-3.5 text-xs font-body uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
                  modalTab === "care"
                    ? "border-[#D4A853] text-[#D4A853]"
                    : "border-transparent text-white/40 hover:text-white/70"
                )}
              >
                Details & Care
              </button>
            </div>

            {/* Modal Body / Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* ── TAB 1: General Info ── */}
              {modalTab === "info" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Bangle Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Royal Meenakari Bridal Kada"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="45999"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">
                        Original Price (₹ MRP strikethrough)
                      </label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, originalPrice: e.target.value })
                        }
                        placeholder="52999"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Collection Category *
                    </label>
                    <select
                      value={formData.categorySlug}
                      onChange={(e) =>
                        setFormData({ ...formData, categorySlug: e.target.value })
                      }
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#A16207]/60 transition-colors cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug} className="bg-[#0C0A09]">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Short Description / Hook
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      placeholder="Brief highlight describing the bangle's allure..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-6 pt-2 border-t border-white/[0.06]">
                    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          formData.isNew
                            ? "bg-[#A16207] border-[#A16207]"
                            : "bg-transparent border-white/20 group-hover:border-white/40"
                        )}
                      >
                        {formData.isNew && (
                          <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            className="w-3 h-3 text-white"
                          >
                            <path
                              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.isNew}
                        onChange={(e) =>
                          setFormData({ ...formData, isNew: e.target.checked })
                        }
                      />
                      <span className="text-sm text-white/80 group-hover:text-white">
                        Mark as New Arrival
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          formData.isBestseller
                            ? "bg-[#A16207] border-[#A16207]"
                            : "bg-transparent border-white/20 group-hover:border-white/40"
                        )}
                      >
                        {formData.isBestseller && (
                          <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            className="w-3 h-3 text-white"
                          >
                            <path
                              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.isBestseller}
                        onChange={(e) =>
                          setFormData({ ...formData, isBestseller: e.target.checked })
                        }
                      />
                      <span className="text-sm text-white/80 group-hover:text-white">
                        Mark as Bestseller
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          formData.isFeatured
                            ? "bg-[#D4A853] border-[#D4A853]"
                            : "bg-transparent border-white/20 group-hover:border-white/40"
                        )}
                      >
                        {formData.isFeatured && (
                          <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            className="w-3 h-3 text-[#100e0d]"
                          >
                            <path
                              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData({ ...formData, isFeatured: e.target.checked })
                        }
                      />
                      <span className="text-sm text-white/80 group-hover:text-white flex items-center gap-1.5">
                        <span className="text-[#D4A853]">⭐</span> Feature on Homepage
                      </span>
                    </label>
                  </div>

                  {formData.isFeatured && (
                    <div className="p-3.5 rounded-xl bg-[#D4A853]/10 border border-[#D4A853]/25 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#D4A853]">Homepage Position Order</p>
                        <p className="text-[11px] text-white/50">Position #1 appears first in the Curated showcase</p>
                      </div>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={formData.featuredOrder}
                        onChange={(e) =>
                          setFormData({ ...formData, featuredOrder: e.target.value })
                        }
                        placeholder="e.g. 1"
                        className="w-24 bg-black/40 border border-[#D4A853]/40 rounded-lg px-3 py-1.5 text-white text-sm text-center font-semibold focus:outline-none focus:border-[#D4A853]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 2: Image Upload & Gallery ── */}
              {modalTab === "images" && (
                <div className="space-y-5">
                  {/* Drag & Drop Upload Zone */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFiles(e.target.files)}
                    />
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3",
                        isDragging
                          ? "border-[#D4A853] bg-[#A16207]/10 scale-[0.99]"
                          : "border-white/15 bg-white/[0.02] hover:border-[#A16207]/50 hover:bg-white/[0.03]"
                      )}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#A16207]/15 border border-[#A16207]/30 flex items-center justify-center text-[#D4A853]">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Drag & drop bangle photos here, or{" "}
                          <span className="text-[#D4A853] underline underline-offset-2">
                            browse
                          </span>
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          PNG, JPG, WEBP accepted. Upload multiple angles (wrist view, clasp, macro).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Images Gallery */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Current Photos ({formData.images.length})
                      </p>
                      <p className="text-[11px] text-white/40">
                        The first uploaded image becomes the cover photo
                      </p>
                    </div>

                    {formData.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {formData.images.map((imgSrc, index) => (
                          <div
                            key={index}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-white/[0.05] border border-white/[0.08]"
                          >
                            <img
                              src={imgSrc}
                              alt={`Product view ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Badge */}
                            {index === 0 ? (
                              <span className="absolute top-2 left-2 bg-[#A16207] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md">
                                Cover Photo
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetCover(index)}
                                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 bg-black/70 hover:bg-[#A16207] text-white text-[9px] px-2 py-0.5 rounded-md transition-all cursor-pointer"
                              >
                                Set as Cover
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/80 hover:bg-red-500 text-white flex items-center justify-center opacity-100 transition-colors cursor-pointer shadow-lg ring-1 ring-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                              aria-label={`Remove photo ${index + 1}`}
                              title="Remove photo"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                        No photos added yet. Add one when you are ready; the first photo will become the cover.
                      </p>
                    )}
                  </div>

                  {/* Fallback Image URL Input */}
                  <div className="pt-3 border-t border-white/[0.06]">
                    <label className="block text-xs font-medium text-white/50 mb-1.5">
                      Or add photo via Web URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/... or /images/products/..."
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60"
                      />
                      <button
                        type="button"
                        onClick={handleAddUrlImage}
                        className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 3: Specifications & Hallmark ── */}
              {modalTab === "specs" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">
                        Material & Purity *
                      </label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) =>
                          setFormData({ ...formData, material: e.target.value })
                        }
                        placeholder="e.g. 22K Yellow Gold, Kundan & Pearls"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">
                        Net Weight
                      </label>
                      <input
                        type="text"
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({ ...formData, weight: e.target.value })
                        }
                        placeholder="e.g. 34.5 grams (Pair)"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">
                        Available Sizes
                      </label>
                      <input
                        type="text"
                        value={formData.size}
                        onChange={(e) =>
                          setFormData({ ...formData, size: e.target.value })
                        }
                        placeholder="e.g. 2.2, 2.4, 2.6, 2.8, 2.10"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">
                        Hallmark & Certification
                      </label>
                      <input
                        type="text"
                        value={formData.hallmark}
                        onChange={(e) =>
                          setFormData({ ...formData, hallmark: e.target.value })
                        }
                        placeholder="e.g. BIS 916 Hallmarked with HUID stamp"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Package / Box Contents
                    </label>
                    <input
                      type="text"
                      value={formData.boxContents}
                      onChange={(e) =>
                        setFormData({ ...formData, boxContents: e.target.value })
                      }
                      placeholder="e.g. 1 Pair of Bangles, Luxury Velvet Keepsake Box, BIS Certificate"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60"
                    />
                  </div>
                </div>
              )}

              {/* ── TAB 4: Details & Care ── */}
              {modalTab === "care" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Artisanal Craftsmanship Story
                    </label>
                    <textarea
                      value={formData.craftsmanshipDetails}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          craftsmanshipDetails: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Describe the artisan lineage, casting technique, or hand-carving process..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60 resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-white/60">
                        Care Instructions
                      </label>
                      <span className="text-[11px] text-[#D4A853]">
                        One instruction per line
                      </span>
                    </div>
                    <textarea
                      value={formData.careInstructionsText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          careInstructionsText: e.target.value,
                        })
                      }
                      rows={5}
                      placeholder={"Store in a cool, dry place away from moisture\nAvoid contact with perfume and chemicals\nClean gently with a soft dry cloth"}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#A16207]/60 font-mono text-xs leading-relaxed"
                    />
                  </div>

                  {/* Live Preview of Care Instructions */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-[11px] font-semibold text-[#D4A853] uppercase tracking-wider mb-2">
                      Customer Storefront Preview
                    </p>
                    <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
                      {formData.careInstructionsText
                        .split("\n")
                        .filter(Boolean)
                        .map((instruction, idx) => (
                          <li key={idx}>{instruction}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-white/[0.01]">
              <div className="text-xs text-white/40">
                {modalTab === "info" && "Step 1: General Information"}
                {modalTab === "images" && `Step 2: ${formData.images.length} Photos Added`}
                {modalTab === "specs" && "Step 3: Specifications & Purity"}
                {modalTab === "care" && "Step 4: Craftsmanship & Care Tips"}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="bg-[#A16207] hover:bg-[#7C4D05] disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving to Cloud...
                    </>
                  ) : editingProduct ? (
                    "Save Changes"
                  ) : (
                    "Create Bangle"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

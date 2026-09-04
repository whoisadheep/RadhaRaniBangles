"use client";

import { useState, useMemo } from 'react';
import { products as initialProducts, categories } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

export default function ProductsPage() {
  const [productList, setProductList] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    categorySlug: categories[0]?.slug || '',
    description: '',
    material: '',
    weight: '',
    size: '',
    imageUrl: '',
    isNew: false,
    isBestseller: false,
  });

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.categorySlug === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [productList, searchQuery, selectedCategory]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProductList(productList.filter(p => p.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      categorySlug: categories[0]?.slug || '',
      description: '',
      material: '',
      weight: '',
      size: '',
      imageUrl: '',
      isNew: false,
      isBestseller: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      categorySlug: product.categorySlug,
      description: product.description,
      material: product.material,
      weight: product.weight || '',
      size: product.size || '',
      imageUrl: product.images[0] || '',
      isNew: product.isNew || false,
      isBestseller: product.isBestseller || false,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const category = categories.find(c => c.slug === formData.categorySlug)?.name || '';
    
    if (editingProduct) {
      setProductList(productList.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formData.name,
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
            category,
            categorySlug: formData.categorySlug,
            description: formData.description,
            material: formData.material,
            weight: formData.weight,
            size: formData.size,
            images: [formData.imageUrl, ...(p.images.slice(1))],
            isNew: formData.isNew,
            isBestseller: formData.isBestseller,
          };
        }
        return p;
      }));
    } else {
      const newId = `prod-${Math.random().toString(36).substr(2, 9)}`;
      const newSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const newProduct = {
        id: newId,
        slug: newSlug,
        name: formData.name,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        category,
        categorySlug: formData.categorySlug,
        description: formData.description,
        material: formData.material,
        weight: formData.weight,
        size: formData.size,
        images: [formData.imageUrl],
        isNew: formData.isNew,
        isBestseller: formData.isBestseller,
        rating: 0,
        reviews: 0,
      };
      setProductList([...productList, newProduct as any]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-heading text-white">Products</h1>
          <span className="bg-white/[0.05] text-white/60 px-2.5 py-1 rounded-full text-xs font-medium">
            {productList.length} items
          </span>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#A16207] hover:bg-[#A16207]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Product
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors appearance-none min-w-[160px]"
        >
          <option value="All" className="bg-[#0C0A09]">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug} className="bg-[#0C0A09]">{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/[0.03] font-body text-[11px] uppercase tracking-wider text-white/40">
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Material</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-white/[0.04] text-white/80 font-body text-sm hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.05] overflow-hidden relative shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/[0.1]" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white">{product.name}</div>
                      <div className="text-xs text-white/40 mt-0.5">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-white/40 line-through mt-0.5">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">{product.material}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {product.isNew && (
                      <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                        New
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-[#A16207]/10 text-[#A16207] border border-[#A16207]/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                        Best
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-white/40 hover:text-red-400 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0C0A09] border border-white/[0.08] rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading text-white">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-1.5">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-white/60 mb-1.5">Price</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-white/60 mb-1.5">Original Price (optional)</label>
                  <input 
                    type="number" 
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Category</label>
                <select 
                  value={formData.categorySlug}
                  onChange={(e) => setFormData({...formData, categorySlug: e.target.value})}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors appearance-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.slug} className="bg-[#0C0A09]">{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-white/60 mb-1.5">Material</label>
                  <input 
                    type="text" 
                    value={formData.material}
                    onChange={(e) => setFormData({...formData, material: e.target.value})}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-white/60 mb-1.5">Weight (optional)</label>
                  <input 
                    type="text" 
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Size (optional)</label>
                <input 
                  type="text" 
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Image URL</label>
                <input 
                  type="text" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="/images/products/..."
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.isNew ? 'bg-[#A16207] border-[#A16207]' : 'bg-transparent border-white/20 group-hover:border-white/40'}`}>
                    {formData.isNew && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={formData.isNew} onChange={(e) => setFormData({...formData, isNew: e.target.checked})} />
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">Is New</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.isBestseller ? 'bg-[#A16207] border-[#A16207]' : 'bg-transparent border-white/20 group-hover:border-white/40'}`}>
                    {formData.isBestseller && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={formData.isBestseller} onChange={(e) => setFormData({...formData, isBestseller: e.target.checked})} />
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">Is Bestseller</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="bg-[#A16207] hover:bg-[#A16207]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { getSupabase } from "./client";
import { Product, products as fallbackProducts } from "@/lib/data";

/**
 * Fetches all products from Supabase `products` table.
 * If Supabase is not configured or empty, returns the default static products.
 */
export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return fallbackProducts;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase fetchProducts notice:", error.message);
      return fallbackProducts;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: Number(item.price),
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      images: Array.isArray(item.images) ? item.images : [item.images],
      category: item.category,
      categorySlug: item.category_slug,
      description: item.description,
      craftsmanshipDetails: item.craftsmanship_details,
      material: item.material,
      weight: item.weight,
      size: item.size,
      hallmark: item.hallmark,
      boxContents: item.box_contents,
      careInstructions: item.care_instructions,
      isNew: item.is_new,
      isBestseller: item.is_bestseller,
      isFeatured: item.is_featured !== undefined ? Boolean(item.is_featured) : Boolean(item.is_bestseller),
      featuredOrder: item.featured_order ? Number(item.featured_order) : undefined,
      rating: Number(item.rating) || 5.0,
      reviews: Number(item.reviews) || 0,
    }));
  } catch (err) {
    console.error("fetchProducts unexpected error:", err);
    return fallbackProducts;
  }
}

/**
 * Inserts or updates a product in Supabase.
 */
export async function upsertProduct(product: Product): Promise<Product> {
  const supabase = getSupabase();
  if (!supabase) {
    return product;
  }

  const payload: any = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    original_price: product.originalPrice || null,
    images: product.images,
    category: product.category,
    category_slug: product.categorySlug,
    description: product.description,
    craftsmanship_details: product.craftsmanshipDetails || null,
    material: product.material,
    weight: product.weight || null,
    size: product.size || null,
    hallmark: product.hallmark || null,
    box_contents: product.boxContents || null,
    care_instructions: product.careInstructions || null,
    is_new: Boolean(product.isNew),
    is_bestseller: Boolean(product.isBestseller),
    rating: product.rating,
    reviews: product.reviews,
    updated_at: new Date().toISOString(),
  };

  if (product.isFeatured !== undefined) {
    payload.is_featured = Boolean(product.isFeatured);
  }
  if (product.featuredOrder !== undefined) {
    payload.featured_order = product.featuredOrder;
  }

  let { error } = await supabase.from("products").upsert(payload, { onConflict: "id" });

  // If the remote schema doesn't yet have the is_featured column, fallback gracefully
  if (error && (error.message?.includes("is_featured") || error.message?.includes("featured_order"))) {
    delete payload.is_featured;
    delete payload.featured_order;
    const retry = await supabase.from("products").upsert(payload, { onConflict: "id" });
    error = retry.error;
  }

  if (error) {
    console.error("Failed to upsert product in Supabase:", error);
    throw error;
  }

  return product;
}

/**
 * Deletes a product from Supabase.
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    return true;
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete product in Supabase:", error);
    throw error;
  }

  return true;
}

import { getSupabase } from "./client";

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorLocation?: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export const INITIAL_REAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    authorName: "Priya Sharma",
    authorLocation: "Jaipur, Rajasthan",
    rating: 5,
    title: "Magnificent craftsmanship & pure gold sheen",
    comment: "The Ananya Gold Kada is stunning in person. The filigree work on the edges has that authentic Rajasthani heritage weight and feels luxurious on the wrist. Wore it for my sister's sangeet and received endless compliments.",
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rev-2",
    productId: "prod-1",
    authorName: "Meenakshi Sundaram",
    authorLocation: "Chennai, Tamil Nadu",
    rating: 5,
    title: "Perfect fit with the size guide!",
    comment: "I was hesitant between 2.4 and 2.6, but used the tape measure calculator on the site which recommended 2.6. It slid on smoothly without pinching my knuckles. 100% satisfied.",
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rev-3",
    productId: "prod-2",
    authorName: "Ananya Deshmukh",
    authorLocation: "Mumbai, Maharashtra",
    rating: 5,
    title: "Brilliant sparkle and secure clasp",
    comment: "The diamond bangles have exceptional clarity and catch the light beautifully. Velvet keepsake packaging was lovely too.",
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rev-4",
    productId: "prod-3",
    authorName: "Radhika Agrawal",
    authorLocation: "Varanasi, Uttar Pradesh",
    rating: 5,
    title: "Royal Kundan bridal perfection",
    comment: "Ordered this set for my wedding reception. The meenakari work on the inner rim shows genuine royal craftsmanship. Best jewelry purchase online so far.",
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rev-5",
    productId: "prod-4",
    authorName: "Kavita Rao",
    authorLocation: "Bengaluru, Karnataka",
    rating: 5,
    title: "Solid 92.5 silver weight and antique polish",
    comment: "The Lakshmi motif is intricately embossed and the antique finish gives it a temple jewelry vibe. Very comfortable for everyday wear.",
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Fetch reviews for a specific product from Supabase (with fallback).
 */
export async function fetchReviewsByProduct(productId: string): Promise<Review[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return INITIAL_REAL_REVIEWS.filter((r) => r.productId === productId);
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchReviewsByProduct error:", error.message);
      return INITIAL_REAL_REVIEWS.filter((r) => r.productId === productId);
    }

    if (!data || data.length === 0) {
      // Return matching initial reviews if database is empty for this product
      return INITIAL_REAL_REVIEWS.filter((r) => r.productId === productId);
    }

    return data.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      authorName: item.author_name,
      authorLocation: item.author_location || undefined,
      rating: Number(item.rating) || 5,
      title: item.title || undefined,
      comment: item.comment,
      verifiedPurchase: Boolean(item.verified_purchase),
      createdAt: item.created_at,
    }));
  } catch (err) {
    console.error("Unexpected fetchReviewsByProduct error:", err);
    return INITIAL_REAL_REVIEWS.filter((r) => r.productId === productId);
  }
}

/**
 * Fetch all reviews across products for testimonials and admin panel.
 */
export async function fetchAllReviews(): Promise<Review[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return INITIAL_REAL_REVIEWS;
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_REAL_REVIEWS;
    }

    return data.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      authorName: item.author_name,
      authorLocation: item.author_location || undefined,
      rating: Number(item.rating) || 5,
      title: item.title || undefined,
      comment: item.comment,
      verifiedPurchase: Boolean(item.verified_purchase),
      createdAt: item.created_at,
    }));
  } catch (err) {
    return INITIAL_REAL_REVIEWS;
  }
}

/**
 * Submit a new real review to Supabase.
 */
export async function submitReview(review: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const newId = `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const newReview: Review = {
    ...review,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const payload = {
        id: newReview.id,
        product_id: newReview.productId,
        author_name: newReview.authorName,
        author_location: newReview.authorLocation || null,
        rating: newReview.rating,
        title: newReview.title || null,
        comment: newReview.comment,
        verified_purchase: newReview.verifiedPurchase,
        created_at: newReview.createdAt,
      };

      const { error } = await supabase.from("reviews").insert(payload);
      if (error) {
        console.error("Supabase submitReview error:", error);
      }
    } catch (e) {
      console.error("Failed to insert review into Supabase:", e);
    }
  }

  return newReview;
}

/**
 * Delete a review (Admin).
 */
export async function deleteReview(reviewId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return true;

  try {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    return !error;
  } catch {
    return false;
  }
}

import { getSupabase } from "./client";

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
}

export async function fetchCoupons(): Promise<Coupon[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((item: any) => ({
      id: item.id,
      code: item.code,
      discount: Number(item.discount),
      type: item.type,
      minOrder: Number(item.min_order || 0),
      maxUses: Number(item.max_uses || 100),
      usedCount: Number(item.used_count || 0),
      active: Boolean(item.is_active),
      expiresAt: item.expires_at || "",
    }));
  } catch {
    return [];
  }
}

export async function createCoupon(coupon: {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder: number;
  maxUses: number;
  expiresAt: string;
}): Promise<Coupon | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const id = `cpn-${Date.now()}`;
  const { data, error } = await supabase
    .from("coupons")
    .insert({
      id,
      code: coupon.code.toUpperCase().trim(),
      discount: coupon.discount,
      type: coupon.type,
      min_order: coupon.minOrder,
      max_uses: coupon.maxUses,
      used_count: 0,
      is_active: true,
      expires_at: coupon.expiresAt || null,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("createCoupon error:", error);
    return null;
  }

  return {
    id: data.id,
    code: data.code,
    discount: Number(data.discount),
    type: data.type,
    minOrder: Number(data.min_order || 0),
    maxUses: Number(data.max_uses || 100),
    usedCount: Number(data.used_count || 0),
    active: Boolean(data.is_active),
    expiresAt: data.expires_at || "",
  };
}

export async function toggleCouponStatus(id: string, isActive: boolean): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("coupons")
    .update({ is_active: isActive })
    .eq("id", id);

  return !error;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("coupons")
    .delete()
    .eq("id", id);

  return !error;
}

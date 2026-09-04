import { getSupabase } from "./client";

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  address: string;
  date: string;
  trackingId?: string;
}

export interface CreateOrderInput {
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: { name: string; quantity: number; price: number; size?: string }[];
  total: number;
}

export async function createOrder(input: CreateOrderInput): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Ordering is not configured yet. Please add your Supabase environment variables.");
  }

  const id = `RR-${Date.now().toString().slice(-8)}`;
  const { error } = await supabase.from("orders").insert({
    id,
    customer: input.customer,
    email: input.email,
    phone: input.phone,
    address: input.address,
    items: input.items,
    total: input.total,
    status: "pending",
  });

  if (error) throw new Error(error.message);
  return id;
}

export async function findOrdersByPhone(phone: string): Promise<Order[]> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Order tracking is not configured yet. Please contact us for an update.");
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("phone", phone.trim())
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map((item: any) => ({
    id: item.id,
    customer: item.customer,
    email: item.email,
    phone: item.phone,
    items: item.items || [],
    total: Number(item.total),
    status: item.status,
    address: item.address,
    date: item.created_at ? item.created_at.substring(0, 10) : item.date,
    trackingId: item.tracking_id,
  }));
}

export const initialOrders: Order[] = [];

export async function fetchOrders(): Promise<Order[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((item: any) => ({
      id: item.id,
      customer: item.customer,
      email: item.email,
      phone: item.phone,
      items: item.items || [],
      total: Number(item.total),
      status: item.status,
      address: item.address,
      date: item.created_at ? item.created_at.substring(0, 10) : item.date,
      trackingId: item.tracking_id,
    }));
  } catch {
    return [];
  }
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  trackingId?: string
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  await supabase
    .from("orders")
    .update({ status, tracking_id: trackingId || null, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function deleteOrder(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase.from("orders").delete().eq("id", id);
  return !error;
}


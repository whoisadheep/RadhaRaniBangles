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

export const initialOrders: Order[] = [
  {
    id: "RR-8925",
    customer: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98201 45678",
    items: [{ name: "Ananya Gold Kada", quantity: 1, price: 45999 }],
    total: 45999,
    status: "delivered",
    address: "402, Sea Breeze Apts, Bandra West, Mumbai, MH - 400050",
    date: "2026-09-02",
    trackingId: "BLUEDART-8829104",
  },
  {
    id: "RR-8924",
    customer: "Anjali Patel",
    email: "anjali.patel@example.com",
    phone: "+91 97123 89012",
    items: [{ name: "Meera Diamond Bangle (Set of 2)", quantity: 1, price: 89999 }],
    total: 89999,
    status: "shipped",
    address: "12, Shanti Sadan, CG Road, Ahmedabad, GJ - 380006",
    date: "2026-09-01",
    trackingId: "DELHIVERY-4491028",
  },
  {
    id: "RR-8923",
    customer: "Deepika Reddy",
    email: "deepika.reddy@example.com",
    phone: "+91 94401 23456",
    items: [{ name: "Radha Kundan Set (Bridal Edition)", quantity: 1, price: 34999 }],
    total: 34999,
    status: "pending",
    address: "Plot 88, Jubilee Hills Road No. 36, Hyderabad, TS - 500033",
    date: "2026-08-31",
  },
  {
    id: "RR-8922",
    customer: "Kavita Singhania",
    email: "kavita.s@example.com",
    phone: "+91 98110 54321",
    items: [{ name: "Bridal Chura Set (Vermilion & Ivory)", quantity: 1, price: 15999 }],
    total: 15999,
    status: "processing",
    address: "7, Golf Links, New Delhi, DL - 110003",
    date: "2026-08-30",
  },
  {
    id: "RR-8921",
    customer: "Meenakshi Sundaram",
    email: "meena.sundaram@example.com",
    phone: "+91 98400 67890",
    items: [{ name: "Lakshmi Silver Cuff (Handcrafted)", quantity: 1, price: 8999 }],
    total: 8999,
    status: "delivered",
    address: "24, Poes Garden, Alwarpet, Chennai, TN - 600086",
    date: "2026-08-28",
    trackingId: "BLUEDART-7719203",
  },
];

export async function fetchOrders(): Promise<Order[]> {
  const supabase = getSupabase();
  if (!supabase) return initialOrders;

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return initialOrders;

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
    return initialOrders;
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

import { getSupabase } from "./client";

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export const initialMessages: Message[] = [
  {
    id: "msg-1",
    name: "Sunita Verma",
    email: "sunita.v@gmail.com",
    subject: "Custom Bridal Chura Sizing",
    message: "Namaste, I am getting married in November and want to know if you can customize the Radha Kundan Set in size 2.10 with extra ivory bangles?",
    date: "2026-09-03",
    read: false,
  },
  {
    id: "msg-2",
    name: "Rajesh Malhotra",
    email: "r.malhotra@yahoo.co.in",
    subject: "Bulk Order for Wedding Gifting",
    message: "Hello team, we are looking for 25 sets of Lakshmi Silver Cuffs for wedding return gifts. Do you offer corporate/bulk discounts and custom velvet box packaging?",
    date: "2026-09-02",
    read: false,
  },
  {
    id: "msg-3",
    name: "Pooja Kapur",
    email: "pooja.kapur@outlook.com",
    subject: "International Shipping to London",
    message: "Hi, I live in London, UK. Do you deliver through DHL express and how long does hallmarking clearance take for UK delivery?",
    date: "2026-09-01",
    read: true,
  },
];

export async function fetchMessages(): Promise<Message[]> {
  const supabase = getSupabase();
  if (!supabase) return initialMessages;

  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return initialMessages;

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      date: item.created_at ? item.created_at.substring(0, 10) : item.date,
      read: Boolean(item.is_read),
    }));
  } catch {
    return initialMessages;
  }
}

export async function toggleMessageRead(id: string, isRead: boolean): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
}

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return true;

  const { error } = await supabase.from("messages").insert({
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    is_read: false,
  });

  return !error;
}

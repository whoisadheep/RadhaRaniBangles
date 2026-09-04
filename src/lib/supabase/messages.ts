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

export const initialMessages: Message[] = [];

export async function fetchMessages(): Promise<Message[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      date: item.created_at ? item.created_at.substring(0, 10) : item.date,
      read: Boolean(item.is_read),
    }));
  } catch {
    return [];
  }
}

export async function toggleMessageRead(id: string, isRead: boolean): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
}

export async function deleteMessage(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase.from("messages").delete().eq("id", id);
  return !error;
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

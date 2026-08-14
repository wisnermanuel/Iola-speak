import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Plan = "week" | "month" | "quarter";
export type SubStatus = "active" | "expired" | "cancelled";

export interface Subscription {
  id: string;
  user_id: string;
  plan: Plan;
  status: SubStatus;
  expires_at: string;
  created_at: string;
}

export async function getActiveSubscription(
  userId: string
): Promise<Subscription | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .single();
  return data ?? null;
}

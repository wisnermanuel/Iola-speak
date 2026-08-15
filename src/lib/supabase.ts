export { supabase } from "@/integrations/supabase/client";
import { supabase } from "@/integrations/supabase/client";

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

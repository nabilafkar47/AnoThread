import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Get the currently authenticated user and their profile.
 * Returns null if not authenticated.
 */
export async function getAuthUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

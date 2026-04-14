import "server-only";
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

/**
 * Get the currently authenticated user and their profile.
 * Returns null if not authenticated.
 * Wrapped in React cache to deduplicate calls between Layouts and Pages.
 */
export const getAuthUser = cache(async () => {
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
});

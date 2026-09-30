import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Service-role client that bypasses RLS and can use the auth admin API.
 * Server-only: never import this from client components. Callers must check
 * that the requesting user is allowed to perform the action first.
 * Returns null when SUPABASE_SERVICE_ROLE_KEY is not configured.
 */
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return null;

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

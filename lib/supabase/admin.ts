// lib/supabase/admin.ts
// Supabase admin client — bypasses Row Level Security (RLS).
// ONLY use this in server-side code where there's no user session (e.g., Stripe webhooks).
// This uses the service_role key, which has full database access — never expose to the client.

import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

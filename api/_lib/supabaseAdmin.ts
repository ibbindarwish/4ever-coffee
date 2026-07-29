import { createClient } from '@supabase/supabase-js'

// Server-only client using the service role key — bypasses Row Level Security.
// Never import this from client-side (src/) code.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
)

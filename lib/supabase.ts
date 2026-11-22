import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client-side client (uses anon/publishable key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client (uses service role key, bypasses RLS)
// Only use in API routes / server components — never expose to the browser.
// If the key is missing this throws on first use instead of silently falling back to the
// anon key (which, with RLS enabled, would make every query quietly return empty results).
export const supabaseAdmin: SupabaseClient = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : new Proxy({} as SupabaseClient, {
      get() {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set — supabaseAdmin is unavailable')
      },
    })

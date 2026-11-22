// Server-only: imports supabaseAdmin (service role). Never import from client components.
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export type TelcAdmin = { id: number; email: string; name: string | null; role: string }

/**
 * Validates the `Authorization: Bearer <token>` header against telc_admin_sessions.
 * Returns the admin on success, or a 401 response to return directly from the route.
 *
 *   const auth = await requireTelcAdmin(req)
 *   if (auth instanceof NextResponse) return auth
 */
export async function requireTelcAdmin(req: Request): Promise<TelcAdmin | NextResponse> {
  const header = req.headers.get("authorization") ?? ""
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : ""
  if (!token) return unauthorized()

  const { data: session, error } = await supabaseAdmin
    .from("telc_admin_sessions")
    .select("telc_admins(id, email, name, role)")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle()

  const admin = (session as { telc_admins: TelcAdmin | null } | null)?.telc_admins
  if (error || !admin) return unauthorized()
  return admin
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

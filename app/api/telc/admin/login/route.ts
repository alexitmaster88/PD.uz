import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { randomUUID } from 'crypto'
import { verifyAdminPassword, hashAdminPassword, isLegacyHash, dummyVerify } from '@/lib/admin-password'

// Best-effort brute-force throttling. State is per server instance (serverless instances
// don't share memory), so this slows attacks rather than strictly capping them; scrypt
// hashing plus these limits make online guessing impractical.
const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILS_PER_IP_EMAIL = 5
const MAX_FAILS_PER_EMAIL = 20
const failures = new Map<string, number[]>()

function recentFailures(key: string, now: number): number[] {
  const list = (failures.get(key) ?? []).filter(t => now - t < WINDOW_MS)
  if (list.length) failures.set(key, list)
  else failures.delete(key)
  return list
}

function recordFailure(keys: string[], now: number) {
  for (const k of keys) failures.set(k, [...recentFailures(k, now), now])
  if (failures.size > 10_000) failures.clear() // memory guard
}

function clientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
}

const invalid = () => NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!email || !password || password.length > 256) {
    return NextResponse.json({ error: 'email and password required' }, { status: 400 })
  }

  const now = Date.now()
  const key = email.toLowerCase()
  const ipKey = `ip:${clientIP(req)}|${key}`
  const emailKey = `email:${key}`
  if (
    recentFailures(ipKey, now).length >= MAX_FAILS_PER_IP_EMAIL ||
    recentFailures(emailKey, now).length >= MAX_FAILS_PER_EMAIL
  ) {
    return NextResponse.json(
      { error: 'Too many failed attempts. Please try again in 15 minutes.' },
      { status: 429 }
    )
  }

  const { data: admin, error } = await supabaseAdmin
    .from('telc_admins')
    .select('id, email, name, role, password_hash')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    console.error('[admin/login] lookup failed:', error.message)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }

  if (!admin) {
    await dummyVerify(password)
    recordFailure([ipKey, emailKey], now)
    return invalid()
  }

  const ok = await verifyAdminPassword(password, admin.password_hash)
  if (!ok) {
    recordFailure([ipKey, emailKey], now)
    return invalid()
  }

  failures.delete(ipKey)

  // Transparently upgrade legacy unsalted SHA-256 hashes to scrypt
  if (isLegacyHash(admin.password_hash)) {
    const upgraded = await hashAdminPassword(password)
    const { error: upErr } = await supabaseAdmin
      .from('telc_admins').update({ password_hash: upgraded }).eq('id', admin.id)
    if (upErr) console.error('[admin/login] hash upgrade failed:', upErr.message)
  }

  const token = randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h

  const { error: sessErr } = await supabaseAdmin.from('telc_admin_sessions').insert({
    admin_id: admin.id,
    token,
    expires_at: expiresAt,
  })
  if (sessErr) {
    console.error('[admin/login] session insert failed:', sessErr.message)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  })
}

// Validate a session token
export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 })

  const { data: session } = await supabaseAdmin
    .from('telc_admin_sessions')
    .select('*, telc_admins(id, email, name, role)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (!session) return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })

  return NextResponse.json({ admin: session.telc_admins })
}

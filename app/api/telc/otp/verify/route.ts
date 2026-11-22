import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

// Each wrong guess shortens the code's lifetime by this much. With a 10-minute
// lifetime this allows ~5 guesses per code; a new code requires waiting 60s (see otp/send).
const PENALTY_MS = 2 * 60 * 1000

export async function POST(req: Request) {
  const { email, otp } = await req.json()
  if (!email || !otp || typeof email !== 'string' || typeof otp !== 'string') {
    return NextResponse.json({ error: 'email and otp required' }, { status: 400 })
  }

  // Fetch the active code for this email (not filtered by the guessed value)
  const { data, error } = await supabaseAdmin
    .from('otp_verifications')
    .select('*')
    .eq('email', email)
    .eq('verified', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[OTP] Supabase select error:', error)
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
  }

  const expected = Buffer.from(String(data.otp))
  const given = Buffer.from(otp.trim())
  const matches = expected.length === given.length && timingSafeEqual(expected, given)

  if (!matches) {
    const newExpiry = new Date(new Date(data.expires_at).getTime() - PENALTY_MS).toISOString()
    await supabaseAdmin.from('otp_verifications').update({ expires_at: newExpiry }).eq('id', data.id)
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
  }

  await supabaseAdmin
    .from('otp_verifications')
    .update({ verified: true })
    .eq('id', data.id)

  return NextResponse.json({ success: true })
}

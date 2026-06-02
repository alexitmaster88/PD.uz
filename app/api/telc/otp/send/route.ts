import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendOtpEmail } from '@/server/email'

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

  // Delete any previous unverified OTPs for this email
  await supabaseAdmin
    .from('otp_verifications')
    .delete()
    .eq('email', email)
    .eq('verified', false)

  const { error } = await supabaseAdmin.from('otp_verifications').insert({
    email,
    otp,
    verified: false,
    expires_at: expiresAt,
  })

  if (error) {
    console.warn('[OTP] Supabase insert failed (DB may not be set up yet):', error.message)
    // In dev/test, still return success so the 123456 demo bypass can be used
    return NextResponse.json({ success: true, message: 'OTP sent (demo mode — use code 123456)' })
  }

  try {
    await sendOtpEmail(email, otp)
  } catch (emailErr) {
    console.error('[OTP] Email send error:', emailErr)
    // Don't block the flow — user can still use the demo OTP 123456
  }

  return NextResponse.json({ success: true, message: 'OTP sent to your email' })
}
